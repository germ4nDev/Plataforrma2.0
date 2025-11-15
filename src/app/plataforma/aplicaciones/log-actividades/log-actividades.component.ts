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
import { NavContentComponent } from 'src/app/theme/layout/admin/navigation/nav-content/nav-content.component';
import { NavBarComponent } from '../../../theme/layout/admin/nav-bar/nav-bar.component';
import { DatatableComponent } from 'src/app/theme/shared/components/data-table/data-table.component';
import { NavigationService } from 'src/app/theme/shared/service/navigation.service';
import { PtlAplicacionesService } from 'src/app/theme/shared/service/ptlaplicaciones.service';
import { PtlSuitesAPService } from 'src/app/theme/shared/service/ptlsuites-ap.service';
import { PtlmodulosApService } from 'src/app/theme/shared/service/ptlmodulos-ap.service';
import { PTLModuloAP } from 'src/app/theme/shared/_helpers/models/PTLModuloAP.model';
import { PTLSuiteAPModel } from 'src/app/theme/shared/_helpers/models/PTLSuiteAP.model';
import { PTLAplicacionModel } from 'src/app/theme/shared/_helpers/models/PTLAplicacion.model';
import { PtllogActividadesService } from 'src/app/theme/shared/service/ptllog-actividades.service';
import { PTLLogActividadAPModel } from 'src/app/theme/shared/_helpers/models/PTLlogActividadAP.model';
import { PTLUsuarioModel } from 'src/app/theme/shared/_helpers/models/PTLUsuario.model';
import { PTLUsuariosService } from 'src/app/theme/shared/service/ptlusuarios.service';
import { ColumnMetadata } from 'src/app/theme/shared/_helpers/models/ColumnMetadata.model';
import { NavigationItem } from 'src/app/theme/shared/_helpers/models/Navigation.model';

@Component({
  selector: 'app-log-actividades',
  standalone: true,
  imports: [CommonModule, DataTablesModule, SharedModule, TranslateModule, NavBarComponent, NavContentComponent, DatatableComponent],
  templateUrl: './log-actividades.component.html',
  styleUrl: './log-actividades.component.scss'
})
export class LogActividadesComponent implements OnInit {
  @Output() toggleSidebar = new EventEmitter<void>();
  aplicaciones: PTLAplicacionModel[] = [];
  suites: PTLSuiteAPModel[] = [];
  modulos: PTLModuloAP[] = [];
  usuarios: PTLUsuarioModel[] = [];
  registros: PTLLogActividadAPModel[] = [];
  registrosFiltrado: PTLLogActividadAPModel[] = [];
  moduloTituloExcel: string = '';
  filtroPersonalizado: string = '';
  hasFiltersSlot: boolean = false;
  suitesSub?: Subscription;
  modulosSub?: Subscription;
  aplicacionesSub?: Subscription;
  registrosSub?: Subscription;
  gradientConfig;
  lang = localStorage.getItem('lang');
  menuItems$!: Observable<NavigationItem[]>;
  activeTab: 'menu' | 'filters' | 'main' = 'menu';

  constructor(
    private router: Router,
    private translate: TranslateService,
    private _navigationService: NavigationService,
    private _aplicacionesService: PtlAplicacionesService,
    private _suitesService: PtlSuitesAPService,
    private _modulosService: PtlmodulosApService,
    private _usuariosService: PTLUsuariosService,
    private _registrosService: PtllogActividadesService
  ) {
    this.gradientConfig = GradientConfig;
  }

  ngOnInit(): void {
    this._navigationService.getNavigationItems();
    this.menuItems$ = this._navigationService.menuItems$;
    this.hasFiltersSlot = true;
    this.moduloTituloExcel = this.lang == 'es' ? 'Listado de Suitees' : 'List of Aplications';
    this.consultarUsuarios();
    this.consultarAplicacines();
    this.consultarRegistros();
  }

  consultarAplicacines() {
    this.aplicacionesSub = this._aplicacionesService
      .getAplicaciones()
      .pipe(
        tap((resp: any) => {
          if (resp.ok) {
            this.aplicaciones = resp.aplicaciones;
            this.consultarSuites();
          }
        }),
        catchError((err) => {
          console.error(err);
          return of([]);
        })
      )
      .subscribe();
  }

  columnasLogActividades: ColumnMetadata[] = [
    {
      name: 'fechaLog',
      header: 'LOGACTIVIDADES.FECHA',
      type: 'date'
    },
    {
      name: 'nomAplicacion',
      header: 'LOGACTIVIDADES.APLICACION',
      type: 'text'
    },
    {
      name: 'nombreAplicacion',
      header: 'APLICACIONES.NAME',
      type: 'text'
    },
    {
      name: 'nomSuite',
      header: 'LOGACTIVIDADES.SUITE',
      type: 'text'
    },
    {
      name: 'nomModulo',
      header: 'LOGACTIVIDADES.MODULO',
      type: 'text'
    },
    {
      name: 'codigoErrr',
      header: 'LOGACTIVIDADES.CODIGO',
      type: 'text'
    },
    {
      name: 'nomEstado',
      header: 'LOGACTIVIDADES.STATUS',
      type: 'text'
    }
  ];

  columnasDetailRegistros: ColumnMetadata[] = [
    {
      name: 'nomUsuario',
      header: 'LOGACTIVIDADES.USUARIO',
      type: 'text'
    },
    {
      name: 'descripcionLog',
      header: 'LOGACTIVIDADES.DESCRIPTION',
      type: 'text'
    }
  ];

  consultarSuites(codApp?: string): void {
    this.suitesSub = this._suitesService
      .geSuitesAP()
      .pipe(
        tap((resp: any) => {
          if (resp.ok) {
            if (codApp) {
              this.suites = resp.suites.filter((x: { codigoAplicacion: string }) => x.codigoAplicacion == codApp);
            } else {
              this.suites = resp.suites;
            }
            this.consultarModulos();
          }
        }),
        catchError((err) => {
          console.error(err);
          return of([]);
        })
      )
      .subscribe();
  }

  consultarUsuarios(): void {
    this.suitesSub = this._usuariosService
      .getUsuarios()
      .pipe(
        tap((resp: any) => {
          if (resp.ok) {
            this.usuarios = resp.usuarios;
          }
        }),
        catchError((err) => {
          console.error(err);
          return of([]);
        })
      )
      .subscribe();
  }

  consultarModulos(codSui?: string): void {
    this.modulosSub = this._modulosService
      .getRegistros()
      .pipe(
        tap((resp: any) => {
          if (resp.ok) {
            if (codSui) {
              this.modulos = resp.modulos.filter((x: { codigoSuite: string }) => x.codigoSuite == codSui);
            } else {
              this.modulos = resp.modulos;
            }
          }
        }),
        catchError((err) => {
          console.error(err);
          return of([]);
        })
      )
      .subscribe();
  }

  consultarRegistros(codSuite?: string): void {
    this.registrosSub = this._registrosService
      .getRegistros()
      .pipe(
        tap((resp: any) => {
          if (resp.ok) {
            resp.registros.forEach((reg: any) => {
              reg.nomEstado = reg.estadoSuite ? 'Activo' : 'Inactivo';
              reg.nomAplicacion = this.aplicaciones.filter((x) => x.codigoAplicacion == reg.codigoAplicacion)[0].nombreAplicacion || '';
              reg.nomSuite = this.suites.filter((x) => x.codigoSuite == reg.codigoSuite)[0].nombreSuite || '';
              reg.nomModulo = this.modulos.filter((x) => x.codigoModulo == reg.codigoModulo)[0].nombreModulo || '';
              reg.nomUsuario = this.usuarios.filter((x) => x.usuarioId == reg.usuarioId)[0].nombreUsuario || '';
            });
            if (codSuite) {
              this.registros = resp.registros.filter((x: { codigosuite: string }) => x.codigosuite == codSuite);
              this.registrosFiltrado = resp.registros.filter((x: { codigosuite: string }) => x.codigosuite == codSuite);
            } else {
              this.registros = resp.registros;
              this.registrosFiltrado = resp.registros;
            }
          }
        }),
        catchError((err) => {
          console.error(err);
          return of([]);
        })
      )
      .subscribe();
  }

  getLanguageUrl(): string {
    const lang = localStorage.getItem('lang') || 'en';
    return `//cdn.datatables.net/plug-ins/1.10.25/i18n/${lang === 'es' ? 'Spanish' : 'English'}.json`;
  }

  onFiltroCodigoAplicacionChangeClick(evento: any) {
    console.log('filtrar el codigo ', evento.target.value);
    if (evento.target.value == 'todos') {
      this.registrosFiltrado = this.registros;
    } else {
      this.registrosFiltrado = this.registrosFiltrado.filter((x) => (x.codigoAplicacion = evento.target.value));
      this.consultarSuites(evento.target.value);
    }
  }

  onFiltroCodigoSuiteChangeClick(evento: any) {
    console.log('filtrar el codigo ', evento.target.value);
    if (evento.target.value == 'todos') {
      this.registrosFiltrado = this.registros;
    } else {
      this.registrosFiltrado = this.registrosFiltrado.filter((x) => (x.codigoSuite = evento.target.value));
      this.consultarRegistros(evento.target.value);
    }
  }

  onFiltroCodigoModuloChangeClick(evento: any) {
    console.log('filtrar el modulo ', evento.target.value);
    if (evento.target.value == 'todos') {
      this.registrosFiltrado = this.registros;
    } else {
      this.registrosFiltrado = this.registrosFiltrado.filter((x) => (x.codigoModulo = evento.target.value));
      this.consultarRegistros(evento.target.value);
    }
  }

  onFiltroDescripcionChangeClick(evento: any) {
    console.log('filtrar el descripcion ', evento.target.value);
    const textoFiltro = evento.target.value.toLowerCase();
    if (!textoFiltro) {
      this.registrosFiltrado = [...this.registros];
    } else {
      this.registrosFiltrado = this.registrosFiltrado.filter((reg) => (reg.descripcionLog || '').toLowerCase().includes(textoFiltro));
      console.log('filtrados', this.registrosFiltrado);
    }
  }

  OnNuevoRegistroClick(): void {
    console.log('evento no disponible');
  }

  OnEditarRegistroClick(id: number): void {
    console.log('evento no disponible', id);
  }

  OnEliminarRegistroClick(id: number): void {
    console.log('evento no disponible', id);
  }

  toggleNav(): void {
    this.toggleSidebar.emit();
  }
}
