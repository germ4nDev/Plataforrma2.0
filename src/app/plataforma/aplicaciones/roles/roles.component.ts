/* eslint-disable @angular-eslint/use-lifecycle-interface */
/* eslint-disable @typescript-eslint/no-explicit-any */
//#region IMPORTS
import { Component, EventEmitter, OnInit, Output } from '@angular/core'
import { CommonModule } from '@angular/common'
import { GradientConfig } from 'src/app/app-config'
import { Router } from '@angular/router'
import { BehaviorSubject, catchError, combineLatest, map, Observable, startWith, switchMap } from 'rxjs'
import { SharedModule } from 'src/app/theme/shared/shared.module'
import { TranslateModule } from '@ngx-translate/core'
import { TranslateService } from '@ngx-translate/core'
import { NavBarComponent } from 'src/app/theme/layout/admin/nav-bar/nav-bar.component'
import { NavContentComponent } from 'src/app/theme/layout/admin/navigation/nav-content/nav-content.component'
import { DatatableComponent } from 'src/app/theme/shared/components/data-table/data-table.component'
import { PTLRoleAPModel } from 'src/app/theme/shared/_helpers/models/PTLRoleAP.model'
import { ColumnMetadata } from 'src/app/theme/shared/_helpers/models/ColumnMetadata.model'
import { PTLLogActividadAPModel } from 'src/app/theme/shared/_helpers/models/PTLlogActividadAP.model'
import { NavigationItem } from 'src/app/theme/shared/_helpers/models/Navigation.model'
import { BaseSessionModel } from 'src/app/theme/shared/_helpers/models/BaseSession.model'
import { PTLAplicacionModel } from 'src/app/theme/shared/_helpers/models/PTLAplicacion.model'
import { NavigationService, PtlAplicacionesService, LanguageService } from 'src/app/theme/shared/service'
import { of, Subscription } from 'rxjs'
import Swal from 'sweetalert2'
import { PtllogActividadesService, PTLRolesAPService, SwalAlertService } from 'src/app/theme/shared/service'
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
  @Output() toggleSidebar = new EventEmitter<void>()
  DataModel: BaseSessionModel = new BaseSessionModel()
  DataLogActividad: PTLLogActividadAPModel = new PTLLogActividadAPModel()
  moduloTituloExcel: string = ''
  hasFiltersSlot: boolean = false
  gradientConfig
  lang = localStorage.getItem('lang')
  menuItems$!: Observable<NavigationItem[]>
  activeTab: 'menu' | 'filters' | 'main' = 'menu'
  tituloPagina: string = ''

  subscriptions = new Subscription()
  filtroCodigoRoleSubject = new BehaviorSubject<string>('todos')
  filtroCodigoAplicacionSubject = new BehaviorSubject<string>('todos')
  filtroNombreSubject = new BehaviorSubject<string>('todos')
  filtroDescripcionSubject = new BehaviorSubject<string>('')
  filtroEstadoSubject = new BehaviorSubject<string>('todos')

  registrosTransformados$: Observable<PTLRoleAPModel[]> = of([])
  registrosFiltrado$: Observable<PTLRoleAPModel[]> = of([])
  roles: PTLRoleAPModel[] = []
  registros: PTLRoleAPModel[] = []
  aplicaciones: PTLAplicacionModel[] = []
  //#endregion VARIABLES

  constructor (
    private router: Router,
    private translate: TranslateService,
    private _navigationService: NavigationService,
    private _aplicacionesService: PtlAplicacionesService,
    private _rolesAPService: PTLRolesAPService,
    private _logActividadesService: PtllogActividadesService,
    private _swalService: SwalAlertService,
    private _languageService: LanguageService
  ) {
    this.gradientConfig = GradientConfig
  }

  ngOnInit () {
    this._navigationService.getNavigationItems()
    this.menuItems$ = this._navigationService.menuItems$
    this.hasFiltersSlot = true
    this.consultarAplicaciones()
    setTimeout(() => {
      this.setupRolesStream()
    }, 100)
    this.subscriptions.add(
      this._rolesAPService.cargarRegistros().subscribe(
        () => console.log('Roles cargados y guardados en el servicio'),
        err => console.error('Error al cargar roles:', err)
      )
    )
  }

  ngOnDestroy (): void {
    this.subscriptions.unsubscribe()
  }

  consultarAplicaciones () {
    this.subscriptions.add(
      this._aplicacionesService.getAplicaciones().subscribe((resp: any) => {
        if (resp.ok) {
          this.aplicaciones = resp.aplicaciones
          console.log('Todos las aplicaciones', this.aplicaciones)
          return
        }
      })
    )
  }

  columnasRegistros: ColumnMetadata[] = [
    {
      name: 'nombreRole',
      header: 'ROLES.NOMBREROL',
      type: 'text'
    },
    {
      name: 'nomAplicacion',
      header: 'ROLES.NOMBREAPLICACION',
      type: 'text'
    },
    {
      name: 'nomEstado',
      header: 'ROLES.ESTADOROLE',
      type: 'text'
    }
  ]

  columnasDetailRegistros: ColumnMetadata[] = [
    {
      name: 'codigoRole',
      header: 'ROLES.CODE',
      type: 'text'
    },
    {
      name: 'descripcionRole',
      header: 'ROLES.DESCRIPTION',
      type: 'text'
    }
  ]

  setupRolesStream (): void {
    this.registrosTransformados$ = this._rolesAPService.roles$.pipe(
      switchMap((roles: PTLRoleAPModel[]) => {
        console.log('================== roles 1', roles)
        if (!roles) return of([])
        this.roles = roles
        const transformedApps = roles.map((role: any) => {
          role.nomEstado = role.estadoAplicacion ? 'Activo' : 'Inactivo'
          role.nomAplicacion = this.aplicaciones.filter(x => x.codigoAplicacion == role.codigoAplicacion)[0].nombreAplicacion || ''
          return role as PTLRoleAPModel
        })
        this.registros = transformedApps
        return of(transformedApps)
      }),
      catchError(err => {
        console.error('Error en el stream de aplicaciones:', err)
        return of([])
      })
    )

    this.registrosFiltrado$ = combineLatest([
      this.registrosTransformados$.pipe(startWith([])), // Usa la fuente de datos transformada
      this.filtroCodigoRoleSubject,
      this.filtroCodigoAplicacionSubject,
      this.filtroNombreSubject,
      this.filtroDescripcionSubject,
      this.filtroEstadoSubject
    ]).pipe(
      map(([roles, codigorol, codigoapp, nombre, descripcion, estado]) => {
        console.log('================== roles 2', roles)

        let filteredRegistros = roles
        if (codigorol !== 'todos') {
          filteredRegistros = filteredRegistros.filter(reg => reg.codigoRole === codigorol)
        }
        if (codigoapp !== 'todos') {
          filteredRegistros = filteredRegistros.filter(reg => reg.codigoAplicacion === codigoapp)
        }
        if (nombre !== 'todos') {
          filteredRegistros = filteredRegistros.filter(reg => reg.nombreRole === nombre)
        }
        if (estado !== 'todos') {
          const estadoBoolean = estado === 'true'
          filteredRegistros = filteredRegistros.filter(reg => reg.estadoRole === estadoBoolean)
        }
        if (descripcion) {
          const textoFiltro = descripcion.toLowerCase()
          filteredRegistros = filteredRegistros.filter(app => (app.descripcionRole || '').toLowerCase().includes(textoFiltro))
        }
        return filteredRegistros
      })
    )
  }

  onFiltroCodigoAplicacionChangeClick (evento: any): void {
    const value = evento.target.value
    this.filtroCodigoAplicacionSubject.next(value)
  }

  onFiltroCodigoRoleChangeClick (evento: any): void {
    const value = evento.target.value
    this.filtroCodigoRoleSubject.next(value)
  }

  onFiltroNombreChangeClick (evento: any): void {
    const value = evento.target.value
    this.filtroNombreSubject.next(value)
  }

  onFiltroDescripcionChangeClick (evento: any): void {
    const value = evento.target.value
    this.filtroDescripcionSubject.next(value)
  }

  onFiltroEstadoChangeClick (evento: any): void {
    const value = evento.target.value
    this.filtroEstadoSubject.next(value)
  }

  OnNuevoRegistroClick () {
    this.router.navigate(['aplicaciones/gestion-roles'])
  }

  OnEditarRegistroClick (id: number) {
    this.router.navigate(['aplicaciones/gestion-roles'], { queryParams: { regId: id } })
  }

  OnEliminarRegistroClick (id: any) {
    console.log('Eliminar registro', id.id)
    const nombre = this.registros.filter(x => x.codigoRole == id.id)[0]
    Swal.fire({
      title: this.translate.instant('ROLES.ELIMINARTITULO'),
      text: this.translate.instant('ROLES.ELIMINARTEXTO') + `"${nombre.nombreRole}".!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: this.translate.instant('PLATAFORMA.DELETE'),
      cancelButtonText: this.translate.instant('PLATAFORMA.CANCEL')
    }).then((result: any) => {
      if (result.isConfirmed) {
        this._rolesAPService.deleteEliminarRegistro(id.id).subscribe({
          next: (resp: any) => {
            const logData = {
              codigoTipoLog: '',
              codigoRespuesta: '201',
              descripcionLog: this.translate.instant('ROLES.ELIMINAREXITOSA') + ' ' + resp.mensaje
            }
            this._logActividadesService.postCrearRegistro(logData).subscribe(() => console.log('log creado exitosamente'))
            this._swalService.getAlertSuccess(this.translate.instant('ROLES.ELIMINAREXITOSA') + ' ' + resp.mensaje)
          },
          error: (err: any) => {
            const logData = {
              codigoTipoLog: '',
              codigoRespuesta: '201',
              descripcionLog: this.translate.instant('ROLES.ELIMINARERROR') + ' ' + err.mensaje
            }
            this._logActividadesService.postCrearRegistro(logData).subscribe(() => console.log('log creado exitosamente'))
            this._swalService.getAlertSuccess(this.translate.instant('ROLES.ELIMINARERROR') + ' ' + err.mensaje)
            this.setupRolesStream()
            console.error('Error eliminando', err)
          }
        })
      }
    })
  }

  toggleNav (): void {
    this.toggleSidebar.emit()
  }
}
