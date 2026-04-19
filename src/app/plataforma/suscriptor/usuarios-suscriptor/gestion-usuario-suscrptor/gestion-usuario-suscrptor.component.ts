/* eslint-disable @angular-eslint/use-lifecycle-interface */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, EventEmitter, OnInit, Output } from '@angular/core'
import { CommonModule } from '@angular/common'
import { SharedModule } from 'src/app/theme/shared/shared.module'
import { ActivatedRoute, Router } from '@angular/router'
import { PtlAplicacionesService } from 'src/app/theme/shared/service/ptlaplicaciones.service'
import { catchError, Observable, of, Subscription, tap } from 'rxjs'
import { PTLAplicacionModel } from 'src/app/theme/shared/_helpers/models/PTLAplicacion.model'
import { TranslateModule, TranslateService } from '@ngx-translate/core'
import { GradientConfig } from 'src/app/app-config'
import { NavBarComponent } from 'src/app/theme/layout/admin/nav-bar/nav-bar.component'
import { NavContentComponent } from 'src/app/theme/layout/admin/navigation/nav-content/nav-content.component'
import { LayoutInitializerService } from 'src/app/theme/shared/service/layout-initializer.service'
import { NavigationService } from 'src/app/theme/shared/service/navigation.service'
import { v4 as uuidv4 } from 'uuid'
import { PtlSuitesAPService } from 'src/app/theme/shared/service/ptlsuites-ap.service'
import { PTLSuiteAPModel } from 'src/app/theme/shared/_helpers/models/PTLSuiteAP.model'
import { PtlmodulosApService } from 'src/app/theme/shared/service/ptlmodulos-ap.service'
import { PTLModuloAP } from 'src/app/theme/shared/_helpers/models/PTLModuloAP.model'
import { TextEditorComponent } from 'src/app/theme/shared/components/text-editor/text-editor.component'
import {
  LocalStorageService,
  PtlEmpresasScService,
  PtllogActividadesService,
  PtlusuariosEmpresasScService,
  SwalAlertService
} from 'src/app/theme/shared/service'
import { NavigationItem } from 'src/app/theme/shared/_helpers/models/Navigation.model'
import { PTLUsuarioModel } from 'src/app/theme/shared/_helpers/models/PTLUsuario.model'
import { PTLSuscriptorModel } from 'src/app/theme/shared/_helpers/models/PTLSuscriptor.model'
import { PTLUsuarioSCModel } from 'src/app/theme/shared/_helpers/models/PTLUsuarioSC.model'
import { PTLSuscriptoresService, PtlusuariosScService } from 'src/app/theme/shared/service'
import { PTLUsuariosService } from 'src/app/theme/shared/service/ptlusuarios.service'
import { PTLEmpresaSCModel } from 'src/app/theme/shared/_helpers/models/PTLEmpresaSC.model'
import { PTLUsuaioEmpresasSCModel } from 'src/app/theme/shared/_helpers/models/PTLUsuarioEmpresaSC.model'

@Component({
  selector: 'app-gestion-usuario-suscrptor',
  standalone: true,
  imports: [CommonModule, SharedModule, TranslateModule, NavBarComponent, NavContentComponent, TextEditorComponent],
  templateUrl: './gestion-usuario-suscrptor.component.html',
  styleUrl: './gestion-usuario-suscrptor.component.scss'
})
export class GestionUsuarioSuscrptorComponent {
  // #region VARIABLES
  @Output() toggleSidebar = new EventEmitter<void>()
  FormRegistro: PTLUsuarioSCModel = new PTLUsuarioSCModel()
  menuItems$!: Observable<NavigationItem[]>
  gradientConfig: any
  navCollapsed: boolean = false
  navCollapsedMob: boolean = false
  windowWidth: number = 0
  form: undefined
  isSubmit: boolean
  modoEdicion: boolean = false
  aplicacionesSub?: Subscription
  aplicaciones: PTLAplicacionModel[] = []
  suitesSub?: Subscription
  modulosSub?: Subscription
  suites: PTLSuiteAPModel[] = []
  empresasSC: PTLEmpresaSCModel[] = []
  usuariosEmpresasSC: PTLUsuaioEmpresasSCModel[] = []
  empresasSCSeleccionadas: PTLEmpresaSCModel[] = []

  codigoUsuarioSC = uuidv4()
  tipoEditorTexto = 'basica'
  lockScreenSubscription: Subscription | undefined
  isLocked: boolean = false
  lockMessage: string = ''

  suscriptores: PTLSuscriptorModel[] = []
  usuariosSC: PTLUsuarioSCModel[] = []
  usuarios: PTLUsuarioModel[] = []
  subscriptions = new Subscription()

  // #endregion VARIABLES

  // constructor
  constructor (
    private router: Router,
    private route: ActivatedRoute,
    private translate: TranslateService,
    private _empresasSCService: PtlEmpresasScService,
    private _usuariosEmpresasService: PtlusuariosEmpresasScService,
    private _registrosService: PTLUsuariosService,
    private _layoutInitializer: LayoutInitializerService,
    private _logActividadesService: PtllogActividadesService,
    private _swalAlertService: SwalAlertService,
    private _localStorageService: LocalStorageService,
    private _usuariosService: PTLUsuariosService,
    private _usuariosSCService: PtlusuariosScService,
    private _suscriptoresService: PTLSuscriptoresService,
    private _navigationService: NavigationService
  ) {
    this.isSubmit = false
    GradientConfig.header_fixed_layout = true
    this.gradientConfig = GradientConfig
    this.navCollapsed = this.windowWidth >= 992 ? GradientConfig.isCollapse_menu : false
    this.navCollapsedMob = false
    this.codigoUsuarioSC = this._localStorageService.getObject<string>('regId') || ''
    console.log('codigoUsuarioSC', this.codigoUsuarioSC)
    if (this.codigoUsuarioSC != 'nuevo') {
      this.modoEdicion = true
      this._usuariosSCService.getUsuarioById(this.codigoUsuarioSC).subscribe({
        next: (resp: any) => {
          this.FormRegistro = resp.usuarioSC
          console.log('formRegistro modulo', this.FormRegistro)
          this.consultarSuscriptores(this.FormRegistro.codigoSuscriptor)
          this.consultarEmpresasSC(this.FormRegistro.codigoSuscriptor)
          this.consultarUsuarios(this.FormRegistro.codigoUsuario)
        },
        error: () => {
          this._swalAlertService.getAlertError('No se pudo obtener el modulo.')
        }
      })
    } else {
      this.modoEdicion = false
      this.FormRegistro.codigoUsuarioSC = uuidv4()
    }
    this.route.queryParams.subscribe(params => {})
  }

  ngOnInit () {
    this._navigationService.getNavigationItems()
    this.menuItems$ = this._navigationService.menuItems$
    this.consultarUsuarios()
    this.consultarSuscriptores()
    this._layoutInitializer.applyLayout()
    // TODO Replicar en todos los modulos de gestion de datos
    this.lockScreenSubscription = this._navigationService.lockScreenEvent$.subscribe({
      next: (message: string) => {
        this._localStorageService.setFormRegistro(this.FormRegistro)
        this.isLocked = true
        this.lockMessage = message
      },
      error: err => console.error('Error al suscribirse al evento de bloqueo:', err)
    })
    const form = this._localStorageService.getFormRegistro()
    if (form != undefined) {
      this.FormRegistro = form
      this._localStorageService.removeFormRegistro()
    }
    if (!this.modoEdicion) {
      console.log('modo edicion', this.modoEdicion)
      console.log('FormRegistro', this.FormRegistro)
      //   this.FormRegistro.codigoAplicacion = ''
      //   this.FormRegistro.codigoSuite = ''
      //   this.FormRegistro.codigoPadre = ''
      this.FormRegistro.codigoUsuarioSC = uuidv4()
      // this.FormRegistro.codigoModulo = uuidv4();
    }
  }

  consultarUsuarios (codUsuario?: string) {
    this.subscriptions.add(
      this._usuariosService.getUsuarios().subscribe((resp: any) => {
        if (resp.ok) {
          this.usuarios = resp.usuarios
          console.log('Todos las usuarios', this.usuarios)
          return
        }
      })
    )
  }

  consultarSuscriptores (codSuscriptor?: string) {
    this.subscriptions.add(
      this._suscriptoresService.getRegistros().subscribe((resp: any) => {
        if (resp.ok) {
          this.suscriptores = resp.suscriptores
          console.log('Todos las suscriptores', this.suscriptores)
          return
        }
      })
    )
  }

  consultarEmpresasSC (codSuscriptor?: string) {
    this.subscriptions.add(
      this._empresasSCService.cargarRegistros().subscribe((resp: any) => {
        if (resp.ok) {
          this.empresasSC = resp.empresasSC.filter((x: { codigoSuscriptor: string | undefined }) => x.codigoSuscriptor == codSuscriptor)
          console.log('Todos las empresasSC', this.empresasSC)
          return
        }
      })
    )
  }

  onSuscriptorChangeClick (event: any) {
    const value = event.target.value
    this.consultarEmpresasSC(value)
    const susc = this.suscriptores.filter(x => x.codigoSuscriptor == value)[0]
    // this.FormRegistro.codigoAplicacion = app.codigoAplicacion || ''
    // this.consultarSuites(app.codigoAplicacion)
  }

  onUsuarioChangeClick (event: any) {
    const value = event.target.value
    const usua = this.usuarios.filter(x => x.codigoUsuario == value)[0]
    // this.FormRegistro.codigoAplicacion = app.codigoAplicacion || ''
    // this.consultarSuites(app.codigoAplicacion)
  }

  onEmpresasSCClickChange (event: any, empresa: PTLEmpresaSCModel) {
    const value = event.target.value
    const empre = this.empresasSC.filter(x => x.codigoEmpresaSC == value)[0]
    this.empresasSCSeleccionadas.push(empre)
    // this.FormRegistro.codigoAplicacion = app.codigoAplicacion || ''
    // this.consultarSuites(app.codigoAplicacion)
  }

  btnGestionarRegistroClick (form: any) {
    this.isSubmit = true
    // if (!form.valid) {
    //   return;
    // }
    const registroData = form.value as PTLUsuarioSCModel
    console.log('insertar formRegistro', registroData)
    this.onGestionarUsuarioEmpresa(this.FormRegistro.codigoUsuario || '')
    if (this.modoEdicion) {
      registroData.codigoUsuarioCreacion = this.FormRegistro.codigoUsuarioCreacion
      registroData.fechaCreacion = this.FormRegistro.fechaCreacion
      registroData.codigoUsuarioModificacion = this._localStorageService.getUsuarioLocalStorage().codigoUsuario
      registroData.fechaModificacion = new Date().toISOString()
      this._usuariosSCService.actualizarUsuario(registroData).subscribe({
        next: (resp: any) => {
          if (resp.ok) {
            const logData = {
              codigoTipoLog: '',
              codigoRespuesta: '201',
              descripcionLog: this.translate.instant('PLATAFORMA.MODIFICAR')
            }
            this._logActividadesService.postCrearRegistro(logData).subscribe(() => console.log('log creado exitosamente'))
            this._swalAlertService.getAlertSuccess(this.translate.instant('PLATAFORMA.MODIFICAR'))
            this.router.navigate(['/suscriptores/usuarios-suscriptor'])
          } else {
            const logData = {
              codigoTipoLog: '',
              codigoRespuesta: '501',
              descripcionLog: this.translate.instant('PLATAFORMA.NOMODIFICO')
            }
            this._logActividadesService.postCrearRegistro(logData).subscribe(() => console.log('log creado exitosamente'))
            this._swalAlertService.getAlertError(resp.message || this.translate.instant('PLATAFORMA.NOMODIFICO'))
          }
        },
        error: (err: any) => {
          console.error(err)
          const logData = {
            codigoTipoLog: '',
            codigoRespuesta: '501',
            descripcionLog: this.translate.instant('PLATAFORMA.NOMODIFICO') + ', ' + err.message
          }
          this._logActividadesService.postCrearRegistro(logData).subscribe(() => console.log('log creado exitosamente'))
          this._swalAlertService.getAlertError(this.translate.instant('PLATAFORMA.NOMODIFICO'))
        }
      })
    } else {
      registroData.codigoUsuarioSC = uuidv4()
      registroData.codigoUsuarioCreacion = this._localStorageService.getUsuarioLocalStorage().codigoUsuario
      registroData.fechaCreacion = new Date().toISOString()
      registroData.codigoUsuarioModificacion = ''
      registroData.fechaModificacion = ''
      console.log('insertar registro', registroData)
      this._usuariosSCService.crearUsuario(registroData).subscribe({
        next: (resp: any) => {
          console.log('reesp', resp.modulo)
          if (resp.ok) {
            const logData = {
              codigoTipoLog: '',
              codigoRespuesta: '201',
              descripcionLog: this.translate.instant('PLATAFORMA.INSERTAR')
            }
            this._logActividadesService.postCrearRegistro(logData).subscribe(() => console.log('log creado exitosamente'))
            this._swalAlertService.getAlertSuccess(this.translate.instant('PLATAFORMA.INSERTAR'))
            form.resetForm()
            this.isSubmit = false
            this.router.navigate(['/suscriptores/usuarios-suscriptor'])
          }
        },
        error: (err: any) => {
          console.error(err)
          const logData = {
            codigoTipoLog: '',
            codigoRespuesta: '501',
            descripcionLog: this.translate.instant('PLATAFORMA.NOINSERTO') + ', ' + err.message
          }
          this._logActividadesService.postCrearRegistro(logData).subscribe(() => console.log('log creado exitosamente'))
          this._swalAlertService.getAlertError(this.translate.instant('PLATAFORMA.NOINSERTO') + ', ' + err)
        }
      })
    }
  }

  onGestionarUsuarioEmpresa (codigoUsuario: string) {
    this.empresasSC.forEach(emp => {
      if (emp.checked === false) {
        const existe = this.usuariosEmpresasSC.find(
          (sel: any) => sel.codigoUsuario == codigoUsuario && sel.codigoEmpresaSC == emp.codigoEmpresaSC
        )
        if (existe) {
          const reg = this.usuariosEmpresasSC.filter(
            (sel: any) => sel.codigoUsuario == codigoUsuario && sel.codigoEmpresaSC == emp.codigoEmpresaSC
          )[0]
          const regCodigo = reg.codigoUsuarioEmpresaSC || ''
          this._usuariosEmpresasService
            .deleteEliminarRegistro(regCodigo)
            .subscribe((data: any) => console.log('usuarios empresa eliminado con exito' + reg))
        }
      }
    })

    if (this.empresasSCSeleccionadas.length > 0) {
      this.empresasSCSeleccionadas.forEach((empre: any) => {
        const existe = this.usuariosEmpresasSC.find(
          (sel: any) => sel.codigoUsuario == codigoUsuario && sel.codigoEmpresaSC == empre.codigoEmpresaSC
        )
        console.log('existe', existe)
        if (!existe) {
          const usuEmpresa: PTLUsuaioEmpresasSCModel = {
            codigoUsuarioEmpresaSC: uuidv4(),
            codigoEmpresaSC: empre.codigoEmpresaSC,
            codigoUsuarioSC: codigoUsuario,
            estadoUsuarioEmpresaSC: true,
            codigoUsuarioCreacion: this._localStorageService.getUsuarioLocalStorage().codigoUsuario,
            fechaCreacion: new Date().toISOString(),
            codigoUsuarioModificacion: '',
            fechaModificacion: ''
          }
          this._usuariosEmpresasService
            .postCrearRegistro(usuEmpresa)
            .subscribe((data: any) => console.log('usuarios empresa creado con exito' + usuEmpresa))
        }
      })
    }
  }

  btnRegresarClick () {
    this.router.navigate(['/suscriptores/usuarios-suscriptor'])
  }

  toggleNav (): void {
    this.toggleSidebar.emit()
  }
}
