import { PTLAplicacionModel } from './../../../theme/shared/_helpers/models/PTLAplicacion.model';
import { PtlAplicacionesService } from './../../../theme/shared/service/ptlaplicaciones.service';
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
import { PTLPaqueteModel } from 'src/app/theme/shared/_helpers/models/PTLPaquete.model';
import { PTLPaquetesService } from 'src/app/theme/shared/service/ptlpaquetes.service';
import { ColumnMetadata } from 'src/app/theme/shared/_helpers/models/ColumnMetadata.model';
import { LocalStorageService, SwalAlertService } from 'src/app/theme/shared/service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-paquetes',
  standalone: true,
  imports: [CommonModule, DataTablesModule, SharedModule, TranslateModule, NavBarComponent, NavContentComponent, DatatableComponent],
  templateUrl: './paquetes.component.html',
  styleUrl: './paquetes.component.scss'
})
export class PaquetesComponent implements OnInit {
  @Output() toggleSidebar = new EventEmitter<void>();
  aplicacionesSub?: Subscription;
  registrosSub?: Subscription;
  registros: PTLPaqueteModel[] = [];
  registrosFiltrado: PTLPaqueteModel[] = [];
  aplicaciones: PTLAplicacionModel[] = [];
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
    private _swalService: SwalAlertService,
    private _localstorageService: LocalStorageService,
    private _registrosService: PTLPaquetesService,
    private _aplicacionesService: PtlAplicacionesService
  ) {
    this.gradientConfig = GradientConfig;
  }

  ngOnInit(): void {
    this._navigationService.getNavigationItems();
    this.menuItems$ = this._navigationService.menuItems$;
    this.hasFiltersSlot = true;
    this.moduloTituloExcel = this.lang == 'es' ? 'Listado de Suitees' : 'List of Aplications';
    this.consultarRegistros();
  }

  consultarRegistros(): void {
    this.registrosSub = this._registrosService
      .getRegistros()
      .pipe(
        tap((resp: any) => {
          if (resp.ok) {
            resp.paquetes.forEach((reg: any) => {
              reg.nomEstado = reg.estadoPaquete ? 'Activo' : 'Inactivo';
            });
            this.registros = resp.paquetes;
            this.registrosFiltrado = resp.paquetes;
          }
        }),
        catchError((err) => {
          console.error(err);
          return of([]);
        })
      )
      .subscribe();
  }

  columnasPaquetes: ColumnMetadata[] = [
    {
      name: 'codigoPaquete',
      header: 'PAQUETES.CODE',
      type: 'text'
    },
    {
      name: 'nombrePaquete',
      header: 'PAQUETES.NAME',
      type: 'text'
    },
    {
      name: 'costoPaquete',
      header: 'PAQUETES.COSTE',
      type: 'price'
    },
    {
      name: 'precioPaquete',
      header: 'PAQUETES.PRECIO',
      type: 'price'
    },
    {
      name: 'nomEstado',
      header: 'PAQUETES.STATUS',
      type: 'text'
    }
  ];

  columnasDetailRegistros: ColumnMetadata[] = [
    {
      name: 'nomPromocion',
      header: 'PAQUETES.PROMOCION',
      type: 'text'
    },
    {
      name: 'precioPromocion',
      header: 'PAQUETES.PRECIOPROMOCION',
      type: 'price'
    },
    {
      name: 'imagenPaquete',
      header: 'PAQUETES.IMAGEN',
      type: 'image'
    },
    {
      name: 'iconoPaquete',
      header: 'PAQUETES.ICONO',
      type: 'avatar'
    },
    {
      name: 'descripcionPaquete',
      header: 'PAQUETES.DESCRIPTION',
      type: 'text'
    },
    {
      name: 'acuerdoLicencia',
      header: 'PAQUETES.ACUERDOLICENCIA',
      type: 'text'
    }
  ];

  getLanguageUrl(): string {
    const lang = this._localstorageService.getLanguage() || 'en';
    return `//cdn.datatables.net/plug-ins/1.10.25/i18n/${lang === 'es' ? 'Spanish' : 'English'}.json`;
  }

  onFiltroNombreCodigoClick(evento: any) {
    console.log('filtrar el codigo ', evento.target.value);
    if (evento.target.value == 'todos') {
      this.registrosFiltrado = this.registros;
    } else {
      this.registrosFiltrado = this.registrosFiltrado.filter((x) => (x.codigoPaquete = evento.target.value));
    }
  }

  onFiltroNombreChangeClick(evento: any) {
    console.log('filtrar el nombre ', evento.target.value);
    if (evento.target.value == 'todos') {
      this.registrosFiltrado = this.registros;
    } else {
      this.registrosFiltrado = this.registrosFiltrado.filter((x) => (x.nombrePaquete = evento.target.value));
    }
  }

  onFiltroDescripcionChangeClick(evento: any) {
    console.log('filtrar el descripcion ', evento.target.value);
    const textoFiltro = evento.target.value.toLowerCase();
    if (!textoFiltro) {
      this.registrosFiltrado = [...this.registros];
    } else {
      this.registrosFiltrado = this.registrosFiltrado.filter((app) => (app.descripcionPaquete || '').toLowerCase().includes(textoFiltro));
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
      this.registrosFiltrado = this.registros.filter((x) => x.estadoPaquete == estado);
    }
  }

  OnNuevoRegistroClick(): void {
    this.router.navigate(['paquetes/gestion-paquete']);
  }

  OnEditarRegistroClick(id: number): void {
    this.router.navigate(['paquetes/gestion-paquete'], { queryParams: { aplicacionId: id } });
  }

  OnEliminarRegistroClick(id: number): void {
    const nombreApp = this.registrosFiltrado.filter((x) => x.paqueteId == id)[0];
    Swal.fire({
      title: this.translate.instant('APLICACIONES.ELIMINARTITULO'),
      text: this.translate.instant('APLICACIONES.ELIMINARTEXTO') + `"${nombreApp.nombrePaquete}".`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: this.translate.instant('PLATAFORMA.DELETE'),
      cancelButtonText: this.translate.instant('PLATAFORMA.CANCEL')
    }).then((result) => {
      if (result.isConfirmed) {
        this._registrosService.deleteEliminarRegistro(id).subscribe({
          next: (resp: any) => {
            Swal.fire(this.translate.instant('APLICACIONES.ELIMINAREXITOSA'), resp.mensaje, 'success');
            this.registros = this.registros.filter((a) => a.paqueteId !== id);
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
