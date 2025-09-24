import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DataTablesModule} from 'angular-datatables';
import { Subscription, tap, catchError, of } from 'rxjs';
import { PTLRequerimientoTKModel } from 'src/app/theme/shared/_helpers/models/PTLRequerimientoTK.model';
import { NavigationService } from 'src/app/theme/shared/service';
import { PTLRequerimientosTkService } from 'src/app/theme/shared/service/ptlrequerimientos-tk.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import Swal from 'sweetalert2';
import { DatatableComponent } from "src/app/theme/shared/components/data-table/data-table.component";
import { NavContentComponent } from "src/app/theme/layout/admin/navigation/nav-content/nav-content.component";
import { NavBarComponent } from "src/app/theme/layout/admin/nav-bar/nav-bar.component";
import { NavigationItem } from 'src/app/theme/layout/admin/navigation/navigation';
import { GradientConfig } from 'src/app/app-config';
import { PTLEstadosService } from 'src/app/theme/shared/service/ptlestados.service';

@Component({
    selector: 'app-requerimientos',
    standalone: true,
    imports: [CommonModule, DataTablesModule, SharedModule, TranslateModule, NavBarComponent, NavContentComponent, DatatableComponent],
    templateUrl: './requerimientos.component.html',
    styleUrl: './requerimientos.component.scss'
})
export class RequerimientosComponent implements OnInit, AfterViewInit {
    @Output() toggleSidebar = new EventEmitter<void>();

    //#region VARIABLES
    registrosSub?: Subscription;
    registros: PTLRequerimientoTKModel[] = [];
    registrosFiltrado: PTLRequerimientoTKModel[] = [];
    lang: string = localStorage.getItem('lang') || '';
    tituloPagina: string = '';
    gradientConfig;
    hasFiltersSlot: boolean = false;
    menuItems: NavigationItem[] = [];
    activeTab: 'menu' | 'filters' | 'main' = 'menu';
    tipoEstado: string = "";
    estadosFiltrados: any[] = [];
    //#endregion VARIABLES
    constructor(
        private router: Router,
        private translate: TranslateService,
        private navigationService: NavigationService,
        private requerimientosService: PTLRequerimientosTkService,
        private estadosService: PTLEstadosService
    ) {
        this.gradientConfig = GradientConfig;
    }
    ngOnInit() {
        const appCode = localStorage.getItem('aplicacionId') || 'plataforma';
        this.menuItems = this.navigationService.getNavigationItems(appCode);
        this.hasFiltersSlot = true;
        this.consultarRegistros();
        this.consultarEstado();
    }

    consultarRegistros() {
        console.log('formregistro', this.requerimientosService);
        this.registrosSub = this.requerimientosService
            .getRegistros()
            .pipe(
                tap((resp: any) => {
                    console.log('que me trae', resp);

                    if (resp.ok) {
                        resp.requerimientos.forEach((Requerimiento: any) => {
                            Requerimiento.nomEstado = Requerimiento.estadoRequerimiento;
                        });
                        this.registros = resp.requerimientos;
                        this.registrosFiltrado = this.registros;
                        console.log('Todos las Requerimientos', this.registros);
                        // this.dtTrigger.next(null);
                        return;
                    }
                }),
                catchError((err) => {
                    console.log('Ha ocurrido un error', err);
                    return of(null);
                })
            )
            .subscribe();
    }
    consultarEstado() {
    this.estadosService
        .getRegistros()
        .pipe(
        tap((resp: any) => {
            if (resp.ok) {
            this.estadosFiltrados = resp.estados;
            console.log('Estados filtrados:', this.estadosFiltrados);
            }
        }),
        catchError((err) => {
            console.error('Error al consultar estados:', err);
            return of(null);
        })
        )
        .subscribe();
    }

    ngAfterViewInit(): void {
    }

    ngOnDestroy(): void {
        // this.dtTrigger.unsubscribe();
    }

    OnNuevoRegistroClick() {
        this.router.navigate(['help-desk/gestion-requerimiento/']);
    }

    OnEditarRegistroClick(id: number) {
        this.router.navigate(['help-desk/gestion-requerimiento/'], { queryParams: { regId: id } });
    }

    OnEliminarRegistroClick(id: any) {
        Swal.fire({
            title: this.translate.instant('REQUERIMIENTOS.ELIMINARTITULO'),
            text: this.translate.instant('REQUERIMIENTOS.ELIMINARTEXTO') + `registro!`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: this.translate.instant('PLATAFORMA.DELETE'),
            cancelButtonText: this.translate.instant('PLATAFORMA.CANCEL')
        }).then((result: any) => {
            if (result.isConfirmed) {
                this.requerimientosService.deleteEliminarRegistro(id.id).subscribe({
                    next: (resp: any) => {
                        Swal.fire(this.translate.instant('REQUERIMIENTOS.ELIMINAREXITOSA'), resp.mensaje, 'success');
                        this.registros = this.registros.filter((s) => s.requerimientoId !== id.id);
                    },
                    error: (err: any) => {
                        Swal.fire('Error', this.translate.instant('REQUERIMIENTOS.ELIMINARERROR'), 'error');
                        console.error('Error eliminando', err);
                    }
                });
            }
        });
    }

    onFiltroNombreChangeClick(evento: any) {
        console.log('filtrar el NOMBRE ', evento.target.value);
        const textoFiltro = evento.target.value.toLowerCase();
        if (!textoFiltro) {
            this.registrosFiltrado = [...this.registros];
        } else {
            this.registrosFiltrado = this.registrosFiltrado.filter((requerimiento) =>
                (requerimiento.nombreRequerimiento || '').toLowerCase().includes(textoFiltro)
            );
            console.log('filtrados', this.registrosFiltrado);
        }
    }

    onFiltroDescripcionChangeClick(evento: any) {
        console.log('filtrar el descripcion ', evento.target.value);
        const textoFiltro = evento.target.value.toLowerCase();
        if (!textoFiltro) {
            this.registrosFiltrado = [...this.registros];
        } else {
            this.registrosFiltrado = this.registrosFiltrado.filter((requerimiento) =>
                (requerimiento.descripcionRequerimiento || '').toLowerCase().includes(textoFiltro)
            );
            console.log('filtrados', this.registrosFiltrado);
        }
    }

    onFiltroEstadoChangeClick(evento: any) {
        console.log('filtrar el estado ', evento.target.value);
        if (evento.target.value == 'todos') {
            this.registrosFiltrado = this.registros;
        } else {
            this.registrosFiltrado = this.registros.filter(x => x.estadoRequerimiento == evento.target.value);
        }
    }

    toggleNav(): void {
        this.toggleSidebar.emit();
    }
}
