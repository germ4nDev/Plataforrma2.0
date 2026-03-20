import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DataTablesModule } from 'angular-datatables';
import { Subscription, Observable, tap, catchError, of } from 'rxjs';
import { GradientConfig } from 'src/app/app-config';
import { NavBarComponent } from 'src/app/theme/layout/admin/nav-bar/nav-bar.component';
import { NavContentComponent } from 'src/app/theme/layout/admin/navigation/nav-content/nav-content.component';
import { ColumnMetadata } from 'src/app/theme/shared/_helpers/models/ColumnMetadata.model';
import { NavigationItem } from 'src/app/theme/shared/_helpers/models/Navigation.model';
import { PTLAplicacionModel } from 'src/app/theme/shared/_helpers/models/PTLAplicacion.model';
import { PTLItemPaquete } from 'src/app/theme/shared/_helpers/models/PTLItemPaquete.model';
import { PTLPaqueteModel } from 'src/app/theme/shared/_helpers/models/PTLPaquete.model';
import { DatatableComponent } from 'src/app/theme/shared/components/data-table/data-table.component';
import { NavigationService, SwalAlertService, LocalStorageService, PtllogActividadesService, PTLPaquetesService, PtlAplicacionesService } from 'src/app/theme/shared/service';
import { PtlItemsPaqueteService } from 'src/app/theme/shared/service/ptlitems-paquete.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-items-paquete',
    standalone: true,
    imports: [CommonModule, DataTablesModule, SharedModule, TranslateModule, NavBarComponent, NavContentComponent, DatatableComponent],
    templateUrl: './items-paquete.component.html',
    styleUrl: './items-paquete.component.scss'
})
export class ItemsPaqueteComponent {
    @Output() toggleSidebar = new EventEmitter<void>();
    itemsPaqueteSub?: Subscription;
    registrosSub?: Subscription;
    registros: PTLItemPaquete[] = [];
    registrosFiltrado: PTLItemPaquete[] = [];
    aplicaciones: PTLAplicacionModel[] = [];
        registroId: string = '';
    modoEdicion: boolean = false;

    moduloTituloExcel: string = '';
    filtroPersonalizado: string = '';
    hasFiltersSlot: boolean = false;
    gradientConfig;
    lang = localStorage.getItem('lang');
    menuItems$!: Observable<NavigationItem[]>;
    activeTab: 'menu' | 'filters' | 'main' = 'menu';

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private translate: TranslateService,
        private _navigationService: NavigationService,
        private _swalService: SwalAlertService,
        private _localstorageService: LocalStorageService,
        private _logActividadesService: PtllogActividadesService,
        private _registrosService: PtlItemsPaqueteService
    ) {
        this.gradientConfig = GradientConfig;
        this.route.queryParams.subscribe((params) => {
            this.registroId = params['regId'] || '';
            console.log('regId', this.registroId);
                this.modoEdicion = true;
                this._registrosService.getRegistros().subscribe({
                    next: (resp: any) => {
                        console.log('resp', resp);
                        this.registrosFiltrado = resp;
                    },
                    error: (err) => {
                        Swal.fire('Error', 'No se pudo obtener los items del paquete por, ', err);
                    }
                });
                this.modoEdicion = false;
                this.registrosFiltrado = [];
        });
    }

    ngOnInit(): void {
        this._navigationService.getNavigationItems();
        this.menuItems$ = this._navigationService.menuItems$;
        this.hasFiltersSlot = true;
        this.moduloTituloExcel = this.lang == 'es' ? 'Listado de Suitees' : 'List of Aplications';
        this.consultarRegistros();
    }

    consultarRegistros(): void {
        this.registrosSub = this._registrosService
            .getRegistros()
            .pipe(
                tap((resp: any) => {
                    if (resp.ok) {
                        resp.itemsPaquete.forEach((reg: any) => {
                            reg.nomEstado = reg.estadoItem ? 'Activo' : 'Inactivo';
                        });
                        this.registros = resp.itemsPaquete;
                        this.registrosFiltrado = resp.itemsPaquete;
                    }
                }),
                catchError((err) => {
                    console.error(err);
                    return of([]);
                })
            )
            .subscribe();
    }

    columnasPaquetes: ColumnMetadata[] = [
        {
            name: 'nombreItem',
            header: 'ITEMS.NAME',
            type: 'text'
        },
        {
            name: 'cantidad',
            header: 'ITEMS.CANTIDAD',
            type: 'number'
        },
        {
            name: 'valorUnitario',
            header: 'ITEMS.VALOR',
            type: 'price'
        },
        {
            name: 'valoresAdicionales',
            header: 'ITEMS.ADICIONALES',
            type: 'price'
        },
        {
            name: 'valorTotal',
            header: 'ITEMS.TOTAL',
            type: 'price'
        },
        {
            name: 'nomEstado',
            header: 'ITEMS.STATUS',
            type: 'text'
        }
    ];

    columnasDetailRegistros: ColumnMetadata[] = [
        {
            name: 'codigoItem',
            header: 'ITEMS.CODE',
            type: 'text'
        },
        {
            name: 'codigoPaquete',
            header: 'ITEMS.CODEPAQUETE',
            type: 'text'
        },
        {
            name: 'codigoValor',
            header: 'ITEMS.CODEVALOR',
            type: 'text'
        },
        {
            name: 'descripcionItem',
            header: 'ITEMS.DESCRIPCION',
            type: 'text'
        }
    ];

    getLanguageUrl(): string {
        const lang = this._localstorageService.getLanguage() || 'en';
        return `//cdn.datatables.net/plug-ins/1.10.25/i18n/${lang === 'es' ? 'Spanish' : 'English'}.json`;
    }

    onFiltroNombreCodigoClick(evento: any) {
        console.log('filtrar el codigo ', evento.target.value);
        if (evento.target.value == 'todos') {
            this.registrosFiltrado = this.registros;
        } else {
            this.registrosFiltrado = this.registrosFiltrado.filter((x) => (x.codigoPaquete = evento.target.value));
        }
    }

    onFiltroNombreChangeClick(evento: any) {
        console.log('filtrar el nombre ', evento.target.value);
        if (evento.target.value == 'todos') {
            this.registrosFiltrado = this.registros;
        } else {
            this.registrosFiltrado = this.registrosFiltrado.filter((x) => (x.nombreItem = evento.target.value));
        }
    }

    onFiltroDescripcionChangeClick(evento: any) {
        console.log('filtrar el descripcion ', evento.target.value);
        const textoFiltro = evento.target.value.toLowerCase();
        if (!textoFiltro) {
            this.registrosFiltrado = [...this.registros];
        } else {
            this.registrosFiltrado = this.registrosFiltrado.filter((app) => (app.descripcionItem || '').toLowerCase().includes(textoFiltro));
            console.log('filtrados', this.registrosFiltrado);
        }
    }

    onFiltroEstadoChangeClick(evento: any) {
        console.log('filtrar el estado ', evento.target.value);
        // const estado: boolean = evento.target.value || true;
        if (evento.target.value == 'todos') {
            this.registrosFiltrado = this.registros;
        } else {
            const estado = evento.target.value == 'true' ? true : false;
            console.log('Suitees', this.registrosFiltrado);
            this.registrosFiltrado = this.registros.filter((x) => x.estadoItem == estado);
        }
    }

    OnNuevoRegistroClick(): void {
        this.router.navigate(['aplicaciones/gestion-item'], { queryParams: { regId: '', regPQ: this.registroId } });
    }

    OnEditarRegistroClick(id: number): void {
        this.router.navigate(['aplicaciones/gestion-item'], { queryParams: { regId: id, regPQ: this.registroId } });
    }

    OnEliminarRegistroClick(id: string): void {
        const nombreApp = this.registrosFiltrado.filter((x) => x.codigoItem == id)[0];
        Swal.fire({
            title: this.translate.instant('APLICACIONES.ELIMINARTITULO'),
            text: this.translate.instant('APLICACIONES.ELIMINARTEXTO') + `"${nombreApp.nombreItem}".`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: this.translate.instant('PLATAFORMA.DELETE'),
            cancelButtonText: this.translate.instant('PLATAFORMA.CANCEL')
        }).then((result) => {
            if (result.isConfirmed) {
                this._registrosService.deleteEliminarRegistro(id).subscribe({
                    next: (resp: any) => {
                        const logData = {
                            codigoTipoLog: '',
                            codigoRespuesta: '201',
                            descripcionLog: this.translate.instant('APLICACIONES.ELIMINAREXITOSA') + ' ' + resp.mensaje
                        };
                        this._logActividadesService.postCrearRegistro(logData).subscribe(() => console.log('log creado exitosamente'));
                        Swal.fire(this.translate.instant('APLICACIONES.ELIMINAREXITOSA'), resp.mensaje, 'success');
                        this.registros = this.registros.filter((a) => a.codigoItem !== id);
                        this.registrosFiltrado = [...this.registros];
                    },
                    error: (err) => {
                        const logData = {
                            codigoTipoLog: '',
                            codigoRespuesta: '501',
                            descripcionLog: this.translate.instant('APLICACIONES.ELIMINARERROR') + ' ' + err.mensaje
                        };
                        this._logActividadesService.postCrearRegistro(logData).subscribe(() => console.log('log creado exitosamente'));
                        Swal.fire('Error', this.translate.instant('APLICACIONES.ELIMINARERROR'), 'error');
                    }
                });
            }
        });
    }

    toggleNav(): void {
        this.toggleSidebar.emit();
    }

}
