/* eslint-disable @angular-eslint/use-lifecycle-interface */
/* eslint-disable @typescript-eslint/no-explicit-any */
//#region IMPORTS
import { Component, EventEmitter, OnInit, Output } from '@angular/core'
import { CommonModule } from '@angular/common'
import { DataTablesModule } from 'angular-datatables'
import { Router } from '@angular/router'
import { GradientConfig } from 'src/app/app-config'
import { SharedModule } from 'src/app/theme/shared/shared.module'
import { TranslateModule } from '@ngx-translate/core'
import { TranslateService } from '@ngx-translate/core'
import { ColumnMetadata } from 'src/app/theme/shared/_helpers/models/ColumnMetadata.model'
import { NavigationItem } from 'src/app/theme/shared/_helpers/models/Navigation.model'
import { BaseSessionModel } from 'src/app/theme/shared/_helpers/models/BaseSession.model'
import { PTLLogActividadAPModel } from 'src/app/theme/shared/_helpers/models/PTLlogActividadAP.model'
import { PTLUsuarioModel } from 'src/app/theme/shared/_helpers/models/PTLUsuario.model'
import { BehaviorSubject, catchError, combineLatest, filter, map, Observable, startWith, switchMap } from 'rxjs'
import { NavBarComponent } from 'src/app/theme/layout/admin/nav-bar/nav-bar.component'
import { NavContentComponent } from 'src/app/theme/layout/admin/navigation/nav-content/nav-content.component'
import {
    NavigationService,
    SwalAlertService,
    UploadFilesService,
    PTLUsuariosService,
    LocalStorageService,
    PtlAplicacionesService,
    PtlSuitesAPService,
    PtlusuariosRolesApService,
    PTLRolesAPService,
    PtlusuariosScService,
    PTLSuscriptoresService,
    PtlEmpresasScService,
    PtlusuariosEmpresasScService
} from 'src/app/theme/shared/service'
import { DatatableComponent } from 'src/app/theme/shared/components/data-table/data-table.component'
import { of, Subscription } from 'rxjs'
import { DataLoaderComponent } from 'src/app/theme/shared/components/data-loader/data-loader.component'
import { PTLAplicacionModel } from 'src/app/theme/shared/_helpers/models/PTLAplicacion.model'
import { PTLSuiteAPModel } from 'src/app/theme/shared/_helpers/models/PTLSuiteAP.model'
import { PTLUsuarioRoleAPModel } from 'src/app/theme/shared/_helpers/models/PTLUsuarioRole.model'
import { PTLRoleAPModel } from 'src/app/theme/shared/_helpers/models/PTLRoleAP.model'
import { PTLUsuarioSCModel } from 'src/app/theme/shared/_helpers/models/PTLUsuarioSC.model'
import { PTLSuscriptorModel } from 'src/app/theme/shared/_helpers/models/PTLSuscriptor.model'
import { PTLEmpresaSCModel } from 'src/app/theme/shared/_helpers/models/PTLEmpresaSC.model'
import { PTLUsuaioEmpresasSCModel } from 'src/app/theme/shared/_helpers/models/PTLUsuarioEmpresaSC.model'
//#endregion IMPORTS

@Component({
    selector: 'app-usuarios',
    standalone: true,
    imports: [
        CommonModule,
        DataTablesModule,
        SharedModule,
        TranslateModule,
        NavBarComponent,
        NavContentComponent,
        DatatableComponent,
        DataLoaderComponent
    ],
    templateUrl: './usuarios.component.html',
    styleUrl: './usuarios.component.scss'
})
export class UsuariosComponent implements OnInit {
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
    suscPlataforma: string = ''

    subscriptions = new Subscription()
    filtroIdentificacionSubject = new BehaviorSubject<string>('')
    filtroNombreSubject = new BehaviorSubject<string>('')
    filtroCorreoSubject = new BehaviorSubject<string>('')
    filtroUsernameSubject = new BehaviorSubject<string>('')
    filtroDescripcionSubject = new BehaviorSubject<string>('')
    filtroEstadoSubject = new BehaviorSubject<string>('todos')

    registrosTransformados$: Observable<PTLUsuarioModel[]> = of([])
    registrosFiltrado$: Observable<PTLUsuarioModel[]> = of([])
    usuarios: PTLUsuarioModel[] = []
    registros: PTLUsuarioModel[] = []
    aplicaciones: PTLAplicacionModel[] = []
    suites: PTLSuiteAPModel[] = []
    usuariosRoles: PTLUsuarioRoleAPModel[] = []
    empresasSC: PTLEmpresaSCModel[] = []
    roles: PTLRoleAPModel[] = []
    usuariosSC: PTLUsuarioSCModel[] = []
    suscriptores: PTLSuscriptorModel[] = []
    usuarioEmpresaSC: PTLUsuaioEmpresasSCModel[] = []

    rolesUsuario = [
        {
            aplicacion: 'Plataforma',
            suite: 'Administracion',
            role: 'ROLE_USUARIO'
        },
        {
            aplicacion: 'Plataforma',
            suite: 'Administracion',
            role: 'ROLE_ADMINISTRADOR'
        },
        {
            aplicacion: 'Qplus',
            suite: 'Sistemas de Gestion',
            role: 'ROLE_ADMINSOCUMENTOS'
        }
    ]
    //#endregion VARIABLES

    constructor(
        private router: Router,
        private translate: TranslateService,
        private _navigationService: NavigationService,
        private _swalService: SwalAlertService,
        private _usuariosService: PTLUsuariosService,
        private _aplicacionesService: PtlAplicacionesService,
        private _rolesUsuariosService: PtlusuariosRolesApService,
        private _rolesService: PTLRolesAPService,
        private _suitesService: PtlSuitesAPService,
        private _usuariosSCService: PtlusuariosScService,
        private _suscriptoresService: PTLSuscriptoresService,
        private _empresasSCService: PtlEmpresasScService,
        private _usuariosEmpresasSCService: PtlusuariosEmpresasScService,
        private _localStorageService: LocalStorageService,
        private _uploadService: UploadFilesService
    ) {
        this.gradientConfig = GradientConfig
    }

    ngOnInit() {
        this._navigationService.getNavigationItems()
        this.menuItems$ = this._navigationService.menuItems$
        this.hasFiltersSlot = true
        this.consultarRegistros()
        setTimeout(() => {
            this.aplicaciones = this._aplicacionesService.getBAplicacionesActuales()
            this.suites = this._suitesService.getSuitesActuales()
            this.roles = this._rolesService.getRolesActuales()
            this.usuariosRoles = this._rolesUsuariosService.getUsuairosRolesActuales()
            this.usuariosSC = this._usuariosSCService.getUsuariosSCActuales()
            this.suscriptores = this._suscriptoresService.getSuscriptoresActuales()
            this.empresasSC = this._empresasSCService.getEmpresasSCActuales()
            this.usuarioEmpresaSC = this._usuariosEmpresasSCService.getUsuariosEmpresasSCActuales()
            console.log('aplicaciones', this.aplicaciones)
            console.log('suites', this.suites)
            console.log('roles', this.roles)
            console.log('usuariosRoles', this.usuariosRoles)
            console.log('usuariosSC', this.usuariosSC)
            console.log('suscriptores', this.suscriptores)
            console.log('empresasSC', this.empresasSC)
            this.setupRegistrosStream()
        }, 100)
        this.subscriptions.add(
            this._usuariosService.cargarRegistros().subscribe(
                () => console.log('Usuarios cargados y guardados en el servicio'),
                err => console.error('Error al cargar usuarios:', err)
            )
        )
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe()
    }

    columnasUsuarios: ColumnMetadata[] = [
        {
            name: 'fotoUsuario',
            header: 'USUARIOS.USUARIOS.FOTO',
            type: 'avatar',
            isSortable: false
        },
        {
            name: 'identificacionUsuario',
            header: 'USUARIOS.USUARIOS.IDENTIFICACION',
            type: 'text'
        },
        {
            name: 'nombreUsuario',
            header: 'USUARIOS.USUARIOS.NAME',
            type: 'text'
        },
        {
            name: 'userNameUsuario',
            header: 'USUARIOS.USUARIOS.USERNAME',
            type: 'text'
        },
        {
            name: 'nomEstado',
            header: 'USUARIOS.USUARIOS.STATUS',
            type: 'estado'
        }
    ]

    columnasDetailRegistros: ColumnMetadata[] = [
        {
            name: 'correoUsuario',
            header: 'USUARIOS.USUARIOS.CORREO',
            type: 'text'
        },
        {
            name: 'descripcionUsuario',
            header: 'USUARIOS.USUARIOS.DESCRIPCION',
            type: 'text'
        },
        {
            name: 'rolesUsuario',
            header: 'USUARIOS.USUARIOS.ROLES',
            type: 'json-tabla'
        }
        return filteredRegistros
      })
    )
  }

  OnNuevoRegistroClick () {
    this.router.navigate(['usuarios/gestion-usuario'])
  }

  OnEditarRegistroClick (id: number) {
    this.router.navigate(['usuarios/gestion-usuario'], { queryParams: { regId: id } })
  }

  OnEliminarRegistroClick (id: any) {
    const usuario = this.usuarios.filter(x => x.codigoUsuario == id.id)[0]
    const titulo = this.translate.instant('USUARIOS.USUARIOS.ELIMINARTITULO');
    const confirmText = this.translate.instant('PLATAFORMA.DELETE');
    const cancelText = this.translate.instant('PLATAFORMA.CANCEL');
    const htmlBody = `
        <div style="margin-bottom: 10px;">
            ${this.translate.instant('USUARIOS.USUARIOS.ELIMINARTEXTO')}
        </div>
        <small><b>"${usuario?.nombreUsuario}"</b></small>
    `;
    this._swalService.getAlertConfirmDelete(titulo, htmlBody, confirmText, cancelText)
        .then((confirmado) => {
            if (confirmado) {
                this._usuariosService.eliminarUsuairo(id.id).subscribe({
                    next: (resp: any) => {
                        this._swalService.getAlertSuccess(this.translate.instant('USUARIOS.USUARIOS.ELIMINAREXITOSA') + ', ' + resp.mensaje)
                        this.subscriptions.add(
                            this._usuariosService.cargarRegistros().subscribe(
                                () => console.log('Usuarios cargados y guardados en el servicio'),
                                err => console.error('Error al cargar usuarios:', err)
                            )
                        )
                    },
                    error: (err: any) => {
                        this._swalService.getAlertError(this.translate.instant('USUARIOS.USUARIOS.ELIMINARERROR') + ', ' + err)
                        console.error('Error eliminando', err)
                    }
                })
            }
        })
}

  onFiltroIdentificacionChangeClick (evento: any) {
    const value = evento.target.value
    this.filtroIdentificacionSubject.next(value)
  }

  onFiltroNombreChangeClick (evento: any) {
    const value = evento.target.value
    this.filtroNombreSubject.next(value)
  }

  onFiltroCorreoChangeClick (evento: any) {
    const value = evento.target.value
    this.filtroCorreoSubject.next(value)
  }

  onFiltroUsernameChangeClick (evento: any) {
    const value = evento.target.value
    this.filtroUsernameSubject.next(value)
  }

  onFiltroDescripcionChangeClick (evento: any) {
    const value = evento.target.value
    this.filtroDescripcionSubject.next(value)
  }

  onFiltroEstadoChangeClick (evento: any) {
    const value = evento.target.value
    this.filtroEstadoSubject.next(value)
  }

  toggleNav (): void {
    this.toggleSidebar.emit()
  }
}
