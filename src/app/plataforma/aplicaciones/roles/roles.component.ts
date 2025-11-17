/* eslint-disable @angular-eslint/use-lifecycle-interface */
/* eslint-disable @typescript-eslint/no-explicit-any */
//#region IMPORTS
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GradientConfig } from 'src/app/app-config';
import { Router } from '@angular/router';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { TranslateService } from '@ngx-translate/core';
import { PTLRoleAPModel } from 'src/app/theme/shared/_helpers/models/PTLRoleAP.model';
import { PTLRolesAPService } from 'src/app/theme/shared/service/ptlroles-ap.service';
import { LanguageService } from 'src/app/theme/shared/service/lenguage.service';
import { PtlAplicacionesService } from 'src/app/theme/shared/service/ptlaplicaciones.service';
import { PTLAplicacionModel } from 'src/app/theme/shared/_helpers/models/PTLAplicacion.model';
import { BehaviorSubject, catchError, combineLatest, map, Observable, startWith, switchMap, tap } from 'rxjs';
import { PtlSuitesAPService } from 'src/app/theme/shared/service/ptlsuites-ap.service';
import { NavBarComponent } from 'src/app/theme/layout/admin/nav-bar/nav-bar.component';
import { NavContentComponent } from 'src/app/theme/layout/admin/navigation/nav-content/nav-content.component';
import { NavigationService } from 'src/app/theme/shared/service/navigation.service';
import { DatatableComponent } from 'src/app/theme/shared/components/data-table/data-table.component';
import { of, Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { ColumnMetadata } from 'src/app/theme/shared/_helpers/models/ColumnMetadata.model';
import { NavigationItem } from 'src/app/theme/shared/_helpers/models/Navigation.model';
import { BaseSessionModel } from 'src/app/theme/shared/_helpers/models/BaseSession.model';
import { PTLLogActividadAPModel } from 'src/app/theme/shared/_helpers/models/PTLlogActividadAP.model';
import { PtllogActividadesService, SwalAlertService } from 'src/app/theme/shared/service';
//#endregion IMPORTS

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [CommonModule, SharedModule, TranslateModule, NavBarComponent, NavContentComponent, DatatableComponent],
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.scss'
})
export class RolesComponent implements OnInit {
  //#region VARIABLES
  @Output() toggleSidebar = new EventEmitter<void>();
  DataModel: BaseSessionModel = new BaseSessionModel();
  DataLogActividad: PTLLogActividadAPModel = new PTLLogActividadAPModel();
  moduloTituloExcel: string = '';
  hasFiltersSlot: boolean = false;
  gradientConfig;
  lang = localStorage.getItem('lang');
  menuItems$!: Observable<NavigationItem[]>;
  activeTab: 'menu' | 'filters' | 'main' = 'menu';

  tituloPagina: string = '';
  suitesSub?: Subscription;
  suites: any[] = [];
  aplicaciones: PTLAplicacionModel[] = [];

  subscriptions = new Subscription();
  filtroCodigoRoleSubject = new BehaviorSubject<string>('todos');
  filtroCodigoAplicacionSubject = new BehaviorSubject<string>('todos');
  filtroNombreSubject = new BehaviorSubject<string>('todos');
  filtroDescripcionSubject = new BehaviorSubject<string>('');
  filtroEstadoSubject = new BehaviorSubject<string>('todos');

  registrosTransformados$: Observable<PTLRoleAPModel[]> = of([]);
  registrosFiltrado$: Observable<PTLRoleAPModel[]> = of([]);
  registros: PTLRoleAPModel[] = [];
  //#endregion VARIABLES

  constructor(
    private router: Router,
    private translate: TranslateService,
    private _navigationService: NavigationService,
    private _aplicacionesService: PtlAplicacionesService,
    private _suitesService: PtlSuitesAPService,
    private _rolesAPService: PTLRolesAPService,
    private _logActividadesService: PtllogActividadesService,
    private _swalService: SwalAlertService,
    private _languageService: LanguageService
  ) {
    this.gradientConfig = GradientConfig;
  }

  ngOnInit() {
    this._navigationService.getNavigationItems();
    this.menuItems$ = this._navigationService.menuItems$;
    this.hasFiltersSlot = true;
    this.consultarAplicaciones();
    this.setupRolesStream();
    this.subscriptions.add(
      this._rolesAPService.cargarRegistros().subscribe(
        () => console.log('Roles cargados y guardados en el servicio'),
        (err) => console.error('Error al cargar roles:', err)
      )
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  consultarAplicaciones() {
    this.subscriptions.add(
      this._aplicacionesService.getAplicaciones().subscribe((resp: any) => {
        if (resp.ok) {
          this.aplicaciones = resp.aplicaciones;
          console.log('Todos las aplicaciones', this.aplicaciones);
          return;
        }
      })
    );
  }

  columnasRegistros: ColumnMetadata[] = [
    {
      name: 'nombreAplicacion',
      header: 'ROLES.NOMBREAPLICACION',
      type: 'text'
    },
    {
      name: 'nombreSuite',
      header: 'ROLES.NOMBRESUITE',
      type: 'text'
    },
    {
      name: 'nombreRole',
      header: 'ROLES.NOMBREROL',
      type: 'text'
    },
    {
      name: 'nomEstado',
      header: 'ROLES.ESTADOROLE',
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

  setupRolesStream(): void {
    this.registrosTransformados$ = this._rolesAPService.roles$.pipe(
      switchMap((roles: PTLRoleAPModel[]) => {
        if (!roles) return of([]);
        const transformedApps = roles.map((role: any) => {
          role.nomEstado = role.estadoAplicacion ? 'Activo' : 'Inactivo';
          return role as PTLRoleAPModel;
        });
        this.registros = transformedApps;
        return of(transformedApps);
      }),
      catchError((err) => {
        console.error('Error en el stream de aplicaciones:', err);
        return of([]);
      })
    );

    this.registrosFiltrado$ = combineLatest([
      this.registrosTransformados$.pipe(startWith([])), // Usa la fuente de datos transformada
      this.filtroCodigoRoleSubject,
      this.filtroCodigoAplicacionSubject,
      this.filtroNombreSubject,
      this.filtroDescripcionSubject,
      this.filtroEstadoSubject
    ]).pipe(
      map(([roles, codigorol, codigoapp, nombre, descripcion, estado]) => {
        let filteredRegistros = roles;
        if (codigorol !== 'todos') {
          filteredRegistros = filteredRegistros.filter((reg) => reg.codigoRole === codigorol);
        }
        if (codigoapp !== 'todos') {
          filteredRegistros = filteredRegistros.filter((reg) => reg.codigoAplicacion === codigoapp);
        }
        if (nombre !== 'todos') {
          filteredRegistros = filteredRegistros.filter((reg) => reg.nombreRole === nombre);
        }
        if (estado !== 'todos') {
          const estadoBoolean = estado === 'true';
          filteredRegistros = filteredRegistros.filter((reg) => reg.estadoRole === estadoBoolean);
        }
        if (descripcion) {
          const textoFiltro = descripcion.toLowerCase();
          filteredRegistros = filteredRegistros.filter((app) => (app.descripcionRole || '').toLowerCase().includes(textoFiltro));
        }
        return filteredRegistros;
      })
    );
  }

  consultarSuites() {
    this.suitesSub = this._suitesService
      .geSuitesAP()
      .pipe(
        tap((resp: any) => {
          if (resp.ok) {
            this.suites = resp.suites;
            console.log('Todos las suites', this.suites);
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

  onFiltroCodigoAplicacionChangeClick(evento: any): void {
    const value = evento.target.value;
    this.filtroCodigoAplicacionSubject.next(value);
  }

  onFiltroCodigoRoleChangeClick(evento: any): void {
    const value = evento.target.value;
    this.filtroCodigoRoleSubject.next(value);
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

  OnNuevoRegistroClick() {
    this.router.navigate(['aplicaciones/gestion-roles']);
  }

  OnEditarRegistroClick(id: number) {
    this.router.navigate(['aplicaciones/gestion-roles'], { queryParams: { regId: id } });
  }

  OnEliminarRegistroClick(id: string) {
    const nombre = this.registros.filter((x) => x.codigoRole == id)[0];
    Swal.fire({
      title: this.translate.instant('ROLES.ELIMINARTITULO'),
      text: this.translate.instant('ROLES.ELIMINARTEXTO') + `"${nombre.nombreRole}".!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: this.translate.instant('PLATAFORMA.DELETE'),
      cancelButtonText: this.translate.instant('PLATAFORMA.CANCEL')
    }).then((result: any) => {
      if (result.isConfirmed) {
        this._rolesAPService.deleteEliminarRegistro(id).subscribe({
          next: (resp: any) => {
            const logData = {
              codigoTipoLog: '',
              codigoRespuesta: '201',
              descripcionLog: this.translate.instant('ROLES.ELIMINAREXITOSA') + ' ' + resp.mensaje
            };
            this._logActividadesService.postCrearRegistro(logData).subscribe(() => console.log('log creado exitosamente'));
            this._swalService.getAlertSuccess(this.translate.instant('ROLES.ELIMINAREXITOSA') + ' ' + resp.mensaje);
          },
          error: (err: any) => {
            const logData = {
              codigoTipoLog: '',
              codigoRespuesta: '201',
              descripcionLog: this.translate.instant('ROLES.ELIMINARERROR') + ' ' + err.mensaje
            };
            this._logActividadesService.postCrearRegistro(logData).subscribe(() => console.log('log creado exitosamente'));
            this._swalService.getAlertSuccess(this.translate.instant('ROLES.ELIMINARERROR') + ' ' + err.mensaje);
            console.error('Error eliminando', err);
          }
        });
      }
    });
  }

  toggleNav(): void {
    this.toggleSidebar.emit();
  }
}
