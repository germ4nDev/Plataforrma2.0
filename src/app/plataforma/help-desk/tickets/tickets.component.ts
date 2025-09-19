import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DataTablesModule, DataTableDirective } from 'angular-datatables';
import { Subscription, Subject, tap, catchError, of } from 'rxjs';
import { PTLTicketAPModel } from 'src/app/theme/shared/_helpers/models/PTLTicketAP.model';
import { BreadcrumbComponent } from 'src/app/theme/shared/components/breadcrumb/breadcrumb.component';
import { LanguageService, NavigationService } from 'src/app/theme/shared/service';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import Swal from 'sweetalert2';
import { PTLTicketsService } from 'src/app/theme/shared/service/ptltickets.service';
import { DatatableComponent } from "src/app/theme/shared/components/data-table/data-table.component";
import { NavContentComponent } from "src/app/theme/layout/admin/navigation/nav-content/nav-content.component";
import { NavBarComponent } from "src/app/theme/layout/admin/nav-bar/nav-bar.component";
import { NavigationItem } from 'src/app/theme/layout/admin/navigation/navigation';
import { GradientConfig } from 'src/app/app-config';

@Component({
    selector: 'app-tickets',
    standalone: true,
    imports: [CommonModule, DataTablesModule, SharedModule, TranslateModule, DatatableComponent, NavContentComponent, NavBarComponent],
    templateUrl: './tickets.component.html',
    styleUrl: './tickets.component.scss'
})
export class TicketsComponent implements OnInit, AfterViewInit {
    @Output() toggleSidebar = new EventEmitter<void>();

    //#region VARIABLES
    registros: PTLTicketAPModel[] = [];
    lang: string = localStorage.getItem('lang') || '';
    registrosSub?: Subscription;
    tituloPagina: string = '';
    //#endregion VARIABLES
    gradientConfig;
    hasFiltersSlot: boolean = false;
    menuItems: NavigationItem[] = [];
    activeTab: 'menu' | 'filters' | 'main' = 'menu';

    constructor(
        private router: Router,
        private translate: TranslateService,
        private ticketsService: PTLTicketsService,
        private navigationService: NavigationService,
        private languageService: LanguageService,
        private BreadCrumb: BreadcrumbComponent
    ) {
        this.gradientConfig = GradientConfig;
    }

    ngAfterViewInit(): void {
        // this.BreadCrumb.setBreadcrumb();
        // this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
        //     dtInstance.columns().every(function () {
        //         const that = this;
        //         $('input', this.header()).on('keyup change', function () {
        //             const valor = $(this).val() as string;
        //             if (that.search() !== valor) {
        //                 that.search(valor).draw();
        //             }
        //         });
        //     });
        // });
    }

    ngOnInit() {
        const appCode = localStorage.getItem('aplicacionId') || 'plataforma';
        this.menuItems = this.navigationService.getNavigationItems(appCode);
        this.hasFiltersSlot = true;
        this.consultarRegistros();

        // this.languageService.currentLang$.subscribe((lang) => {
        //     this.translate.use(lang);
        //     this.translate
        //         .get(['TICKETS.NOMBRETICKET', 'TICKETS.DESCRIPCIONTICKET', 'TICKETS.ESTADOTICKET'])
        //         .subscribe((translations) => {
        //             this.tituloPagina = translations['TICKETS.TITLE'];
        //             this.dtColumnSearchingOptions = {
        //                 responsive: true,
        //                 columns: [
        //                     { title: translations['TICKETS.NOMBRETICKET'], data: 'nombreTicket' },
        //                     { title: translations['TICKETS.DESCRIPCIONTICKET'], data: 'descripcionTicket' },
        //                     { title: translations['TICKETS.ESTADOTICKET'], data: 'estadoTicket' },
        //                     { title: translations['PLATAFORMA.OPTIONS'], data: 'opciones' }
        //                 ]
        //             };
        //             this.consultarRegistros();
        //         });
        // });
    }

    ngOnDestroy(): void {
    }

    consultarRegistros() {
        this.registrosSub = this.ticketsService
            .getRegistros()
            .pipe(
                tap((resp: any) => {
                    if (resp.ok) {
                        resp.tickets.forEach((role: any) => {
                            role.nomEstado = role.estadoTicket == true ? 'Activo' : 'Inactivo';
                        });
                        this.registros = resp.tickets;
                        console.log('Todos las tickets', this.registros);
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
        this.router.navigate(['help-desk/gestion-ticket']);
    }

    OnEditarRegistroClick(id: number) {
        this.router.navigate(['help-desk/gestion-ticket'], { queryParams: { regId: id } });
    }

    OnEliminarRegistroClick(id: any) {
        Swal.fire({
            title: this.translate.instant('TICKETS.ELIMINARTITULO'),
            text: this.translate.instant('TICKETS.ELIMINARTEXTO'),
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: this.translate.instant('PLATAFORMA.DELETE'),
            cancelButtonText: this.translate.instant('PLATAFORMA.CANCEL')
        }).then((result: any) => {
            if (result.isConfirmed) {
                this.ticketsService.deleteEliminarRegistro(id.id).subscribe({
                    next: (resp: any) => {
                        Swal.fire(this.translate.instant('TICKETS.ELIMINAREXITOSA'), resp.mensaje, 'success');
                        this.registros = this.registros.filter((s) => s.ticketId !== id.id);
                    },
                    error: (err: any) => {
                        Swal.fire('Error', this.translate.instant('TICKETS.ELIMINARERROR'), 'error');
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


