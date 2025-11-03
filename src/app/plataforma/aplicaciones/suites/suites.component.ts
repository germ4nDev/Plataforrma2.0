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
import { PTLSuiteAPModel } from 'src/app/theme/shared/_helpers/models/PTLSuiteAP.model';
import { NavContentComponent } from 'src/app/theme/layout/admin/navigation/nav-content/nav-content.component';
import { NavBarComponent } from '../../../theme/layout/admin/nav-bar/nav-bar.component';
import { DatatableComponent } from 'src/app/theme/shared/components/data-table/data-table.component';
import { PtlSuitesAPService } from 'src/app/theme/shared/service/ptlsuites-ap.service';
import { NavigationService } from 'src/app/theme/shared/service/navigation.service';

import Swal from 'sweetalert2';
import { PTLAplicacionModel } from 'src/app/theme/shared/_helpers/models/PTLAplicacion.model';
import { PtlAplicacionesService } from 'src/app/theme/shared/service/ptlaplicaciones.service';
import { LocalStorageService } from 'src/app/theme/shared/service/local-storage.service';
import { ColumnMetadata } from 'src/app/theme/shared/_helpers/models/ColumnMetadata.model';
import { environment } from 'src/environments/environment';
import { PtllogActividadesService } from 'src/app/theme/shared/service';

const base_url = environment.apiUrl;

@Component({
  selector: 'app-registros',
  standalone: true,
  imports: [CommonModule, DataTablesModule, SharedModule, TranslateModule, NavBarComponent, NavContentComponent, DatatableComponent],
  templateUrl: './suites.component.html',
  styleUrl: './suites.component.scss'
})
export class SuitesComponent implements OnInit {
  @Output() toggleSidebar = new EventEmitter<void>();
  registros: PTLSuiteAPModel[] = [];
  aplicaciones: PTLAplicacionModel[] = [];
  registrosFiltrado: PTLSuiteAPModel[] = [];
  moduloTituloExcel: string = '';
  filtroPersonalizado: string = '';
  hasFiltersSlot: boolean = false;
  aplicacionesSub?: Subscription;
  registrosSub?: Subscription;
  gradientConfig;
  lang = localStorage.getItem('lang');
  menuItems$!: Observable<NavigationItem[]>;
  activeTab: 'menu' | 'filters' | 'main' = 'menu';

  constructor(
    private _router: Router,
    private translate: TranslateService,
    private _navigationService: NavigationService,
    private _aplicacionesService: PtlAplicacionesService,
    private _registrosService: PtlSuitesAPService,
    private _localstorageService: LocalStorageService,
    private _logActividadesService: PtllogActividadesService,
    private _translate: TranslateService
  ) {
    this.gradientConfig = GradientConfig;
  }

  ngOnInit(): void {
    this._navigationService.getNavigationItems();
    this.menuItems$ = this._navigationService.menuItems$;
    this.hasFiltersSlot = true;
    this.moduloTituloExcel = this.lang == 'es' ? 'Listado de Suitees' : 'List of Aplications';
    this.consultarAplicacines();
    this.consultarSuitees();
  }

  getLanguageUrl() {
    return this._localstorageService.getLanguageUrl();
  }

  consultarAplicacines() {
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

  consultarSuitees(): void {
    this.registrosSub = this._registrosService
      .geSuitesAP()
      .pipe(
        tap((resp: any) => {
          if (resp.ok) {
            resp.suites.forEach((reg: any) => {
              reg.nomEstado = reg.estadoSuite ? 'Activo' : 'Inactivo';
              reg.nomAplicacion = this.aplicaciones.filter((x) => x.codigoAplicacion == reg.codigoAplicacion)[0].nombreAplicacion;
              reg.imagenInicio = `${base_url}/upload/suites/${reg.imagenInicio}`;
            });
            this.registros = resp.suites;
            this.registrosFiltrado = resp.suites;
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
      name: 'imagenInicio',
      header: 'SUITE.FOTO',
      type: 'image',
      isSortable: false
    },
    {
      name: 'codigoSuite',
      header: 'SUITES.CODE',
      type: 'text'
    },
    {
      name: 'nombroSuite',
      header: 'SUITES.NAME',
      type: 'text'
    },
    {
      name: 'nomAplicacion',
      header: 'SUITES.APLICACION',
      type: 'text'
    },
    {
      name: 'nomEstado',
      header: 'SUITE.STATUS',
      type: 'text'
    }
  ];

  columnasDetailRegistros: ColumnMetadata[] = [
    {
      name: 'descripcionSuite',
      header: 'SUITES.DESCRIPTION',
      type: 'text'
    }
  ];

  onFiltroCodigoAplicacionChangeClick(evento: any) {
    console.log('filtrar el codigo ', evento.target.value);
    if (evento.target.value == 'todos') {
      this.registrosFiltrado = this.registros;
    } else {
      this.registrosFiltrado = this.registrosFiltrado.filter((x) => (x.codigoAplicacion = evento.target.value));
    }
  }

  onFiltroCodigoChangeClick(evento: any) {
    console.log('filtrar el codigo ', evento.target.value);
    if (evento.target.value == 'todos') {
      this.registrosFiltrado = this.registros;
    } else {
      this.registrosFiltrado = this.registrosFiltrado.filter((x) => (x.codigoSuite = evento.target.value));
    }
  }

  onFiltroNombreChangeClick(evento: any) {
    console.log('filtrar el nombre ', evento.target.value);
    if (evento.target.value == 'todos') {
      this.registrosFiltrado = this.registros;
    } else {
      this.registrosFiltrado = this.registrosFiltrado.filter((x) => (x.nombreSuite = evento.target.value));
    }
  }

  onFiltroDescripcionChangeClick(evento: any) {
    console.log('filtrar el descripcion ', evento.target.value);
    const textoFiltro = evento.target.value.toLowerCase();
    if (!textoFiltro) {
      this.registrosFiltrado = [...this.registros];
    } else {
      this.registrosFiltrado = this.registrosFiltrado.filter((app) => (app.descripcionSuite || '').toLowerCase().includes(textoFiltro));
      console.log('filtrados', this.registrosFiltrado);
    }
  }

  onFiltroEstadoChangeClick(evento: any) {
    console.log('filtrar el estado ', evento.target.value);
    // const estado: boolean = evento.target.value || true;
    if (evento.target.value == 'todos') {
      this.registrosFiltrado = this.registros;
    } else {
      const estado = evento.target.value == 'true' ? true : false;
      console.log('Suitees', this.registrosFiltrado);
      this.registrosFiltrado = this.registros.filter((x) => x.estadoSuite == estado);
    }
  }

  OnNuevoRegistroClick(): void {
    this._router.navigate(['aplicaciones/gestion-suite']);
  }

  OnEditarRegistroClick(id: number): void {
    this._router.navigate(['aplicaciones/gestion-suite'], { queryParams: { regId: id } });
  }

  OnEliminarRegistroClick(id: any): void {
    Swal.fire({
      title: this._translate.instant('SUITES.ELIMINARTITULO'),
      text: this._translate.instant('SUITES.ELIMINARTEXTO'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: this._translate.instant('PLATAFORMA.DELETE'),
      cancelButtonText: this._translate.instant('PLATAFORMA.CANCEL')
    }).then((result) => {
      if (result.isConfirmed) {
        this._registrosService.eliminarSuiteAP(id.id).subscribe({
          next: (resp: any) => {
            const logData = {
              codigoTipoLog: '',
              codigoRespuesta: '201',
              descripcionLog: this._translate.instant('SUITES.ELIMINAREXITOSA') + ' ' + resp.mensaje
            };
            this._logActividadesService.postCrearRegistro(logData).subscribe(() => console.log('log creado exitosamente'));
            Swal.fire(this._translate.instant('SUITES.ELIMINAREXITOSA'), resp.mensaje, 'success');
            this.registros = this.registros.filter((a) => a.suiteId !== id.id);
            this.registrosFiltrado = [...this.registros];
          },
          error: (err) => {
            const logData = {
              codigoTipoLog: '',
              codigoRespuesta: '501',
              descripcionLog: this._translate.instant('SUITES.ELIMINARERROR') + ' ' + err.mensaje
            };
            this._logActividadesService.postCrearRegistro(logData).subscribe(() => console.log('log creado exitosamente'));
            Swal.fire('Error', this._translate.instant('SUITES.ELIMINARERROR'), 'error');
          }
        });
      }
    });
  }

  toggleNav(): void {
    this.toggleSidebar.emit();
  }
}
