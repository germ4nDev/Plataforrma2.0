/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DataTablesModule } from 'angular-datatables';
import { Subscription, tap, catchError, of, Observable } from 'rxjs';
import { PTLTicketAPModel } from 'src/app/theme/shared/_helpers/models/PTLTicketAP.model';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { DatatableComponent } from 'src/app/theme/shared/components/data-table/data-table.component';
import { NavContentComponent } from 'src/app/theme/layout/admin/navigation/nav-content/nav-content.component';
import { NavBarComponent } from 'src/app/theme/layout/admin/nav-bar/nav-bar.component';
import { NavigationItem } from 'src/app/theme/layout/admin/navigation/navigation';
import { GradientConfig } from 'src/app/app-config';
import { ColumnMetadata } from 'src/app/theme/shared/_helpers/models/ColumnMetadata.model';
import { PTLModuloAP } from 'src/app/theme/shared/_helpers/models/PTLModuloAP.model';
import { PTLSuiteAPModel } from 'src/app/theme/shared/_helpers/models/PTLSuiteAP.model';
import { PTLUsuarioModel } from 'src/app/theme/shared/_helpers/models/PTLUsuario.model';
import { PTLEstadoModel } from 'src/app/theme/shared/_helpers/models/PTLEstado.model';
import { PTLAplicacionModel } from 'src/app/theme/shared/_helpers/models/PTLAplicacion.model';
import {
  NavigationService,
  PtlAplicacionesService,
  PTLEstadosService,
  PtllogActividadesService,
  SwalAlertService,
  PTLTicketsService,
  PtlSuitesAPService,
  PtlmodulosApService,
  PTLUsuariosService
} from 'src/app/theme/shared/service';
import { environment } from 'src/environments/environment';

const base_url = environment.apiUrl;
import Swal from 'sweetalert2';

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
  suitesSub?: Subscription;
  modulosSub?: Subscription;
  usuariosSub?: Subscription;
  usuarios: PTLUsuarioModel[] = [];
  suites: PTLSuiteAPModel[] = [];
  modulos: PTLModuloAP[] = [];
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
    private _modulosService: PtlmodulosApService,
    private _suitesService: PtlSuitesAPService,
    private _usuariosService: PTLUsuariosService,
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
    this.consultarSuites();
    this.consultarModulos();
    this.consultarUsuairos();
    setTimeout(() => {
      this.consultarRegistros();
    }, 1000);
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

  consultarSuites() {
    this.suitesSub = this._suitesService
      .geSuitesAP()
      .pipe(
        tap((resp: any) => {
          if (resp.ok) {
            this.suites = resp.suites;
            console.log('Todos las suites', this.suites);
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

  consultarModulos() {
    this.modulosSub = this._modulosService
      .getRegistros()
      .pipe(
        tap((resp: any) => {
          if (resp.ok) {
            this.modulos = resp.modulos;
            console.log('Todos las modulos padre', this.modulos);
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

  consultarUsuairos() {
    this.modulosSub = this._usuariosService
      .getUsuarios()
      .pipe(
        tap((resp: any) => {
          if (resp.ok) {
            console.log('todos los usuarios', resp.usuarios);
            this.usuarios = resp.usuarios;
            console.log('Todos las usuarios padre', this.usuarios);
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
      name: 'fechaTicket',
      header: 'TICKETS.FECHACREACION',
      type: 'date'
    },
    {
      name: 'nombreTicket',
      header: 'TICKETS.NOMBRETICKET',
      type: 'text'
    },
    {
      name: 'nomSender',
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
      type: 'estado'
    }
  ];

  columnasDetailRegistros: ColumnMetadata[] = [
    {
      name: 'codigoTicket',
      header: 'TICKETS.CODIGOTICKET',
      type: 'text'
    },
    {
      name: 'nomAplicacion',
      header: 'TICKETS.NOMMAPLICACION',
      type: 'text'
    },
    {
      name: 'nomSuite',
      header: 'TICKETS.NOMBRESUITE',
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
      type: 'date'
    },
    {
      name: 'nomAsignado',
      header: 'TICKETS.NOMUSUARIOASIGNADO',
      type: 'text'
    },
    {
      name: 'descripcionTicket',
      header: 'TICKETS.DESCRIPCIONTICKET',
      type: 'text'
    },
    {
      name: 'definicionRequerimiento',
      header: 'TICKETS.DEFINICIONREQUERIMIENTO',
      type: 'text'
    },
    {
      name: 'captura',
      header: 'TICKETS.CAPTURA',
      type: 'capture'
    }
  ];

  consultarRegistros() {
    this.registrosSub = this._ticketsService
      .getRegistros()
      .pipe(
        tap((resp: any) => {
          if (resp.ok) {
            resp.tickets.forEach((ticket: any) => {
              ticket.color = ticket.colorPrioridad;
              ticket.captura = `${base_url}/upload/tickets/${ticket.capturaTicket}`;
              const app =
                ticket.codigoAplicacion != '' ? this.aplicaciones.filter((x) => x.codigoAplicacion == ticket.codigoAplicacion)[0] : {};
              const sui = ticket.codigoSuite != '' ? this.suites.filter((x) => x.codigoSuite == ticket.codigoSuite)[0] : {};
              const mod = ticket.codigoModulo != '' ? this.modulos.filter((x) => x.codigoModulo == ticket.codigoModulo)[0] : {};
              const usu =
                ticket.codigoUsuarioSender != '' ? this.usuarios.filter((x) => x.codigoUsuario == ticket.codigoUsuarioSender)[0] : {};
              const usuA =
                ticket.codigoUsuarioAsignado != '' ? this.usuarios.filter((x) => x.codigoUsuario == ticket.codigoUsuarioAsignado)[0] : {};
              ticket.nomAplicacion = app.nombreAplicacion || '';
              ticket.nomSuite = sui.nombreSuite || '';
              ticket.nomModulo = mod.nombreModulo || '';
              ticket.nomSender = usu.nombreUsuario || '';
              ticket.nomAsignado = usuA.nombreUsuario || '';
            });
            this.registros = resp.tickets;
            this.registrosFiltrado = this.registros;
            console.log('Todos las tickets', this.registrosFiltrado);
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
    this.router.navigate(['tickets/gestion-ticket'], { queryParams: { regId: 'nuevo' } });
  }

  OnEditarRegistroClick(id: number) {
    this.router.navigate(['tickets/gestion-ticket'], { queryParams: { regId: id } });
  }

  onFiltroAplicacionChangeClick(evento: any) {
    console.log('filtrar el estado ', evento.target.value);
    if (evento.target.value == 'todos') {
      this.registrosFiltrado = this.registros;
    } else {
      this.registrosFiltrado = this.registrosFiltrado.filter((x) => x.codigoAplicacion == evento.target.value);
    }
  }

  onFiltroSuiteChangeClick(evento: any) {
    console.log('filtrar el estado ', evento.target.value);
    if (evento.target.value == 'todos') {
      this.registrosFiltrado = this.registros;
    } else {
      this.registrosFiltrado = this.registrosFiltrado.filter((x) => x.codigoSuite == evento.target.value);
    }
  }

  onFiltroModuloChangeClick(evento: any) {
    console.log('filtrar el estado ', evento.target.value);
    if (evento.target.value == 'todos') {
      this.registrosFiltrado = this.registros;
    } else {
      this.registrosFiltrado = this.registrosFiltrado.filter((x) => x.codigoModulo == evento.target.value);
    }
  }

  onFiltroSenderChangeClick(evento: any) {
    console.log('filtrar el estado ', evento.target.value);
    if (evento.target.value == 'todos') {
      this.registrosFiltrado = this.registros;
    } else {
      this.registrosFiltrado = this.registrosFiltrado.filter((x) => x.codigoUsuarioSender == evento.target.value);
    }
  }

  onFiltroAsignadoChangeClick(evento: any) {
    console.log('filtrar el estado ', evento.target.value);
    if (evento.target.value == 'todos') {
      this.registrosFiltrado = this.registros;
    } else {
      this.registrosFiltrado = this.registrosFiltrado.filter((x) => x.codigoUsuarioAsignado == evento.target.value);
    }
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
      this.registrosFiltrado = this.registrosFiltrado.filter((x) => x.estadoTicket == evento.target.value);
    }
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
        console.log('id', id.id);
        const ticket = this.registros.filter((x) => x.codigoTicket == id.id)[0];
        ticket.estadoTicket = 'EL';
        this._ticketsService.putModificarRegistro(ticket).subscribe({
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

  toggleNav(): void {
    this.toggleSidebar.emit();
  }
}
