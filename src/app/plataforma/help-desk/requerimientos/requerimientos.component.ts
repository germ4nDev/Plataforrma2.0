/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DataTablesModule } from 'angular-datatables';
import { Subscription, tap, catchError, of } from 'rxjs';
import { PTLRequerimientoTKModel } from 'src/app/theme/shared/_helpers/models/PTLRequerimientoTK.model';
import { NavigationService } from 'src/app/theme/shared/service';
import { PTLRequerimientosTkService } from 'src/app/theme/shared/service/ptlrequerimientos-tk.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { DatatableComponent } from 'src/app/theme/shared/components/data-table/data-table.component';
import { NavContentComponent } from 'src/app/theme/layout/admin/navigation/nav-content/nav-content.component';
import { NavBarComponent } from 'src/app/theme/layout/admin/nav-bar/nav-bar.component';
import { NavigationItem } from 'src/app/theme/layout/admin/navigation/navigation';
import { GradientConfig } from 'src/app/app-config';
import { PTLEstadosService } from 'src/app/theme/shared/service/ptlestados.service';
import { PTLTicketAPModel } from 'src/app/theme/shared/_helpers/models/PTLTicketAP.model';
import { PTLTicketsService } from 'src/app/theme/shared/service/ptltickets.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-requerimientos',
  standalone: true,
  imports: [CommonModule, DataTablesModule, SharedModule, TranslateModule, NavBarComponent, NavContentComponent, DatatableComponent],
  templateUrl: './requerimientos.component.html',
  styleUrl: './requerimientos.component.scss'
})
export class RequerimientosComponent implements OnInit {
  @Output() toggleSidebar = new EventEmitter<void>();

  //#region VARIABLES
  registrosSub?: Subscription;
  registros: PTLRequerimientoTKModel[] = [];
  registrosFiltrado: PTLRequerimientoTKModel[] = [];
  ticket: PTLTicketAPModel[] = [];
  lang: string = localStorage.getItem('lang') || '';
  tituloPagina: string = '';
  gradientConfig;
  hasFiltersSlot: boolean = false;
  menuItems: NavigationItem[] = [];
  activeTab: 'menu' | 'filters' | 'main' = 'menu';
  tipoEstado: string = '';
  estadosFiltrados: any[] = [];
  //#endregion VARIABLES
  constructor(
    private router: Router,
    private translate: TranslateService,
    private _navigationService: NavigationService,
    private _requerimientosService: PTLRequerimientosTkService,
    private _estadosService: PTLEstadosService,
    private _tickesService: PTLTicketsService
  ) {
    this.gradientConfig = GradientConfig;
  }
  ngOnInit() {
    this.menuItems = this._navigationService.getNavigationItems();
    this.hasFiltersSlot = true;
    this.consultarTickets();
    this.consultarRegistros();
    this.consultarEstado();
  }

  consultarRegistros() {
    console.log('formregistro', this._requerimientosService);
    this.registrosSub = this._requerimientosService
      .getRegistros()
      .pipe(
        tap((resp: any) => {
          console.log('que me trae', resp);

          if (resp.ok) {
            resp.requerimientos.forEach((Requerimiento: any) => {
              Requerimiento.nomEstado = Requerimiento.estadoRequerimiento;
              Requerimiento.nomTicket = this.ticket.filter((x) => x.ticketId == Requerimiento.ticketId)[0].nombreTicket || '';
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

  consultarTickets() {
    this.registrosSub = this._tickesService
      .getRegistros()
      .pipe(
        tap((resp: any) => {
          if (resp.ok) {
            this.ticket = resp.tickets;
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
    this._estadosService
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
        this._requerimientosService.deleteEliminarRegistro(id.id).subscribe({
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
      this.registrosFiltrado = this.registros.filter((x) => x.estadoRequerimiento == evento.target.value);
    }
  }

  toggleNav(): void {
    this.toggleSidebar.emit();
  }
}
