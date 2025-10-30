/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTablesModule } from 'angular-datatables';
import { Router } from '@angular/router';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Observable, Subscription, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { GradientConfig } from 'src/app/app-config';

import { NavigationItem } from 'src/app/theme/layout/admin/navigation/navigation';
import { PTLAplicacionModel } from 'src/app/theme/shared/_helpers/models/PTLAplicacion.model';
import { NavContentComponent } from 'src/app/theme/layout/admin/navigation/nav-content/nav-content.component';
import { NavBarComponent } from '../../../theme/layout/admin/nav-bar/nav-bar.component';
import { DatatableComponent } from 'src/app/theme/shared/components/data-table/data-table.component';
import { PtlAplicacionesService } from 'src/app/theme/shared/service/ptlaplicaciones.service';
import { NavigationService } from 'src/app/theme/shared/service/navigation.service';

import Swal from 'sweetalert2';
import { ColumnMetadata } from 'src/app/theme/shared/_helpers/models/ColumnMetadata.model';
import { environment } from 'src/environments/environment';
import { PTLLogActividadAPModel } from 'src/app/theme/shared/_helpers/models/PTLlogActividadAP.model';
import { LocalStorageService, PtllogActividadesService } from 'src/app/theme/shared/service';
import { BaseSessionModel } from 'src/app/theme/shared/_helpers/models/BaseSession.model';

const base_url = environment.apiUrl;

@Component({
  selector: 'app-aplicaciones',
  standalone: true,
  imports: [CommonModule, DataTablesModule, SharedModule, TranslateModule, NavBarComponent, NavContentComponent, DatatableComponent],
  templateUrl: './aplicaciones.component.html',
  styleUrl: './aplicaciones.component.scss'
})
export class AplicacionesComponent implements OnInit {
  @Output() toggleSidebar = new EventEmitter<void>();
  DataModel: BaseSessionModel = new BaseSessionModel();
  DataLogActividad: PTLLogActividadAPModel = new PTLLogActividadAPModel();
  aplicaciones: PTLAplicacionModel[] = [];
  aplicacionesFiltrado: PTLAplicacionModel[] = [];
  registrosSub?: Subscription;
  moduloTituloExcel: string = '';
  filtroPersonalizado: string = '';
  hasFiltersSlot: boolean = false;
  gradientConfig;
  lang = localStorage.getItem('lang');
  menuItems$!: Observable<NavigationItem[]>;
  activeTab: 'menu' | 'filters' | 'main' = 'menu';

  constructor(
    private router: Router,
    private translate: TranslateService,
    private _navigationService: NavigationService,
    private _logActividadesService: PtllogActividadesService,
    private _localStorageService: LocalStorageService,
    private _aplicacionesService: PtlAplicacionesService
  ) {
    this.gradientConfig = GradientConfig;
  }

  ngOnInit(): void {
    this._navigationService.getNavigationItems();
    this.menuItems$ = this._navigationService.menuItems$;
    this.hasFiltersSlot = true;
    this.moduloTituloExcel = this.lang == 'es' ? 'Listado de Aplicaciones' : 'List of Aplications';
    this.DataModel = this._localStorageService.getDataModelsLocalStorage();
    this.consultarAplicaciones();
  }

  consultarAplicaciones(): void {
    this.registrosSub = this._aplicacionesService
      .getAplicaciones()
      .pipe(
        tap((resp: any) => {
          if (resp.ok) {
            resp.aplicaciones.forEach((app: any) => {
              app.nomEstado = app.estadoAplicacion ? 'Activo' : 'Inactivo';
              app.imagenInicio = `${base_url}/upload/aplicaciones/${app.imagenInicio}`;
            });
            this.aplicaciones = resp.aplicaciones;
            this.aplicacionesFiltrado = resp.aplicaciones;
          }
        }),
        catchError((err) => {
          console.error(err);
          return of([]);
        })
      )
      .subscribe();
  }

  columnasAplicaciopnes: ColumnMetadata[] = [
    {
      name: 'imagenInicio',
      header: 'APLICACIONES.FOTO',
      type: 'image',
      isSortable: false
    },
    {
      name: 'codigoAplicacion',
      header: 'APLICACIONES.CODE',
      type: 'text'
    },
    {
      name: 'nombreAplicacion',
      header: 'APLICACIONES.NAME',
      type: 'text'
    },
    {
      name: 'nomEstado',
      header: 'APLICACIONES.STATUS',
      type: 'text'
    }
  ];

  columnasDetailRegistros: ColumnMetadata[] = [
    {
      name: 'descripcionAplicacion',
      header: 'APLICACIONES.DESCRIPTION',
      type: 'text'
    }
  ];

  getLanguageUrl(): string {
    const lang = localStorage.getItem('lang') || 'en';
    return `//cdn.datatables.net/plug-ins/1.10.25/i18n/${lang === 'es' ? 'Spanish' : 'English'}.json`;
  }

  onFiltroCodigoChangeClick(evento: any) {
    console.log('filtrar el codigo ', evento.target.value);
    if (evento.target.value == 'todos') {
      this.aplicacionesFiltrado = this.aplicaciones;
    } else {
      this.aplicacionesFiltrado = this.aplicacionesFiltrado.filter((x) => (x.codigoAplicacion = evento.target.value));
    }
  }

  onFiltroNombreChangeClick(evento: any) {
    console.log('filtrar el nombre ', evento.target.value);
    if (evento.target.value == 'todos') {
      this.aplicacionesFiltrado = this.aplicaciones;
    } else {
      this.aplicacionesFiltrado = this.aplicacionesFiltrado.filter((x) => (x.nombreAplicacion = evento.target.value));
    }
  }

  onFiltroDescripcionChangeClick(evento: any) {
    console.log('filtrar el descripcion ', evento.target.value);
    const textoFiltro = evento.target.value.toLowerCase();
    if (!textoFiltro) {
      this.aplicacionesFiltrado = [...this.aplicaciones];
    } else {
      this.aplicacionesFiltrado = this.aplicacionesFiltrado.filter((app) =>
        (app.descripcionAplicacion || '').toLowerCase().includes(textoFiltro)
      );
      console.log('filtrados', this.aplicacionesFiltrado);
    }
  }

  onFiltroEstadoChangeClick(evento: any) {
    console.log('filtrar el estado ', evento.target.value);
    // const estado: boolean = evento.target.value || true;
    if (evento.target.value == 'todos') {
      this.aplicacionesFiltrado = this.aplicaciones;
    } else {
      const estado = evento.target.value == 'true' ? true : false;
      console.log('Aplicaciones', this.aplicacionesFiltrado);
      this.aplicacionesFiltrado = this.aplicaciones.filter((x) => x.estadoAplicacion == estado);
    }
  }

  OnNuevaAplicaicionClick(): void {
    this._navigationService.navigateNodoMenu('/aplicaciones/gestion-aplicacion', 'nuevo');
  }

  OnEditarAplicaicionClick(id: string): void {
    this._navigationService.navigateNodoMenu('/aplicaciones/gestion-aplicacion', id);
  }

  OnEliminarAplicaicionClick(id: string): void {
    const nombreApp = this.aplicacionesFiltrado.filter((x) => x.codigoAplicacion == id)[0];
    const usuario = this._localStorageService.getUsuarioLocalStorage();
    this.DataLogActividad.codigoAplicacion = this.DataModel.codigoAplicacion;
    this.DataLogActividad.codigoSuite = this.DataModel.codigoSuite;
    this.DataLogActividad.codigoModulo = this.DataModel.codigoModulo;
    this.DataLogActividad.codigoSuscriptor = '';
    this.DataLogActividad.codigoUsuarioCreacion = usuario.codigoUsuario;
    this.DataLogActividad.fechaLog = new Date().toISOString();
    this.DataLogActividad.fechaCreacion = new Date().toISOString();
    Swal.fire({
      title: this.translate.instant('APLICACIONES.ELIMINARTITULO'),
      text: this.translate.instant('APLICACIONES.ELIMINARTEXTO') + `"${nombreApp.nombreAplicacion}".`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: this.translate.instant('PLATAFORMA.DELETE'),
      cancelButtonText: this.translate.instant('PLATAFORMA.CANCEL')
    }).then((result) => {
      if (result.isConfirmed) {
        this._aplicacionesService.eliminarAplicacion(id).subscribe({
          next: (resp: any) => {
            Swal.fire(this.translate.instant('APLICACIONES.ELIMINAREXITOSA'), resp.mensaje, 'success');
            this.translate.instant('APLICACIONES.ELIMINAREXITOSA');
            this._logActividadesService.postCrearRegistro(this.DataLogActividad).subscribe(() => console.log('log creado exitosamente'));
            this.aplicaciones = this.aplicaciones.filter((a) => a.codigoAplicacion !== id);
            this.aplicacionesFiltrado = [...this.aplicaciones];
          },
          error: () => {
            Swal.fire('Error', this.translate.instant('APLICACIONES.ELIMINARERROR'), 'error');
          }
        });
      }
    });
  }

  toggleNav(): void {
    this.toggleSidebar.emit();
  }
}
