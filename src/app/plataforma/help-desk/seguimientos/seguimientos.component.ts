/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DataTablesModule } from 'angular-datatables';
import { Subscription, tap, catchError, of, Observable } from 'rxjs';
import { PTLSeguimientoRQModel } from 'src/app/theme/shared/_helpers/models/PTLSeguimientoRQ.model';
import { NavigationService } from 'src/app/theme/shared/service';
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
    private _requerimientoService: PTLRequerimientosTkService
  ) {
    this.gradientConfig = GradientConfig;
  }

  ngOnInit() {
    this._navigationService.getNavigationItems();
    this.menuItems = this._navigationService.menuItems$;
    this.hasFiltersSlot = true;
    this.consultarRequerimientos();
    this.consultarRegistros();
    this.consultarEstado();
  }

  consultarRegistros() {
    this.registrosSub = this._seguimientosService
      .getRegistros()
      .pipe(
        tap((resp: any) => {
          if (resp.ok) {
            resp.seguimientos.forEach((seguimiento: any) => {
              seguimiento.nomEstado = seguimiento.estadoSeguimiento;
              seguimiento.nomRequerimiento =
                this.requerimientos.filter((x) => x.requerimientoId == seguimiento.requerimientoId)[0].nombreRequerimiento || '';
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

  columnasRegistros: ColumnMetadata[] = [
    {
      name: 'nomRequerimiento',
      header: 'TICKETS.SEGUIMIENTOS.NAMEREQUERIMIENTO',
      type: 'text'
    },
{
      name: 'nombreSeguimiento',
      header: 'TICKETS.SEGUIMIENTOS.NOMBRESEGUIMIENTO',
      type: 'text'
    },    {
      name: 'nomEstado',
      header: 'TICKETS.SEGUIMIENTOS.STATUS',
      type: 'text'
    }
  ];

  columnasDetailRegistros: ColumnMetadata[] = [
    {
      name: 'descripcionSeguimiento',
      header: 'TICKETS.SEGUIMIENTOS.DESCRIPCIONSEGUIMIENTO',
      type: 'text'
    }
  ];

  consultarRequerimientos() {
    this.registrosSub = this._requerimientoService
      .getRegistros()
      .pipe(
        tap((resp: any) => {
          if (resp.ok) {
            console.log('requerimiento', resp);
            this.requerimientos = resp.requerimientos;
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
    this.router.navigate(['help-desk/gestion-seguimiento']);
  }

  OnEditarRegistroClick(id: number) {
    this.router.navigate(['help-desk/gestion-seguimiento'], { queryParams: { regId: id } });
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
      this.registrosFiltrado = this.registrosFiltrado.filter((seguimiento) =>
        (seguimiento.nombreSeguimiento || '').toLowerCase().includes(textoFiltro)
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
