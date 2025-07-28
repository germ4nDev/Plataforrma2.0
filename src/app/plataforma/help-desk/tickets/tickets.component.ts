import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DataTablesModule, DataTableDirective } from 'angular-datatables';
import { Subscription, Subject, tap, catchError, of } from 'rxjs';
import { GradientConfig } from 'src/app/app-config';
import { NavBarComponent } from 'src/app/theme/layout/admin/nav-bar/nav-bar.component';
import { NavContentComponent } from 'src/app/theme/layout/admin/navigation/nav-content/nav-content.component';
import { NavigationItem } from 'src/app/theme/layout/admin/navigation/navigation';
import { PTLTicketAPModel } from 'src/app/theme/shared/_helpers/models/PTLTicketAP.model';
import { BreadcrumbComponent } from 'src/app/theme/shared/components/breadcrumb/breadcrumb.component';
import { LanguageService } from 'src/app/theme/shared/service';
import { NavigationService } from 'src/app/theme/shared/service/navigation.service';
import { PTLEstadosService } from 'src/app/theme/shared/service/ptlestados.service';
import { PTLTicketsService } from 'src/app/theme/shared/service/ptltickets.service';
import { PTLTiposEstadosService } from 'src/app/theme/shared/service/ptltipos-estados.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tickets',
  standalone: true,
  imports: [CommonModule, DataTablesModule, SharedModule, TranslateModule, NavBarComponent, NavContentComponent],
  templateUrl: './tickets.component.html',
  styleUrl: './tickets.component.scss'
})
export class TicketsComponent implements OnInit, AfterViewInit {
  //#region VARIABLES
  [x: string]: any;
  @ViewChild(DataTableDirective, { static: false })
  @Output() toggleSidebar = new EventEmitter<void>();
  activeTab: 'menu' | 'filters' | 'main' = 'menu';

  datatableElement!: DataTableDirective;
  registrosSub?: Subscription;
  dtColumnSearchingOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  registros: PTLTicketAPModel[] = [];
  lang: string = localStorage.getItem('lang') || '';
  tituloPagina: string = '';
  tipoEstado: number = 1;
  estadosFiltrados: any[] = [];

  menuItems: NavigationItem[] = [];
  hasFiltersSlot: boolean = false;
  gradientConfig;

  //#endregion VARIABLES

  constructor(
    private router: Router,
    private translate: TranslateService,
    private ticketsService: PTLTicketsService,
    private tiposEstados: PTLTiposEstadosService,
    private estados: PTLEstadosService,
    private languageService: LanguageService,
    private BreadCrumb: BreadcrumbComponent,
    private navigationService: NavigationService,
  ) {
    this.gradientConfig = GradientConfig;
  }

  ngAfterViewInit(): void {
    this.BreadCrumb.setBreadcrumb();
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.columns().every(function () {
        const that = this;
        $('input', this.header()).on('keyup change', function () {
          const valor = $(this).val() as string;
          if (that.search() !== valor) {
            that.search(valor).draw();
          }
        });
      });
    });
  }

  ngOnInit() {
   const appCode = localStorage.getItem('aplicacionId') || 'plataforma';
    this.menuItems = this.navigationService.getNavigationItems(appCode);
    console.log('elementos menu componente', this.menuItems);
    this.hasFiltersSlot = true;
      this.translate
        .get([
            'TICKETS.NOMBRETICKET',
            'TICKETS.DESCRIPCIONTICKET',
            'TICKETS.ESTADOTICKET'
        ])
        .subscribe((translations) => {
          this.tituloPagina = translations['TICKETS.TITLE'];
          this.dtColumnSearchingOptions = {
            responsive: true,
            columns: [
              { title: translations['TICKETS.NOMBRETICKET'], data: 'nombreTicket' },
              { title: translations['TICKETS.DESCRIPCIONTICKET'], data: 'descripcionTicket' },
              { title: translations['TICKETS.ESTADOTICKET'], data: 'estadoTicket' },
              { title: translations['PLATAFORMA.OPTIONS'], data: 'opciones' }
            ]
          };
          this.consultarRegistros();
          this.consultarEstado();
        });
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

consultarEstado() {
  this.estados
    .getRegistros()
    .pipe(
      tap((resp: any) => {
        if (resp.ok) {
          // Filtra los estados con tipoEstado igual a 1
          const estadosFiltrados = resp.estados.filter(
            (estado: any) => estado.tipoEstado = this.tipoEstado
          );
          console.log('Estados con tipoEstado = 1:', estadosFiltrados);
          this.estadosFiltrados = estadosFiltrados;

          this.dtTrigger.next(null);
        }
      }),
      catchError((err) => {
        console.error('Error al consultar estados:', err);
        return of(null);
      })
    )
    .subscribe();
}

  consultarRegistros() {
    this.registrosSub = this.ticketsService
      .getRegistros()
      .pipe(
        tap((resp: any) => {
          if (resp.ok) {
            resp.tickets.forEach((ticket: any) => {
              ticket.nomEstado = ticket.estadoTicket == true ? 'Activo' : 'Inactivo';
            });
            this.registros = resp.tickets;
            console.log('Todos las tickets', this.registros);
            this.dtTrigger.next(null);
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

  filtrarColumna(columna: number, valor: string) {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.column(columna).search(valor).draw();
    });
  }

  OnNuevoRegistroClick() {
    this.router.navigate(['help-desk/gestion-ticket/']);
  }

  OnEditarRegistroClick(id: number) {
    this.router.navigate(['help-desk/gestion-ticket/'], { queryParams: { regId: id } });
  }

  OnEliminarRegistroClick(id: number, nombre: string) {
    Swal.fire({
      title: this.translate.instant('TICKETS.ELIMINARTITULO'),
      text: this.translate.instant('TICKETS.ELIMINARTEXTO') + `"${nombre}".!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: this.translate.instant('PLATAFORMA.DELETE'),
      cancelButtonText: this.translate.instant('PLATAFORMA.CANCEL')
    }).then((result: any) => {
      if (result.isConfirmed) {
        this.ticketsService.deleteEliminarRegistro(id).subscribe({
          next: (resp: any) => {
            Swal.fire(this.translate.instant('TICKETS.ELIMINAREXITOSA'), resp.mensaje, 'success');
            this.registros = this.registros.filter((s) => s.ticketId !== id);
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
