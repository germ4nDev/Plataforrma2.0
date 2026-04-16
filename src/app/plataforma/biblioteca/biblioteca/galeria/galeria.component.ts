/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, EventEmitter, OnInit, OnDestroy, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTablesModule } from 'angular-datatables';
import { Router } from '@angular/router';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Observable, Subscription, of, BehaviorSubject, combineLatest } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { GradientConfig } from 'src/app/app-config';

import { PTLGaleria } from 'src/app/theme/shared/_helpers/models/PTLGaleria.model';
import { NavContentComponent } from 'src/app/theme/layout/admin/navigation/nav-content/nav-content.component';
import { NavBarComponent } from '../../../../theme/layout/admin/nav-bar/nav-bar.component';
import { DatatableComponent } from 'src/app/theme/shared/components/data-table/data-table.component';
import { PtlGaleriaService } from 'src/app/theme/shared/service/ptlgaleria.service';
import { NavigationService } from 'src/app/theme/shared/service/navigation.service';

import Swal from 'sweetalert2';
import { ColumnMetadata } from 'src/app/theme/shared/_helpers/models/ColumnMetadata.model';
import { PTLLogActividadAPModel } from 'src/app/theme/shared/_helpers/models/PTLlogActividadAP.model';
import { LocalStorageService, PtllogActividadesService, UploadFilesService } from 'src/app/theme/shared/service';
import { BaseSessionModel } from 'src/app/theme/shared/_helpers/models/BaseSession.model';
import { NavigationItem } from 'src/app/theme/shared/_helpers/models/Navigation.model';

@Component({
  selector: 'app-galeria',
  standalone: true,
  imports: [CommonModule, DataTablesModule, SharedModule, TranslateModule, NavBarComponent, NavContentComponent, DatatableComponent],
  templateUrl: './galeria.component.html',
  styleUrl: './galeria.component.scss'
})
export class GaleriaComponent implements OnInit, OnDestroy {
  @Output() toggleSidebar = new EventEmitter<void>();
  DataModel: BaseSessionModel = new BaseSessionModel();
  DataLogActividad: PTLLogActividadAPModel = new PTLLogActividadAPModel();
  moduloTituloExcel: string = '';
  hasFiltersSlot: boolean = false;
  gradientConfig;
  lang = localStorage.getItem('lang');
  menuItems$!: Observable<NavigationItem[]>;
  activeTab: 'menu' | 'filters' | 'main' = 'menu';

  subscriptions = new Subscription();
  filtroCodigoSubject = new BehaviorSubject<string>('todos');
  filtroNombreSubject = new BehaviorSubject<string>('todos');
  filtroDescripcionSubject = new BehaviorSubject<string>('');
  filtroEstadoSubject = new BehaviorSubject<string>('todos');

  galeriaTransformada$: Observable<PTLGaleria[]> = of([]);
  galeriaFiltrada$: Observable<PTLGaleria[]> = of([]);
  galerias: PTLGaleria[] = [];

  constructor(
    private router: Router,
    private translate: TranslateService,
    private _navigationService: NavigationService,
    private _logActividadesService: PtllogActividadesService,
    private _localStorageService: LocalStorageService,
    private _galeriaService: PtlGaleriaService,
    private _uploadService: UploadFilesService
  ) {
    this.gradientConfig = GradientConfig;
  }

  cargarDatos(): void {
    this.subscriptions.add(
      this._galeriaService.cargarGaleria().subscribe(
        () => console.log('Datos de galería cargados'),
        (err) => console.error('Error al cargar galería:', err)
      )
    );
  }

  ngOnInit(): void {
    this._navigationService.getNavigationItems();
    this.menuItems$ = this._navigationService.menuItems$;
    this.hasFiltersSlot = true;
    this.setupGaleriaStream();
    this.cargarDatos();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  setupGaleriaStream(): void {
    this.galeriaTransformada$ = this._galeriaService.galeria$.pipe(
      switchMap((gals: PTLGaleria[]) => {
        if (!gals) return of([]);
        const transformed = gals.map((gal: any) => {
          gal.nomEstado = gal.estadoGaleria ? 'Activo' : 'Inactivo';
          gal.imagenGaleria = this._uploadService.getFilePath('plataforma', 'galeria', gal.imagenGaleria || 'no-imagen.png');
          return gal as PTLGaleria;
        });
        this.galerias = transformed;
        return of(transformed);
      }),
      catchError((err) => {
        console.error('Error en el stream de galería:', err);
        return of([]);
      })
    );

    this.galeriaFiltrada$ = combineLatest([
      this.galeriaTransformada$.pipe(startWith([])),
      this.filtroCodigoSubject,
      this.filtroNombreSubject,
      this.filtroDescripcionSubject,
      this.filtroEstadoSubject
    ]).pipe(
      map(([gals, codigo, nombre, descripcion, estado]) => {
        let filtered = gals;

        if (codigo !== 'todos') {
          filtered = filtered.filter((gal) => gal.codigoGaleria === codigo);
        }
        if (nombre !== 'todos') {
          filtered = filtered.filter((gal) => gal.nombreGaleria === nombre);
        }
        if (estado !== 'todos') {
          const estadoBoolean = estado === 'true';
          filtered = filtered.filter((gal) => gal.estadoGaleria === estadoBoolean);
        }
        if (descripcion) {
          const textoFiltro = descripcion.toLowerCase();
          filtered = filtered.filter((gal) => (gal.descripcionGaleria || '').toLowerCase().includes(textoFiltro));
        }
        return filtered;
      })
    );
  }

  onFiltroCodigoChangeClick(evento: any): void {
    this.filtroCodigoSubject.next(evento.target.value);
  }
  onFiltroNombreChangeClick(evento: any): void {
    this.filtroNombreSubject.next(evento.target.value);
  }
  onFiltroDescripcionChangeClick(evento: any): void {
    this.filtroDescripcionSubject.next(evento.target.value);
  }
  onFiltroEstadoChangeClick(evento: any): void {
    this.filtroEstadoSubject.next(evento.target.value);
  }

  columnasGaleria: ColumnMetadata[] = [
    { name: 'imagenGaleria', header: 'GALERIA.FOTO', type: 'image', isSortable: false },
    { name: 'codigoGaleria', header: 'GALERIA.CODE', type: 'text' },
    { name: 'nombreGaleria', header: 'GALERIA.NAME', type: 'text' },
    { name: 'nomEstado', header: 'GALERIA.STATUS', type: 'estado' }
  ];

  columnasDetailRegistros: ColumnMetadata[] = [
    { name: 'descripcionGaleria', header: 'GALERIA.DESCRIPTION', type: 'text' },
    { name: 'imagenGaleria', header: 'GALERIA.FOTO', type: 'capture' }
  ];

  OnNuevaGaleriaClick(): void {
    this.router.navigate(['/biblioteca/galeria/gestion-galeria'], { queryParams: { regId: 'nuevo' } });
  }

  OnEditarGaleriaClick(id: string): void {
    this.router.navigate(['/biblioteca/galeria/gestion-galeria'], { queryParams: { regId: id } });
  }

  OnEliminarGaleriaClick(evento: any): void {
    const id = typeof evento === 'string' ? evento : evento?.codigoGaleria || evento?.id;
    if (!id) {
      console.error('No se pudo extraer el ID del registro a eliminar. El evento recibido fue:', evento);
      return;
    }

    Swal.fire({
      title: this.translate.instant('GALERIA.ELIMINARTITULO'),
      text: this.translate.instant('GALERIA.ELIMINARTEXTO'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: this.translate.instant('PLATAFORMA.DELETE'),
      cancelButtonText: this.translate.instant('PLATAFORMA.CANCEL')
    }).then((result) => {
      if (result.isConfirmed) {
        this._galeriaService.eliminarGaleria(id).subscribe({
          next: (resp: any) => {
            const logData = {
              codigoTipoLog: '',
              codigoRespuesta: '201',
              descripcionLog: this.translate.instant('GALERIA.ELIMINAREXITOSA')
            };
            this._logActividadesService.postCrearRegistro(logData).subscribe();
            Swal.fire(this.translate.instant('GALERIA.ELIMINAREXITOSA'), resp.mensaje, 'success');
            this.cargarDatos();
          },
          error: () => {
            const logData = { codigoTipoLog: '', codigoRespuesta: '501', descripcionLog: this.translate.instant('GALERIA.ELIMINARERROR') };
            this._logActividadesService.postCrearRegistro(logData).subscribe();
            Swal.fire('Error', this.translate.instant('GALERIA.ELIMINARERROR'), 'error');
          }
        });
      }
    });
  }

  toggleNav(): void {
    this.toggleSidebar.emit();
  }
}
