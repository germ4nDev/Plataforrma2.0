/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DataTablesModule } from 'angular-datatables';
import { Subscription, tap, catchError, of, Observable } from 'rxjs';
import { PTLTicketAPModel } from 'src/app/theme/shared/_helpers/models/PTLTicketAP.model';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { PTLTicketsService } from 'src/app/theme/shared/service/ptltickets.service';
import { DatatableComponent } from 'src/app/theme/shared/components/data-table/data-table.component';
import { NavContentComponent } from 'src/app/theme/layout/admin/navigation/nav-content/nav-content.component';
import { NavBarComponent } from 'src/app/theme/layout/admin/nav-bar/nav-bar.component';
import { NavigationItem } from 'src/app/theme/layout/admin/navigation/navigation';
import { GradientConfig } from 'src/app/app-config';
import { PTLAplicacionModel } from 'src/app/theme/shared/_helpers/models/PTLAplicacion.model';
import Swal from 'sweetalert2';
import {
  NavigationService,
  PtlAplicacionesService,
  PTLEstadosService,
  PtllogActividadesService,
  SwalAlertService
} from 'src/app/theme/shared/service';
import { ColumnMetadata } from 'src/app/theme/shared/_helpers/models/ColumnMetadata.model';
import { PTLEstadoModel } from 'src/app/theme/shared/_helpers/models/PTLEstado.model';

@Component({
  selector: 'app-tickets',
  standalone: true,
  imports: [CommonModule, DataTablesModule, SharedModule, TranslateModule, DatatableComponent, NavContentComponent, NavBarComponent],
  templateUrl: './tickets.component.html',
  styleUrl: './tickets.component.scss'
})
export class TicketsComponent implements OnInit {
  @Output() toggleSidebar = new EventEmitter<void>();

  //#region VARIABLES
  registros: PTLTicketAPModel[] = [];
  registrosFiltrado: PTLTicketAPModel[] = [];
  aplicaciones: PTLAplicacionModel[] = [];
  aplicacionesSub?: Subscription;
  estadosTicketSub?: Subscription;
  estadosTicket: PTLEstadoModel[] = [];
  lang: string = localStorage.getItem('lang') || '';
  registrosSub?: Subscription;
  tituloPagina: string = '';
  //#endregion VARIABLES
  gradientConfig;
  hasFiltersSlot: boolean = false;
  menuItems!: Observable<NavigationItem[]>;
  activeTab: 'menu' | 'filters' | 'main' = 'menu';

  constructor(
    private router: Router,
    private translate: TranslateService,
    private _navigationService: NavigationService,
    private _ticketsService: PTLTicketsService,
    private _swalService: SwalAlertService,
    private _logActividadesService: PtllogActividadesService,
    private _aplicacionesService: PtlAplicacionesService,
    private _estadosTicketService: PTLEstadosService
  ) {
    this.gradientConfig = GradientConfig;
  }

  ngOnInit() {
    this._navigationService.getNavigationItems();
    this.menuItems = this._navigationService.menuItems$;
    this.hasFiltersSlot = true;
    this.consultarEstadosTicket();
    this.consultarAplicaciones();
    this.consultarRegistros();
  }

  consultarEstadosTicket() {
    this.estadosTicketSub = this._estadosTicketService
      .getRegistros()
      .pipe(
        tap((resp: any) => {
          if (resp.ok) {
            console.log('todos los estados', resp.estados);
            this.estadosTicket = resp.estados;
            console.log('Todos las estados padre', this.estadosTicket);
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

  consultarRegistros() {
    this.registrosSub = this._ticketsService
      .getRegistros()
      .pipe(
        tap((resp: any) => {
          if (resp.ok) {
            resp.tickets.forEach((ticket: any) => {
              ticket.nomEstado = ticket.estadoTicket == true ? 'Activo' : 'Inactivo';
              ticket.nomAplicacion = this.aplicaciones.filter((x) => x.aplicacionId == ticket.aplicacionId)[0].nombreAplicacion || '';
            });
            this.registros = resp.tickets;
            this.registrosFiltrado = this.registros;
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

  columnasRegistros: ColumnMetadata[] = [
    {
      name: 'color',
      header: 'TICKETS.COLOR',
      type: 'color_chip'
    },
    {
      name: 'fechaCreacion',
      header: 'TICKETS.FECHACREACION',
      type: 'text'
    },
    {
      name: 'nombreTicket',
      header: 'TICKETS.NOMBRETICKET',
      type: 'text'
    },
    {
      name: 'nomUsuarioSender',
      header: 'TICKETS.NOMUSUARIOSENDER',
      type: 'text'
    },
    {
      name: 'prioridad',
      header: 'TICKETS.PRIORIDAD',
      type: 'text'
    },
    {
      name: 'estadoTicket',
      header: 'TICKETS.ESTADOTICKET',
      type: 'text'
    }
  ];

  columnasDetailRegistros: ColumnMetadata[] = [
    {
      name: 'codigTicket',
      header: 'TICKETS.CODIGOTICKET',
      type: 'text'
    },
    {
      name: 'nomAplicacion',
      header: 'TICKETS.NOMMAPLICACION',
      type: 'text'
    },
    {
      name: 'nomSuiite',
      header: 'TICKETS.NOMBRESUIR',
      type: 'text'
    },
    {
      name: 'nomModulo',
      header: 'TICKETS.NOMBREMODULO',
      type: 'text'
    },
    {
      name: 'fechaAsignacion',
      header: 'TICKETS.FECHAASIGNACION',
      type: 'text'
    },
    {
      name: 'nomUsuarioAsignado',
      header: 'TICKETS.NOMUSUARIOASIGNADO',
      type: 'text'
    },
    {
      name: 'descripcionTicket',
      header: 'TICKETS.DESCRIPCIONTICKET',
      type: 'text'
    },
    {
      name: 'captura',
      header: 'TICKETS.CAPTURA',
      type: 'image'
    }
  ];

  consultarAplicaciones() {
    this.aplicacionesSub = this._aplicacionesService
      .getAplicaciones()
      .pipe(
        tap((resp: any) => {
          if (resp.ok) {
            this.aplicaciones = resp.aplicaciones;
          }
        }),
        catchError((err) => {
          console.error(err);
          return of([]);
        })
      )
      .subscribe();
  }

  OnNuevoRegistroClick() {
    this.router.navigate(['tickets/gestion-ticket'], { queryParams: { regId: 'nuevo' } });
  }

  OnEditarRegistroClick(id: number) {
    this.router.navigate(['tickets/gestion-ticket'], { queryParams: { regId: id } });
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
        this._ticketsService.deleteEliminarRegistro(id.id).subscribe({
          next: (resp: any) => {
            const logData = {
              codigoTipoLog: '',
              codigoRespuesta: '201',
              descripcionLog: this.translate.instant('MODULOS.ELIMINAREXITOSA') + ' ' + resp.mensaje
            };
            this._logActividadesService.postCrearRegistro(logData).subscribe(() => console.log('log creado exitosamente'));
            this._swalService.getAlertSuccess(this.translate.instant('TICKETS.ELIMINAREXITOSA') + ' ' + resp.mensaje);
            this.consultarRegistros();
          },
          error: (err: any) => {
            const logData = {
              codigoTipoLog: '',
              codigoRespuesta: '501',
              descripcionLog: this.translate.instant('MODULOS.ELIMINARERROR') + ' ' + err.mensaje
            };
            this._logActividadesService.postCrearRegistro(logData).subscribe(() => console.log('log creado exitosamente'));
            this._swalService.getAlertError(this.translate.instant('TICKETS.ELIMINARERROR') + ' ' + err.mensaje);
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
      this.registrosFiltrado = this.registrosFiltrado.filter((ticket) => (ticket.nombreTicket || '').toLowerCase().includes(textoFiltro));
      console.log('filtrados', this.registrosFiltrado);
    }
  }

  onFiltroDescripcionChangeClick(evento: any) {
    console.log('filtrar el descripcion ', evento.target.value);
    const textoFiltro = evento.target.value.toLowerCase();
    if (!textoFiltro) {
      this.registrosFiltrado = [...this.registros];
    } else {
      this.registrosFiltrado = this.registrosFiltrado.filter((ticket) =>
        (ticket.descripcionTicket || '').toLowerCase().includes(textoFiltro)
      );
      console.log('filtrados', this.registrosFiltrado);
    }
  }

  onFiltroEstadoChangeClick(evento: any) {
    console.log('filtrar el estado ', evento.target.value);
    if (evento.target.value == 'todos') {
      this.registrosFiltrado = this.registros;
    } else {
      this.registrosFiltrado = this.registros.filter((x) => x.estadoTicket == evento.target.value);
    }
  }

  toggleNav(): void {
    this.toggleSidebar.emit();
  }
}
