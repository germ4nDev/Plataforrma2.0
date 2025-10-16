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
import { NavigationService, PtlAplicacionesService } from 'src/app/theme/shared/service';
import { ColumnMetadata } from 'src/app/theme/shared/_helpers/models/ColumnMetadata.model';

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
    private _aplicacionesService: PtlAplicacionesService
  ) {
    this.gradientConfig = GradientConfig;
  }

  ngOnInit() {
    this._navigationService.getNavigationItems();
    this.menuItems = this._navigationService.menuItems$;
    this.hasFiltersSlot = true;
    this.consultarAplicaciones();
    this.consultarRegistros();
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
      name: 'nombreTicket',
      header: 'TICKETS.NOMBREREQUERIMIENTO',
      type: 'text'
    },
    {
      name: 'nomEstado',
      header: 'TICKETS..STATUS',
      type: 'text'
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
        this._ticketsService.deleteEliminarRegistro(id.id).subscribe({
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
      const estado = evento.target.value == 'true' ? true : false;
      this.registrosFiltrado = this.registros.filter((x) => x.estadoTicket == estado);
    }
  }

  toggleNav(): void {
    this.toggleSidebar.emit();
  }
}
