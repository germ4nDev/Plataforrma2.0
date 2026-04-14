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

import { PTLFormatosGaleria } from 'src/app/theme/shared/_helpers/models/PTLFormatosGaleria.model';
import { NavContentComponent } from 'src/app/theme/layout/admin/navigation/nav-content/nav-content.component';
import { NavBarComponent } from 'src/app/theme/layout/admin/nav-bar/nav-bar.component';
import { DatatableComponent } from 'src/app/theme/shared/components/data-table/data-table.component';
import { PtlFormatosGaleriaService } from 'src/app/theme/shared/service/ptlformatosgaleria.service';
import { NavigationService } from 'src/app/theme/shared/service/navigation.service';

import Swal from 'sweetalert2';
import { ColumnMetadata } from 'src/app/theme/shared/_helpers/models/ColumnMetadata.model';
import { PTLLogActividadAPModel } from 'src/app/theme/shared/_helpers/models/PTLlogActividadAP.model';
import { LocalStorageService, PtllogActividadesService } from 'src/app/theme/shared/service';
import { BaseSessionModel } from 'src/app/theme/shared/_helpers/models/BaseSession.model';
import { NavigationItem } from 'src/app/theme/shared/_helpers/models/Navigation.model';

@Component({
  selector: 'app-formatos-galeria',
  standalone: true,
  imports: [CommonModule, DataTablesModule, SharedModule, TranslateModule, NavBarComponent, NavContentComponent, DatatableComponent],
  templateUrl: './formatos-galeria.component.html',
  styleUrl: './formatos-galeria.component.scss'
})
export class FormatosGaleriaComponent implements OnInit, OnDestroy {
  @Output() toggleSidebar = new EventEmitter<void>();
  DataModel: BaseSessionModel = new BaseSessionModel();
  DataLogActividad: PTLLogActividadAPModel = new PTLLogActividadAPModel();
  hasFiltersSlot: boolean = false;
  gradientConfig;
  menuItems$!: Observable<NavigationItem[]>;
  activeTab: 'menu' | 'filters' | 'main' = 'menu';

  subscriptions = new Subscription();
  filtroCodigoSubject = new BehaviorSubject<string>('todos');
  filtroNombreSubject = new BehaviorSubject<string>('todos');
  filtroDescripcionSubject = new BehaviorSubject<string>('');
  filtroEstadoSubject = new BehaviorSubject<string>('todos');

  formatosTransformada$: Observable<PTLFormatosGaleria[]> = of([]);
  formatosFiltrada$: Observable<PTLFormatosGaleria[]> = of([]);
  formatos: PTLFormatosGaleria[] = [];

  constructor(
    private router: Router,
    private translate: TranslateService,
    private _navigationService: NavigationService,
    private _logActividadesService: PtllogActividadesService,
    private _localStorageService: LocalStorageService,
    private _formatosGaleriaService: PtlFormatosGaleriaService
  ) {
    this.gradientConfig = GradientConfig;
  }

  ngOnInit(): void {
    this._navigationService.getNavigationItems();
    this.menuItems$ = this._navigationService.menuItems$;
    this.hasFiltersSlot = true;
    this.setupFormatosStream();
    this.subscriptions.add(
      this._formatosGaleriaService.cargarFormatosGaleria().subscribe(
        () => console.log('Datos de Formatos de Galería cargados'),
        (err) => console.error('Error al cargar Formatos:', err)
      )
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  setupFormatosStream(): void {
    this.formatosTransformada$ = this._formatosGaleriaService.formatosGaleria$.pipe(
      switchMap((formatos: PTLFormatosGaleria[]) => {
        if (!formatos) return of([]);
        const transformed = formatos.map((f: any) => {
          f.nomEstado = f.estadoFormatosGaleria ? 'Activo' : 'Inactivo';
          return f as PTLFormatosGaleria;
        });
        this.formatos = transformed;
        return of(transformed);
      }),
      catchError((err) => {
        console.error('Error en el stream de Formatos:', err);
        return of([]);
      })
    );

    this.formatosFiltrada$ = combineLatest([
      this.formatosTransformada$.pipe(startWith([])),
      this.filtroCodigoSubject,
      this.filtroNombreSubject,
      this.filtroDescripcionSubject,
      this.filtroEstadoSubject
    ]).pipe(
      map(([formatos, codigo, nombre, descripcion, estado]) => {
        let filtered = formatos;

        if (codigo !== 'todos') filtered = filtered.filter((f) => f.codigoFormatosGaleria === codigo);
        if (nombre !== 'todos') filtered = filtered.filter((f) => f.nombreFormatosGaleria === nombre);
        if (estado !== 'todos') {
          const estadoBoolean = estado === 'true';
          filtered = filtered.filter((f) => f.estadoFormatosGaleria === estadoBoolean);
        }
        if (descripcion) {
          const textoFiltro = descripcion.toLowerCase();
          filtered = filtered.filter((f) => (f.descripcionFormatosGaleria || '').toLowerCase().includes(textoFiltro));
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

  columnasFormatos: ColumnMetadata[] = [
    { name: 'codigoFormatosGaleria', header: 'FORMATOSGALERIA.CODE', type: 'text' },
    { name: 'nombreFormatosGaleria', header: 'FORMATOSGALERIA.NAME', type: 'text' },
    { name: 'nomEstado', header: 'FORMATOSGALERIA.STATUS', type: 'estado' }
  ];

  columnasDetailRegistros: ColumnMetadata[] = [{ name: 'descripcionFormatosGaleria', header: 'FORMATOSGALERIA.DESCRIPTION', type: 'text' }];

  OnNuevoFormatoClick(): void {
    this.router.navigate(['/biblioteca/gestion-formatos-galeria'], { queryParams: { regId: 'nuevo' } });
  }

  OnEditarFormatoClick(id: string): void {
    this.router.navigate(['/biblioteca/gestion-formatos-galeria'], { queryParams: { regId: id } });
  }

  OnEliminarFormatoClick(id: string): void {
    Swal.fire({
      title: this.translate.instant('FORMATOSGALERIA.ELIMINARTITULO'),
      text: this.translate.instant('FORMATOSGALERIA.ELIMINARTEXTO'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: this.translate.instant('PLATAFORMA.DELETE'),
      cancelButtonText: this.translate.instant('PLATAFORMA.CANCEL')
    }).then((result) => {
      if (result.isConfirmed) {
        this._formatosGaleriaService.eliminarFormatoGaleria(id).subscribe({
          next: (resp: any) => {
            Swal.fire(this.translate.instant('FORMATOSGALERIA.ELIMINAREXITOSA'), resp.mensaje, 'success');
            this.setupFormatosStream();
          },
          error: () => Swal.fire('Error', this.translate.instant('FORMATOSGALERIA.ELIMINARERROR'), 'error')
        });
      }
    });
  }

  toggleNav(): void {
    this.toggleSidebar.emit();
  }
}
