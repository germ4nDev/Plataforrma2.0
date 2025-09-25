/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTablesModule } from 'angular-datatables';
import { Router } from '@angular/router';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subscription, of } from 'rxjs';
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
  menuItems: NavigationItem[] = [];
  activeTab: 'menu' | 'filters' | 'main' = 'menu';

  constructor(
    private router: Router,
    private navigationService: NavigationService,
    private aplicacionesService: PtlAplicacionesService,
    private registrosService: PtlSuitesAPService,
    private translate: TranslateService
  ) {
    this.gradientConfig = GradientConfig;
  }

  ngOnInit(): void {
    const appCode = localStorage.getItem('aplicacionId') || 'plataforma';
    this.menuItems = this.navigationService.getNavigationItems(appCode);
    this.hasFiltersSlot = true;
    this.moduloTituloExcel = this.lang == 'es' ? 'Listado de Suitees' : 'List of Aplications';
    this.consultarSuitees();
    this.consultarAplicacines();
  }

  consultarAplicacines() {
    this.aplicacionesSub = this.aplicacionesService
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
    this.registrosSub = this.registrosService
      .geSuitesAP()
      .pipe(
        tap((resp: any) => {
          if (resp.ok) {
            resp.registros.forEach((app: any) => {
              app.nomEstado = app.estadoSuite ? 'Activo' : 'Inactivo';
            });
            this.registros = resp.registros;
            this.registrosFiltrado = resp.registros;
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
    this.router.navigate(['suites/gestion-suite']);
  }

  OnEditarRegistroClick(id: number): void {
    this.router.navigate(['suites/gestion-suite'], { queryParams: { aplicacionId: id } });
  }

  OnEliminarRegistroClick(id: number): void {
    const nombreApp = this.registrosFiltrado.filter((x) => x.suiteId == id)[0];
    Swal.fire({
      title: this.translate.instant('APLICACIONES.ELIMINARTITULO'),
      text: this.translate.instant('APLICACIONES.ELIMINARTEXTO') + `"${nombreApp.nombreSuite}".`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: this.translate.instant('PLATAFORMA.DELETE'),
      cancelButtonText: this.translate.instant('PLATAFORMA.CANCEL')
    }).then((result) => {
      if (result.isConfirmed) {
        this.registrosService.eliminarSuiteAP(id).subscribe({
          next: (resp: any) => {
            Swal.fire(this.translate.instant('APLICACIONES.ELIMINAREXITOSA'), resp.mensaje, 'success');
            this.registros = this.registros.filter((a) => a.suiteId !== id);
            this.registrosFiltrado = [...this.registros];
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
