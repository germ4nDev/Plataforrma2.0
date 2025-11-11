/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DataTablesModule } from 'angular-datatables';
import { Subscription, tap, catchError, of, Observable } from 'rxjs';
import { PTLSeguimientoTKModel } from 'src/app/theme/shared/_helpers/models/PTLSeguimientoTK.model';
import {
  NavigationService,
  PtllogActividadesService,
  PTLTicketsService,
  SwalAlertService,
  UploadFilesService
} from 'src/app/theme/shared/service';
import { PTLSeguimientosTKService } from 'src/app/theme/shared/service/ptlseguimientos-tk.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { DatatableComponent } from 'src/app/theme/shared/components/data-table/data-table.component';
import { NavContentComponent } from 'src/app/theme/layout/admin/navigation/nav-content/nav-content.component';
import { NavBarComponent } from 'src/app/theme/layout/admin/nav-bar/nav-bar.component';
import { NavigationItem } from 'src/app/theme/layout/admin/navigation/navigation';
import { GradientConfig } from 'src/app/app-config';
import { PTLEstadosService } from 'src/app/theme/shared/service/ptlestados.service';
import { PTLRequerimientoTKModel } from 'src/app/theme/shared/_helpers/models/PTLRequerimientoTK.model';
import { ColumnMetadata } from 'src/app/theme/shared/_helpers/models/ColumnMetadata.model';
import { PTLTicketAPModel } from 'src/app/theme/shared/_helpers/models/PTLTicketAP.model';
import { PTLEstadoModel } from 'src/app/theme/shared/_helpers/models/PTLEstado.model';
import Swal from 'sweetalert2';

import { environment } from 'src/environments/environment';
const base_url = environment.apiUrl;

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
  registros: PTLSeguimientoTKModel[] = [];
  ticketsSub?: Subscription;
  tickets: PTLTicketAPModel[] = [];
  estadosSub?: Subscription;
  estados: PTLEstadoModel[] = [];
  registrosFiltrado: PTLSeguimientoTKModel[] = [];
  requerimientos: PTLRequerimientoTKModel[] = [];
  lang: string = localStorage.getItem('lang') || '';
  tituloPagina: string = '';
  codigoRegistro: string = '';

  gradientConfig;
  hasFiltersSlot: boolean = false;
  menuItems!: Observable<NavigationItem[]>;
  activeTab: 'menu' | 'filters' | 'main' = 'menu';
  estadosFiltrados: any[] = [];
  tipoEstado: string = '';
  //#endregion VARIABLES

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private translate: TranslateService,
    private _navigationService: NavigationService,
    private _seguimientosService: PTLSeguimientosTKService,
    private _estadosService: PTLEstadosService,
    private _ticketsService: PTLTicketsService,
    private _swalService: SwalAlertService,
    private _uploadService: UploadFilesService,
    private _logActividadesService: PtllogActividadesService
  ) {
    this.gradientConfig = GradientConfig;
    this.route.queryParams.subscribe((params) => {
      if (params['regId']) {
        console.log('=============parametros', params);
        this.codigoRegistro = params['regId'] || '';
        // if (this.codigoRegistro !== 'nuevo') {
        //   console.log('me llena el Id', registroId);
        // } else {
        //   console.log('no llena el Id', registroId);
        // }
      } else {
        this.codigoRegistro = '0';
      }
    });
  }

  ngOnInit() {
    this._navigationService.getNavigationItems();
    this.menuItems = this._navigationService.menuItems$;
    this.hasFiltersSlot = true;
    this.consultarEstados();
    this.consultarTickets();
    setTimeout(() => {
      this.consultarRegistros();
    }, 500);
  }

  columnasRegistros: ColumnMetadata[] = [
    {
      name: 'codigoSeguimiento',
      header: 'TICKETS.SEGUIMIENTOS.CODIGOSEGUIMEINTO',
      type: 'text'
    },
    {
      name: 'fechaSeguimiento',
      header: 'TICKETS.SEGUIMIENTOS.FECHASEGUIMINETO',
      type: 'date'
    },
    {
      name: 'nomTicket',
      header: 'TICKETS.SEGUIMIENTOS.NOMBRETICKET',
      type: 'text'
    },
    {
      name: 'estadoSeguimiento',
      header: 'TICKETS.SEGUIMIENTOS.STATUS',
      type: 'estado'
    }
  ];

  columnasDetailRegistros: ColumnMetadata[] = [
    {
      name: 'descripcionSeguimiento',
      header: 'TICKETS.SEGUIMIENTOS.DESCRIPCIONSEGUIMIENTO',
      type: 'text'
    },
    {
      name: 'captura',
      header: 'TICKETS.SEGUIMIENTOS.CAPTURASEGUIMIENTO',
      type: 'capture'
    }
  ];

  consultarTickets() {
    this.registrosSub = this._ticketsService
      .getRegistros()
      .pipe(
        tap((resp: any) => {
          if (resp.ok) {
            console.log('requerimiento', resp);
            this.tickets = resp.tickets;
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

  consultarEstados() {
    this._estadosService
      .getRegistros()
      .pipe(
        tap((resp: any) => {
          if (resp.ok) {
            this.estados = resp.estados;
            console.log('Estados:', this.estados);
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
    this.registrosSub = this._seguimientosService
      .getRegistros()
      .pipe(
        tap((resp: any) => {
          if (resp.ok) {
            resp.seguimientos.forEach((seguimiento: any) => {
              console.log('datos del seguimiento', seguimiento);
              console.log('todos los ticket', this.tickets);
              const ticket = this.tickets.filter((x) => x.codigoTicket == seguimiento.codigoTicket)[0];
              console.log('datos del ticket', ticket);
              seguimiento.nomTicket = ticket ? ticket.nombreTicket : '';
              seguimiento.captura = `${base_url}/upload/seguimientos/${seguimiento.capturaSeguimiento}`;
            });
            console.log('========================== Codigo seguimiento', this.codigoRegistro);
            if (this.codigoRegistro != '0') {
              this.registros = resp.seguimientos.filter((x: { codigoTicket: string }) => x.codigoTicket == this.codigoRegistro);
              this.registrosFiltrado = this.registros;
            } else {
              this.registros = resp.seguimientos;
              this.registrosFiltrado = resp.seguimientos;
            }
            console.log('Todos las seguimientos', this.registrosFiltrado);
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

  OnBackRegistroClick() {
    this.router.navigate(['/tickets/tickets/']);
  }

  OnNuevoRegistroClick() {
    if (this.codigoRegistro != '') {
      this.router.navigate(['tickets/gestion-seguimiento'], { queryParams: { regId: 'nuevo', tickId: this.codigoRegistro } });
    } else {
      this.router.navigate(['tickets/gestion-seguimiento'], { queryParams: { regId: 'nuevo', tickId: '0' } });
    }
  }

  OnEditarRegistroClick(id: string) {
    this.router.navigate(['tickets/gestion-seguimiento'], { queryParams: { regId: id } });
  }

  OnEliminarRegistroClick(id: any) {
    Swal.fire({
      title: this.translate.instant('SEGUIMIENTOS.ELIMINARTITULO'),
      text: this.translate.instant('SEGUIMIENTOS.ELIMINARTEXTO') + `Registro.!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: this.translate.instant('PLATAFORMA.DELETE'),
      cancelButtonText: this.translate.instant('PLATAFORMA.CANCEL')
    }).then((result: any) => {
      if (result.isConfirmed) {
        this._seguimientosService.deleteEliminarRegistro(id.id).subscribe({
          next: (resp: any) => {
            const logData = {
              codigoTipoLog: '',
              codigoRespuesta: '201',
              descripcionLog: this.translate.instant('SEGUIMIENTOS.ELIMINAREXITOSA') + ' ' + resp.mensaje
            };
            this._logActividadesService.postCrearRegistro(logData).subscribe(() => console.log('log creado exitosamente'));
            const segui = this.registros.filter((x) => x.codigoSeguimiento == id.id)[0];
            console.log('========== datos del segui', segui);
            if (segui.capturaSeguimiento != 'no-imagen.png') {
              const captura = segui.capturaSeguimiento || '';
              console.log('========== eliminar captura', captura);
              this._uploadService.deleteFilePath('seguimientos', captura).subscribe((data: any) => {
                console.log('mensaje', data.mensaje);
              });
            }
            this._swalService.getAlertSuccess(this.translate.instant('SEGUIMIENTOS.ELIMINAREXITOSA') + ' ' + resp.mensaje);
            this.consultarRegistros();
          },
          error: (err: any) => {
            const logData = {
              codigoTipoLog: '',
              codigoRespuesta: '501',
              descripcionLog: this.translate.instant('SEGUIMIENTOS.ELIMINARERROR') + ' ' + err.mensaje
            };
            this._logActividadesService.postCrearRegistro(logData).subscribe(() => console.log('log creado exitosamente'));
            this._swalService.getAlertError(this.translate.instant('SEGUIMIENTOS.ELIMINARERROR') + ' ' + err.mensaje);
            console.error('Error eliminando', err);
          }
        });
      }
    });
  }

  actualizarEstadoTicket() {
    const segIndice = this.obtenerUltimoEstado(this.registros);
    if (segIndice != -1) {
      const seguimiento = this.registros[segIndice];
      const codigoTicket = seguimiento.codigoTicket || '';
      const estado = seguimiento.estadoTicket || '';
      this._ticketsService.getRegistroById(codigoTicket).subscribe((tic: any) => {
        const ticket = tic.ticket;
        ticket.estadoTicket = estado;
        this._ticketsService.putModificarRegistro(ticket).subscribe(() => console.log('ticket actualizado'));
      });
    }
  }

  obtenerUltimoEstado(regs: PTLSeguimientoTKModel[]): number {
    if (regs.length === 0) {
      return -1;
    }
    const registrosOrdenados = [...regs];
    registrosOrdenados.sort((a, b) => {
      const dateA = a.fechaCreacion ? new Date(a.fechaCreacion).getTime() : null;
      const dateB = b.fechaCreacion ? new Date(b.fechaCreacion).getTime() : null;
      if (dateA && dateB) {
        return dateB - dateA;
      }
      if (!dateA && dateB) {
        return 1;
      }
      if (dateA && !dateB) {
        return -1;
      }
      return 0;
    });
    const seguimientoMasReciente = registrosOrdenados[0];
    if (!seguimientoMasReciente.fechaCreacion) {
      return -1;
    }
    const segIndice = this.registros.findIndex((r) => r === seguimientoMasReciente);
    return segIndice;
  }

  onFiltroNombreChangeClick(evento: any) {
    console.log('filtrar el NOMBRE ', evento.target.value);
    const textoFiltro = evento.target.value.toLowerCase();
    if (!textoFiltro) {
      this.registrosFiltrado = [...this.registros];
    } else {
      //   this.registrosFiltrado = this.registrosFiltrado.filter((seguimiento) =>
      //     // (seguimiento.nombreSeguimiento || '').toLowerCase().includes(textoFiltro)
      //   );
      console.log('filtrados', this.registrosFiltrado);
    }
  }

  onFiltroDescripcionChangeClick(evento: any) {
    console.log('filtrar el descripcion ', evento.target.value);
    const textoFiltro = evento.target.value.toLowerCase();
    if (!textoFiltro) {
      this.registrosFiltrado = [...this.registros];
    } else {
      this.registrosFiltrado = this.registrosFiltrado.filter((seguimiento) =>
        (seguimiento.descripcionSeguimiento || '').toLowerCase().includes(textoFiltro)
      );
      console.log('filtrados', this.registrosFiltrado);
    }
  }

  onFiltroEstadoChangeClick(evento: any) {
    console.log('filtrar el estado ', evento.target.value);
    if (evento.target.value == 'todos') {
      this.registrosFiltrado = this.registros;
    } else {
      this.registrosFiltrado = this.registros.filter((x) => x.estadoSeguimiento == evento.target.value);
    }
  }

  toggleNav(): void {
    this.toggleSidebar.emit();
  }
}
