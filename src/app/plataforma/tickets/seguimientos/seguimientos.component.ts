/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DataTablesModule } from 'angular-datatables';
import { Subscription, tap, catchError, of, Observable } from 'rxjs';
import { PTLSeguimientoRQModel } from 'src/app/theme/shared/_helpers/models/PTLSeguimientoTK.model';
import { NavigationService, PTLTicketsService } from 'src/app/theme/shared/service';
import { PTLSeguimientosRqService } from 'src/app/theme/shared/service/ptlseguimientos-rq.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { DatatableComponent } from 'src/app/theme/shared/components/data-table/data-table.component';
import { NavContentComponent } from 'src/app/theme/layout/admin/navigation/nav-content/nav-content.component';
import { NavBarComponent } from 'src/app/theme/layout/admin/nav-bar/nav-bar.component';
import { NavigationItem } from 'src/app/theme/layout/admin/navigation/navigation';
import { GradientConfig } from 'src/app/app-config';
import { PTLEstadosService } from 'src/app/theme/shared/service/ptlestados.service';
import { PTLRequerimientoTKModel } from 'src/app/theme/shared/_helpers/models/PTLRequerimientoTK.model';
import { PTLRequerimientosTkService } from 'src/app/theme/shared/service/ptlrequerimientos-tk.service';
import Swal from 'sweetalert2';
import { ColumnMetadata } from 'src/app/theme/shared/_helpers/models/ColumnMetadata.model';
import { PTLTicketAPModel } from 'src/app/theme/shared/_helpers/models/PTLTicketAP.model';
import { PTLEstadoModel } from 'src/app/theme/shared/_helpers/models/PTLEstado.model';
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
  registros: PTLSeguimientoRQModel[] = [];
  ticketsSub?: Subscription;
  tickets: PTLTicketAPModel[] = [];
  estadosSub?: Subscription;
  estados: PTLEstadoModel[] = [];
  registrosFiltrado: PTLSeguimientoRQModel[] = [];
  requerimientos: PTLRequerimientoTKModel[] = [];
  lang: string = localStorage.getItem('lang') || '';
  tituloPagina: string = '';

  gradientConfig;
  hasFiltersSlot: boolean = false;
  menuItems!: Observable<NavigationItem[]>;
  activeTab: 'menu' | 'filters' | 'main' = 'menu';
  estadosFiltrados: any[] = [];
  tipoEstado: string = '';
  //#endregion VARIABLES

  constructor(
    private router: Router,
    private translate: TranslateService,
    private _navigationService: NavigationService,
    private _seguimientosService: PTLSeguimientosRqService,
    private _estadosService: PTLEstadosService,
    private _ticketsService: PTLTicketsService,
    private _requerimientoService: PTLRequerimientosTkService
  ) {
    this.gradientConfig = GradientConfig;
  }

  ngOnInit() {
    this._navigationService.getNavigationItems();
    this.menuItems = this._navigationService.menuItems$;
    this.hasFiltersSlot = true;
    this.consultarEstados();
    this.consultarTickets();
    this.consultarRegistros();
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
              const ticket = this.tickets.filter((x) => x.codigoTicket == seguimiento.codigoTicket)[0];
              seguimiento.nomTicket = ticket.nombreTicket;
              seguimiento.captura = `${base_url}/upload/tickets/${seguimiento.capturaSeguimiento}`;
            });
            this.registros = resp.seguimientos;
            this.registrosFiltrado = resp.seguimientos;
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

  OnNuevoRegistroClick() {
    this.router.navigate(['tickets/gestion-seguimiento'], { queryParams: { regId: 'nuevo' } });
  }

  OnEditarRegistroClick(id: number) {
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
            Swal.fire(this.translate.instant('SEGUIMIENTOS.ELIMINAREXITOSA'), resp.mensaje, 'success');
            this.registros = this.registros.filter((s) => s.seguimientoId !== id.id);
          },
          error: (err: any) => {
            Swal.fire('Error', this.translate.instant('SEGUIMIENTOS.ELIMINARERROR'), 'error');
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
