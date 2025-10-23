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
import { NavContentComponent } from 'src/app/theme/layout/admin/navigation/nav-content/nav-content.component';
import { NavBarComponent } from '../../../theme/layout/admin/nav-bar/nav-bar.component';
import { DatatableComponent } from 'src/app/theme/shared/components/data-table/data-table.component';
import { NavigationService } from 'src/app/theme/shared/service/navigation.service';
import { PtlAplicacionesService } from 'src/app/theme/shared/service/ptlaplicaciones.service';
import { PtlSuitesAPService } from 'src/app/theme/shared/service/ptlsuites-ap.service';
import { PtlmodulosApService } from 'src/app/theme/shared/service/ptlmodulos-ap.service';

import Swal from 'sweetalert2';
import { PTLModuloAP } from 'src/app/theme/shared/_helpers/models/PTLModuloAP.model';
import { PTLSuiteAPModel } from 'src/app/theme/shared/_helpers/models/PTLSuiteAP.model';
import { PTLAplicacionModel } from 'src/app/theme/shared/_helpers/models/PTLAplicacion.model';
import { ColumnMetadata } from 'src/app/theme/shared/_helpers/models/ColumnMetadata.model';

@Component({
  selector: 'app-modulos',
  standalone: true,
  imports: [CommonModule, DataTablesModule, SharedModule, TranslateModule, NavBarComponent, NavContentComponent, DatatableComponent],
  templateUrl: './modulos.component.html',
  styleUrl: './modulos.component.scss'
})
export class ModulosComponent implements OnInit {
  @Output() toggleSidebar = new EventEmitter<void>();
  aplicacionesSub?: Subscription;
  aplicaciones: PTLAplicacionModel[] = [];
  suites: PTLSuiteAPModel[] = [];
  modulosPadre: PTLModuloAP[] = [];
  registros: PTLModuloAP[] = [];
  suitesSub?: Subscription;
  modulosSub?: Subscription;
  registrosSub?: Subscription;
  registrosFiltrado: PTLModuloAP[] = [];
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
    private _aplicacionesService: PtlAplicacionesService,
    private _suitesService: PtlSuitesAPService,
    private _registrosService: PtlmodulosApService
  ) {
    this.gradientConfig = GradientConfig;
    this.consultarAplicacines();
    this.consultarSuites();
    this.consultarModulosPadre();
  }

  ngOnInit(): void {
    this._navigationService.getNavigationItems();
    this.menuItems$ = this._navigationService.menuItems$;
    this.hasFiltersSlot = true;
    this.moduloTituloExcel = this.lang == 'es' ? 'Listado de Suitees' : 'List of Aplications';
    this.consultarRegistros();
  }

  consultarAplicacines() {
    this.aplicacionesSub = this._aplicacionesService
      .getAplicaciones()
      .pipe(
        tap((resp: any) => {
          if (resp.ok) {
            this.aplicaciones = resp.aplicaciones;
            // console.log('aplicaciones 1', this.aplicaciones);
          }
        }),
        catchError((err) => {
          console.error(err);
          return of([]);
        })
      )
      .subscribe();
  }

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
            // console.log('suites 1', this.suites);
          }
        }),
        catchError((err) => {
          console.error(err);
          return of([]);
        })
      )
      .subscribe();
  }

  consultarModulosPadre() {
    this.modulosSub = this._registrosService
      .getRegistros()
      .pipe(
        tap((resp: any) => {
          if (resp.ok) {
            this.modulosPadre = resp.modulos.filter((x: { hijos: boolean }) => x.hijos == true);
            // console.log('modulosPadre 1', this.modulosPadre);
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
            resp.modulos.forEach((mod: any) => {
              mod.nomEstado = mod.estadoModulo ? 'Activo' : 'Inactivo';
              mod.nomHijos = mod.hijos ? 'Con Hijos' : 'Sin Hijos';
              mod.nomAplicacion = this.aplicaciones.filter((x) => x.codigoAplicacion == mod.codigoAplicacion)[0].nombreAplicacion || '';
              mod.nomSuite = this.suites.filter((x) => x.codigoSuite == mod.codigoSuite)[0].nombreSuite || '';
              mod.nomPadre =
                mod.codigoPadre != '0' ? this.modulosPadre.filter((x) => x.codigoModulo == mod.codigoPadre)[0].nombreModulo : '';
              //   // console.log('detalle modulo', mod);
            });
            // // console.log('los modulos', resp.modulos);
            if (codSuite) {
              this.registros = resp.modulos.filter((x: { codigosuite: string }) => x.codigosuite == codSuite);
              this.registrosFiltrado = resp.modulos.filter((x: { codigosuite: string }) => x.codigosuite == codSuite);
            } else {
              this.registros = resp.modulos;
              this.registrosFiltrado = resp.modulos;
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

  columnasRegistros: ColumnMetadata[] = [
    {
      name: 'nombreModulo',
      header: 'MODULOS.NAME',
      type: 'text'
    },
    {
      name: 'nomPadre',
      header: 'MODULOS.PADRE',
      type: 'text'
    },
    {
      name: 'nomHijos',
      header: 'MODULOS.HIJOS',
      type: 'text'
    },
    {
      name: 'nomEstado',
      header: 'MODULOS.STATUS',
      type: 'text'
    }
  ];

  columnasDetailRegistros: ColumnMetadata[] = [
    {
      name: 'codigoModulo',
      header: 'MODULOS.CODE',
      type: 'text'
    },
    {
      name: 'nomAplicacion',
      header: 'MODULOS.NOMBREAPLICACION',
      type: 'text'
    },
    {
      name: 'nomSuite',
      header: 'MODULOS.NOMBRESUITE',
      type: 'text'
    },
    {
      name: 'precioModulo',
      header: 'MODULOS.PRECIO',
      type: 'price'
    },
    {
      name: 'descripcionModulo',
      header: 'MODULOS.DESCRIPTION',
      type: 'text'
    }
  ];

  getLanguageUrl(): string {
    const lang = localStorage.getItem('lang') || 'en';
    return `//cdn.datatables.net/plug-ins/1.10.25/i18n/${lang === 'es' ? 'Spanish' : 'English'}.json`;
  }

  onFiltroCodigoAplicacionChangeClick(evento: any) {
    // console.log('filtrar el codigo ', evento.target.value);
    if (evento.target.value == 'todos') {
      this.registrosFiltrado = this.registros;
    } else {
      this.registrosFiltrado = this.registrosFiltrado.filter((x) => (x.codigoAplicacion = evento.target.value));
      this.consultarSuites(evento.target.value);
    }
  }

  onFiltroCodigoSuiteChangeClick(evento: any) {
    // console.log('filtrar el codigo ', evento.target.value);
    if (evento.target.value == 'todos') {
      this.registrosFiltrado = this.registros;
    } else {
      this.registrosFiltrado = this.registrosFiltrado.filter((x) => (x.codigoSuite = evento.target.value));
      this.consultarRegistros(evento.target.value);
    }
  }

  onFiltroNombreChangeClick(evento: any) {
    // console.log('filtrar el nombre ', evento.target.value);
    if (evento.target.value == 'todos') {
      this.registrosFiltrado = this.registros;
    } else {
      this.registrosFiltrado = this.registrosFiltrado.filter((x) => (x.nombreModulo = evento.target.value));
    }
  }

  onFiltroDescripcionChangeClick(evento: any) {
    // console.log('filtrar el descripcion ', evento.target.value);
    const textoFiltro = evento.target.value.toLowerCase();
    if (!textoFiltro) {
      this.registrosFiltrado = [...this.registros];
    } else {
      this.registrosFiltrado = this.registrosFiltrado.filter((app) => (app.descripcionModulo || '').toLowerCase().includes(textoFiltro));
      // console.log('filtrados', this.registrosFiltrado);
    }
  }

  onFiltroEstadoChangeClick(evento: any) {
    // console.log('filtrar el estado ', evento.target.value);
    // const estado: boolean = evento.target.value || true;
    if (evento.target.value == 'todos') {
      this.registrosFiltrado = this.registros;
    } else {
      const estado = evento.target.value == 'true' ? true : false;
      // console.log('Suitees', this.registrosFiltrado);
      this.registrosFiltrado = this.registros.filter((x) => x.estadoModulo == estado);
    }
  }

  OnNuevoRegistroClick(): void {
    this.router.navigate(['aplicaciones/gestion-modulo']);
  }

  OnEditarRegistroClick(id: number): void {
    this.router.navigate(['aplicaciones/gestion-modulo'], { queryParams: { regId: id } });
  }

  OnEliminarRegistroClick(id: any): void {
    Swal.fire({
      title: this.translate.instant('MODULOS.ELIMINARTITULO'),
      text: this.translate.instant('MODULOS.ELIMINARTEXTO'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: this.translate.instant('PLATAFORMA.DELETE'),
      cancelButtonText: this.translate.instant('PLATAFORMA.CANCEL')
    }).then((result) => {
      if (result.isConfirmed) {
        this._registrosService.deleteEliminarRegistro(id.id).subscribe({
          next: (resp: any) => {
            Swal.fire(this.translate.instant('MODULOS.ELIMINAREXITOSA'), resp.mensaje, 'success');
            this.consultarRegistros();
          },
          error: () => {
            Swal.fire('Error', this.translate.instant('MODULOS.ELIMINARERROR'), 'error');
          }
        });
      }
    });
  }

  toggleNav(): void {
    this.toggleSidebar.emit();
  }
}
