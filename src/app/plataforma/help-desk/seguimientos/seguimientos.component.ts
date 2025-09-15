import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DataTablesModule, DataTableDirective } from 'angular-datatables';
import { Subscription, Subject, tap, catchError, of } from 'rxjs';
import { PTLSeguimientoRQModel } from 'src/app/theme/shared/_helpers/models/PTLSeguimientoRQ.model';
import { BreadcrumbComponent } from 'src/app/theme/shared/components/breadcrumb/breadcrumb.component';
import { LanguageService, NavigationService } from 'src/app/theme/shared/service';
import { PTLSeguimientosRqService } from 'src/app/theme/shared/service/ptlseguimientos-rq.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import Swal from 'sweetalert2';
import { DatatableComponent } from "src/app/theme/shared/components/data-table/data-table.component";
import { NavContentComponent } from "src/app/theme/layout/admin/navigation/nav-content/nav-content.component";
import { NavBarComponent } from "src/app/theme/layout/admin/nav-bar/nav-bar.component";
import { NavigationItem } from 'src/app/theme/layout/admin/navigation/navigation';
import { GradientConfig } from 'src/app/app-config';

@Component({
    selector: 'app-seguimientos',
    standalone: true,
    imports: [CommonModule, DataTablesModule, SharedModule, TranslateModule, NavBarComponent, NavContentComponent, DatatableComponent],
    templateUrl: './seguimientos.component.html',
    styleUrl: './seguimientos.component.scss'
})
export class SeguimientosComponent implements OnInit {
    @Output() toggleSidebar = new EventEmitter<void>();

    //#region VARIABLES
    registrosSub?: Subscription;
    registros: PTLSeguimientoRQModel[] = [];
    lang: string = localStorage.getItem('lang') || '';
    tituloPagina: string = '';

    gradientConfig;
    hasFiltersSlot: boolean = false;
    menuItems: NavigationItem[] = [];
    activeTab: 'menu' | 'filters' | 'main' = 'menu';
    //#endregion VARIABLES

    constructor(
        private router: Router,
        private translate: TranslateService,
        private navigationService: NavigationService,
        private seguimientosService: PTLSeguimientosRqService,
        private languageService: LanguageService,
        private BreadCrumb: BreadcrumbComponent
    ) {
        this.gradientConfig = GradientConfig;
    }

    ngOnInit() {
        const appCode = localStorage.getItem('aplicacionId') || 'plataforma';
        this.menuItems = this.navigationService.getNavigationItems(appCode);
        this.hasFiltersSlot = true;
        this.consultarRegistros();
    }

    ngOnDestroy(): void {
    }
    consultarRegistros() {
        this.registrosSub = this.seguimientosService
            .getRegistros()
            .pipe(
                tap((resp: any) => {
                    if (resp.ok) {
                        resp.seguimientos.forEach((seguimiento: any) => {
                            seguimiento.nomEstado = seguimiento.estadoSeguimiento;
                        });
                        this.registros = resp.seguimientos;
                        console.log('Todos las seguimientos', this.registros);
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

    OnNuevoRegistroClick() {
        this.router.navigate(['help-desk/gestion-seguimiento/']);
    }

    OnEditarRegistroClick(id: number) {
        this.router.navigate(['help-desk/gestion-seguimiento/'], { queryParams: { regId: id } });
    }

    OnEliminarRegistroClick(id: number) {
        Swal.fire({
            title: this.translate.instant('SEGUIMIENTOS.ELIMINARTITULO'),
            text: this.translate.instant('SEGUIMIENTOS.ELIMINARTEXTO') + `Registro.!`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: this.translate.instant('PLATAFORMA.DELETE'),
            cancelButtonText: this.translate.instant('PLATAFORMA.CANCEL')
        }).then((result: any) => {
            if (result.isConfirmed) {
                this.seguimientosService.deleteEliminarRegistro(id).subscribe({
                    next: (resp: any) => {
                        Swal.fire(this.translate.instant('SEGUIMIENTOS.ELIMINAREXITOSA'), resp.mensaje, 'success');
                        this.registros = this.registros.filter((s) => s.seguimientoId !== id);
                    },
                    error: (err: any) => {
                        Swal.fire('Error', this.translate.instant('SEGUIMIENTOS.ELIMINARERROR'), 'error');
                        console.error('Error eliminando', err);
                    }
                });
            }
        });
    }

    toggleNav(): void {
        this.toggleSidebar.emit();
    }
}
