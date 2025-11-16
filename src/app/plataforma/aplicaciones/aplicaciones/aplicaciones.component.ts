// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { Component, EventEmitter, OnInit, Output } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { DataTablesModule } from 'angular-datatables';
// import { Router } from '@angular/router';
// import { SharedModule } from 'src/app/theme/shared/shared.module';
// import { TranslateModule, TranslateService } from '@ngx-translate/core';
// import { Observable, Subscription, of } from 'rxjs';
// import { catchError, tap } from 'rxjs/operators';
// import { GradientConfig } from 'src/app/app-config';

// import { PTLAplicacionModel } from 'src/app/theme/shared/_helpers/models/PTLAplicacion.model';
// import { NavContentComponent } from 'src/app/theme/layout/admin/navigation/nav-content/nav-content.component';
// import { NavBarComponent } from '../../../theme/layout/admin/nav-bar/nav-bar.component';
// import { DatatableComponent } from 'src/app/theme/shared/components/data-table/data-table.component';
// import { PtlAplicacionesService } from 'src/app/theme/shared/service/ptlaplicaciones.service';
// import { NavigationService } from 'src/app/theme/shared/service/navigation.service';

// import Swal from 'sweetalert2';
// import { ColumnMetadata } from 'src/app/theme/shared/_helpers/models/ColumnMetadata.model';
// // import { environment } from 'src/environments/environment';
// import { PTLLogActividadAPModel } from 'src/app/theme/shared/_helpers/models/PTLlogActividadAP.model';
// import { LocalStorageService, PtllogActividadesService, UploadFilesService } from 'src/app/theme/shared/service';
// import { BaseSessionModel } from 'src/app/theme/shared/_helpers/models/BaseSession.model';
// import { NavigationItem } from 'src/app/theme/shared/_helpers/models/Navigation.model';

// // const base_url = environment.apiUrl;

// @Component({
//   selector: 'app-aplicaciones',
//   standalone: true,
//   imports: [CommonModule, DataTablesModule, SharedModule, TranslateModule, NavBarComponent, NavContentComponent, DatatableComponent],
//   templateUrl: './aplicaciones.component.html',
//   styleUrl: './aplicaciones.component.scss'
// })
// export class AplicacionesComponent implements OnInit {
//   @Output() toggleSidebar = new EventEmitter<void>();
//   DataModel: BaseSessionModel = new BaseSessionModel();
//   DataLogActividad: PTLLogActividadAPModel = new PTLLogActividadAPModel();
//   aplicaciones$: Observable<PTLAplicacionModel[]> = this._aplicacionesService.aplicaciones$;
//   aplicacionesTransformadas$: Observable<PTLAplicacionModel[]> = this._aplicacionesService.aplicaciones$;
//   aplicaciones: PTLAplicacionModel[] = [];
//   aplicacionesFiltrado: PTLAplicacionModel[] = [];
//   registrosSub?: Subscription;
//   moduloTituloExcel: string = '';
//   filtroPersonalizado: string = '';
//   hasFiltersSlot: boolean = false;
//   gradientConfig;
//   lang = localStorage.getItem('lang');
//   menuItems$!: Observable<NavigationItem[]>;
//   activeTab: 'menu' | 'filters' | 'main' = 'menu';

//   constructor(
//     private router: Router,
//     private translate: TranslateService,
//     private _navigationService: NavigationService,
//     private _logActividadesService: PtllogActividadesService,
//     private _localStorageService: LocalStorageService,
//     private _aplicacionesService: PtlAplicacionesService,
//     private _uploadService: UploadFilesService
//   ) {
//     this.gradientConfig = GradientConfig;
//     this.aplicaciones$ = this._aplicacionesService.aplicaciones$;
//   }

//   ngOnInit(): void {
//     this._navigationService.getNavigationItems();
//     this.menuItems$ = this._navigationService.menuItems$;
//     this.hasFiltersSlot = true;
//     this.moduloTituloExcel = this.lang == 'es' ? 'Listado de Aplicaciones' : 'List of Aplications';
//     // this.DataModel = this._localStorageService.getDataModelsLocalStorage();
//     this._aplicacionesService.cargarAplicaciones().subscribe(
//       () => console.log('Aplicaciones cargadas y guardadas en el servicio'),
//       (err) => console.error('Error al cargar aplicaciones:', err)
//     );
//     this.consultarAplicaciones();
//   }

//   consultarAplicaciones(): void {
//     this.registrosSub = this._aplicacionesService
//       .getAplicaciones()
//       .pipe(
//         tap((resp: any) => {
//           if (resp.ok) {
//             console.log('respuesta aplicaciones', resp);
//             resp.aplicaciones.forEach((app: any) => {
//               app.nomEstado = app.estadoAplicacion ? 'Activo' : 'Inactivo';
//               app.captura = this._uploadService.getFilePath('plataforma', 'aplicaciones', app.imagenInicio);
//             });
//             this.aplicaciones = resp.aplicaciones;
//             this.aplicacionesFiltrado = resp.aplicaciones;
//           }
//         }),
//         catchError((err) => {
//           console.error(err);
//           return of([]);
//         })
//       )
//       .subscribe();
//   }

//   columnasAplicaciopnes: ColumnMetadata[] = [
//     {
//       name: 'captura',
//       header: 'APLICACIONES.FOTO',
//       type: 'image',
//       isSortable: false
//     },
//     {
//       name: 'codigoAplicacion',
//       header: 'APLICACIONES.CODE',
//       type: 'text'
//     },
//     {
//       name: 'nombreAplicacion',
//       header: 'APLICACIONES.NAME',
//       type: 'text'
//     },
//     {
//       name: 'nomEstado',
//       header: 'APLICACIONES.STATUS',
//       type: 'text'
//     }
//   ];

//   columnasDetailRegistros: ColumnMetadata[] = [
//     {
//       name: 'descripcionAplicacion',
//       header: 'APLICACIONES.DESCRIPTION',
//       type: 'text'
//     },
//     {
//       name: 'captura',
//       header: 'APLICACIONES.IMAGENINICIO',
//       type: 'capture'
//     }
//   ];

//   getLanguageUrl(): string {
//     const lang = localStorage.getItem('lang') || 'en';
//     return `//cdn.datatables.net/plug-ins/1.10.25/i18n/${lang === 'es' ? 'Spanish' : 'English'}.json`;
//   }

//   onFiltroCodigoChangeClick(evento: any) {
//     console.log('filtrar el codigo ', evento.target.value);
//     if (evento.target.value == 'todos') {
//       this.aplicacionesFiltrado = this.aplicaciones;
//     } else {
//       this.aplicacionesFiltrado = this.aplicacionesFiltrado.filter((x) => (x.codigoAplicacion = evento.target.value));
//     }
//   }

//   onFiltroNombreChangeClick(evento: any) {
//     console.log('filtrar el nombre ', evento.target.value);
//     if (evento.target.value == 'todos') {
//       this.aplicacionesFiltrado = this.aplicaciones;
//     } else {
//       this.aplicacionesFiltrado = this.aplicacionesFiltrado.filter((x) => (x.nombreAplicacion = evento.target.value));
//     }
//   }

//   onFiltroDescripcionChangeClick(evento: any) {
//     console.log('filtrar el descripcion ', evento.target.value);
//     const textoFiltro = evento.target.value.toLowerCase();
//     if (!textoFiltro) {
//       this.aplicacionesFiltrado = [...this.aplicaciones];
//     } else {
//       this.aplicacionesFiltrado = this.aplicacionesFiltrado.filter((app) =>
//         (app.descripcionAplicacion || '').toLowerCase().includes(textoFiltro)
//       );
//       console.log('filtrados', this.aplicacionesFiltrado);
//     }
//   }

//   onFiltroEstadoChangeClick(evento: any) {
//     console.log('filtrar el estado ', evento.target.value);
//     // const estado: boolean = evento.target.value || true;
//     if (evento.target.value == 'todos') {
//       this.aplicacionesFiltrado = this.aplicaciones;
//     } else {
//       const estado = evento.target.value == 'true' ? true : false;
//       console.log('Aplicaciones', this.aplicacionesFiltrado);
//       this.aplicacionesFiltrado = this.aplicaciones.filter((x) => x.estadoAplicacion == estado);
//     }
//   }

//   OnNuevaAplicaicionClick(): void {
//     this.router.navigate(['aplicaciones/gestion-aplicacion'], { queryParams: { regId: 'nuevo' } });
//   }

//   OnEditarAplicaicionClick(id: string): void {
//     this.router.navigate(['aplicaciones/gestion-aplicacion'], { queryParams: { regId: id } });
//   }

//   OnEliminarAplicaicionClick(id: string): void {
//     console.log('id aplicacion', id);
//     // const nombreApp = this.aplicacionesFiltrado.filter((x) => x.codigoAplicacion == id)[0];
//     Swal.fire({
//       title: this.translate.instant('APLICACIONES.ELIMINARTITULO'),
//       text: this.translate.instant('APLICACIONES.ELIMINARTEXTO'),
//       icon: 'warning',
//       showCancelButton: true,
//       confirmButtonText: this.translate.instant('PLATAFORMA.DELETE'),
//       cancelButtonText: this.translate.instant('PLATAFORMA.CANCEL')
//     }).then((result) => {
//       if (result.isConfirmed) {
//         this._aplicacionesService.eliminarAplicacion(id).subscribe({
//           next: (resp: any) => {
//             const logData = {
//               codigoTipoLog: '',
//               codigoRespuesta: '201',
//               descripcionLog: this.translate.instant('APLICACIONES.ELIMINAREXITOSA')
//             };
//             this._logActividadesService.postCrearRegistro(logData).subscribe(() => console.log('log creado exitosamente'));
//             Swal.fire(this.translate.instant('APLICACIONES.ELIMINAREXITOSA'), resp.mensaje, 'success');
//             this.aplicaciones = this.aplicaciones.filter((a) => a.codigoAplicacion !== id);
//             this.consultarAplicaciones();
//           },
//           error: () => {
//             const logData = {
//               codigoTipoLog: '',
//               codigoRespuesta: '501',
//               descripcionLog: this.translate.instant('APLICACIONES.ELIMINARERROR')
//             };
//             this._logActividadesService.postCrearRegistro(logData).subscribe(() => console.log('log creado exitosamente'));
//             Swal.fire('Error', this.translate.instant('APLICACIONES.ELIMINARERROR'), 'error');
//           }
//         });
//       }
//     });
//   }

//   toggleNav(): void {
//     this.toggleSidebar.emit();
//   }
// }

/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, EventEmitter, OnInit, OnDestroy, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTablesModule } from 'angular-datatables';
import { Router } from '@angular/router';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Observable, Subscription, of, BehaviorSubject, combineLatest } from 'rxjs'; // Importación de BehaviorSubject y combineLatest
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { GradientConfig } from 'src/app/app-config';

import { PTLAplicacionModel } from 'src/app/theme/shared/_helpers/models/PTLAplicacion.model';
import { NavContentComponent } from 'src/app/theme/layout/admin/navigation/nav-content/nav-content.component';
import { NavBarComponent } from '../../../theme/layout/admin/nav-bar/nav-bar.component';
import { DatatableComponent } from 'src/app/theme/shared/components/data-table/data-table.component';
import { PtlAplicacionesService } from 'src/app/theme/shared/service/ptlaplicaciones.service';
import { NavigationService } from 'src/app/theme/shared/service/navigation.service';

import Swal from 'sweetalert2';
import { ColumnMetadata } from 'src/app/theme/shared/_helpers/models/ColumnMetadata.model';
import { PTLLogActividadAPModel } from 'src/app/theme/shared/_helpers/models/PTLlogActividadAP.model';
import { LocalStorageService, PtllogActividadesService, UploadFilesService } from 'src/app/theme/shared/service';
import { BaseSessionModel } from 'src/app/theme/shared/_helpers/models/BaseSession.model';
import { NavigationItem } from 'src/app/theme/shared/_helpers/models/Navigation.model';

@Component({
  selector: 'app-aplicaciones',
  standalone: true,
  imports: [CommonModule, DataTablesModule, SharedModule, TranslateModule, NavBarComponent, NavContentComponent, DatatableComponent],
  templateUrl: './aplicaciones.component.html',
  styleUrl: './aplicaciones.component.scss'
})
export class AplicacionesComponent implements OnInit, OnDestroy {
  @Output() toggleSidebar = new EventEmitter<void>();
  DataModel: BaseSessionModel = new BaseSessionModel();
  DataLogActividad: PTLLogActividadAPModel = new PTLLogActividadAPModel();

  // Observables para los filtros (BehaviorSubject inicializados con valor por defecto)
  private filtroCodigoSubject = new BehaviorSubject<string>('todos');
  private filtroNombreSubject = new BehaviorSubject<string>('todos');
  private filtroDescripcionSubject = new BehaviorSubject<string>('');
  private filtroEstadoSubject = new BehaviorSubject<string>('todos');

  // Fuente de datos principal (Aplicaciones transformadas) - Inicializada para evitar errores de TypeScript
  aplicacionesTransformadas$: Observable<PTLAplicacionModel[]> = of([]);

  // Observable final que alimenta la tabla (Aplicaciones transformadas + Filtros) - Inicializada para evitar errores de TypeScript
  aplicacionesFiltradas$: Observable<PTLAplicacionModel[]> = of([]);

  // El array se mantiene para las opciones de los filtros SELECT
  aplicaciones: PTLAplicacionModel[] = [];

  // Variables auxiliares
  moduloTituloExcel: string = '';
  hasFiltersSlot: boolean = false;
  gradientConfig;
  lang = localStorage.getItem('lang');
  menuItems$!: Observable<NavigationItem[]>;
  activeTab: 'menu' | 'filters' | 'main' = 'menu';
  private subscriptions = new Subscription(); // Contenedor de suscripciones

  constructor(
    private router: Router,
    private translate: TranslateService,
    private _navigationService: NavigationService,
    private _logActividadesService: PtllogActividadesService,
    private _localStorageService: LocalStorageService,
    private _aplicacionesService: PtlAplicacionesService,
    private _uploadService: UploadFilesService
  ) {
    this.gradientConfig = GradientConfig;
  }

  ngOnInit(): void {
    this._navigationService.getNavigationItems();
    this.menuItems$ = this._navigationService.menuItems$;
    this.hasFiltersSlot = true;

    // 1. Configuración del flujo reactivo
    this.setupAplicacionesStream();

    // 2. Cargar las aplicaciones (dispara la obtención de datos)
    // Se suscribe para asegurar que los datos se carguen y estén disponibles en el servicio
    this.subscriptions.add(
      this._aplicacionesService.cargarAplicaciones().subscribe(
        () => console.log('Aplicaciones cargadas y guardadas en el servicio'),
        (err) => console.error('Error al cargar aplicaciones:', err)
      )
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  /**
   * Configura el flujo reactivo completo de las aplicaciones (Transformación + Filtros).
   */
  setupAplicacionesStream(): void {
    // 1. Stream de Aplicaciones Transformadas (Fuente de Datos Maestra)
    this.aplicacionesTransformadas$ = this._aplicacionesService.aplicaciones$.pipe(
      // switchMap para reaccionar a los cambios en el servicio (si usa un BehaviorSubject interno)
      switchMap((apps: PTLAplicacionModel[]) => {
        if (!apps) return of([]);

        // Aplica la transformación de datos (nomEstado, captura)
        const transformedApps = apps.map((app: any) => {
          app.nomEstado = app.estadoAplicacion ? 'Activo' : 'Inactivo';
          app.captura = this._uploadService.getFilePath('plataforma', 'aplicaciones', app.imagenInicio);
          return app as PTLAplicacionModel;
        });

        // Se actualiza la variable local para que los <select> de filtros tengan opciones
        // Esta es la única parte imperativa necesaria para poblar las opciones de los SELECT
        this.aplicaciones = transformedApps;

        return of(transformedApps);
      }),
      catchError((err) => {
        console.error('Error en el stream de aplicaciones:', err);
        return of([]);
      })
    );

    // 2. Stream de Aplicaciones Filtradas (Combina Datos Transformados + Filtros)
    this.aplicacionesFiltradas$ = combineLatest([
      this.aplicacionesTransformadas$.pipe(startWith([])), // Usa la fuente de datos transformada
      this.filtroCodigoSubject,
      this.filtroNombreSubject,
      this.filtroDescripcionSubject,
      this.filtroEstadoSubject
    ]).pipe(
      map(([apps, codigo, nombre, descripcion, estado]) => {
        // Lógica de filtrado combinada
        let filteredApps = apps;

        // Filtro por Código
        if (codigo !== 'todos') {
          filteredApps = filteredApps.filter(app => app.codigoAplicacion === codigo);
        }

        // Filtro por Nombre
        if (nombre !== 'todos') {
          filteredApps = filteredApps.filter(app => app.nombreAplicacion === nombre);
        }

        // Filtro por Estado
        if (estado !== 'todos') {
          const estadoBoolean = estado === 'true';
          filteredApps = filteredApps.filter(app => app.estadoAplicacion === estadoBoolean);
        }

        // Filtro por Descripción (Búsqueda de texto libre)
        if (descripcion) {
          const textoFiltro = descripcion.toLowerCase();
          filteredApps = filteredApps.filter(app =>
            (app.descripcionAplicacion || '').toLowerCase().includes(textoFiltro)
          );
        }

        return filteredApps;
      })
    );
  }

  // Los métodos de filtro ahora solo actualizan el BehaviorSubject correspondiente
  onFiltroCodigoChangeClick(evento: any): void {
    const value = evento.target.value;
    this.filtroCodigoSubject.next(value);
  }

  onFiltroNombreChangeClick(evento: any): void {
    const value = evento.target.value;
    this.filtroNombreSubject.next(value);
  }

  onFiltroDescripcionChangeClick(evento: any): void {
    const value = evento.target.value;
    this.filtroDescripcionSubject.next(value);
  }

  onFiltroEstadoChangeClick(evento: any): void {
    const value = evento.target.value;
    this.filtroEstadoSubject.next(value);
  }

  // --- El resto de métodos y metadatos se mantienen ---

  columnasAplicaciopnes: ColumnMetadata[] = [
    {
      name: 'captura',
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
    },
    {
      name: 'captura',
      header: 'APLICACIONES.IMAGENINICIO',
      type: 'capture'
    }
  ];

  OnNuevaAplicaicionClick(): void {
    this.router.navigate(['aplicaciones/gestion-aplicacion'], { queryParams: { regId: 'nuevo' } });
  }

  OnEditarAplicaicionClick(id: string): void {
    this.router.navigate(['aplicaciones/gestion-aplicacion'], { queryParams: { regId: id } });
  }

  OnEliminarAplicaicionClick(id: string): void {
    console.log('id aplicacion', id);
    Swal.fire({
      title: this.translate.instant('APLICACIONES.ELIMINARTITULO'),
      text: this.translate.instant('APLICACIONES.ELIMINARTEXTO'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: this.translate.instant('PLATAFORMA.DELETE'),
      cancelButtonText: this.translate.instant('PLATAFORMA.CANCEL')
    }).then((result) => {
      if (result.isConfirmed) {
        this._aplicacionesService.eliminarAplicacion(id).subscribe({
          next: (resp: any) => {
            const logData = {
              codigoTipoLog: '',
              codigoRespuesta: '201',
              descripcionLog: this.translate.instant('APLICACIONES.ELIMINAREXITOSA')
            };
            this._logActividadesService.postCrearRegistro(logData).subscribe(() => console.log('log creado exitosamente'));
            Swal.fire(this.translate.instant('APLICACIONES.ELIMINAREXITOSA'), resp.mensaje, 'success');
            // Nota: Aquí el servicio PtlAplicacionesService debería emitir el nuevo listado actualizado
            // Asumiendo que el servicio hace esto, el stream se actualizará automáticamente.
          },
          error: () => {
            const logData = {
              codigoTipoLog: '',
              codigoRespuesta: '501',
              descripcionLog: this.translate.instant('APLICACIONES.ELIMINARERROR')
            };
            this._logActividadesService.postCrearRegistro(logData).subscribe(() => console.log('log creado exitosamente'));
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
