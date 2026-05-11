/* eslint-disable @typescript-eslint/no-explicit-any */
// Angular import
import { Component, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule, Router, ActivatedRoute } from '@angular/router'
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms'
import { TranslateModule, TranslateService } from '@ngx-translate/core'
import { catchError, tap } from 'rxjs/operators'
import { SharedModule } from 'src/app/theme/shared/shared.module'
import { LanguageSelectorComponent } from 'src/app/theme/shared/components/language-selector/language-selector.component'
import { FullScreenSliderComponent } from 'src/app/theme/shared/components/fullscreen-slider/fullscreen-slider.component'
import { PTLSuscriptorModel } from 'src/app/theme/shared/_helpers/models/PTLSuscriptor.model'
import { PTLUsuarioSCModel } from 'src/app/theme/shared/_helpers/models/PTLUsuarioSC.model'
import { PTLEmpresaSCModel } from 'src/app/theme/shared/_helpers/models/PTLEmpresaSC.model'
import { PTLUsuarioModel } from 'src/app/theme/shared/_helpers/models/PTLUsuario.model'
import { of, Subscription } from 'rxjs'
// import Swal from 'sweetalert2';
import {
    AuthenticationService,
    LanguageService,
    LocalStorageService,
    PtlactividadesRolesService,
    PtlActividadesService,
    PtlAplicacionesService,
    PtlEmpresasScService,
    PTLRolesAPService,
    PtlSuitesAPService,
    PTLSuscriptoresService,
    PtlusuariosEmpresasScService,
    PtlusuariosRolesApService,
    PtlusuariosScService,
    //   LocalStorageService,
    //   PtlEmpresasScService,
    //   PTLSuscriptoresService,
    //   PtlusuariosScService,
    //   PTLUsuariosService,
    SwalAlertService,
    ThemeService
} from 'src/app/theme/shared/service'
import { SocialNetworksComponent } from 'src/app/theme/shared/components/social-networks/social-networks.component'
import { PTLIdioma } from 'src/app/theme/shared/_helpers/models/PTLIdioma.model'
import { PTLAplicacionModel } from 'src/app/theme/shared/_helpers/models/PTLAplicacion.model'
import { PTLSuiteAPModel } from 'src/app/theme/shared/_helpers/models/PTLSuiteAP.model'
import { PTLUsuaioEmpresasSCModel } from 'src/app/theme/shared/_helpers/models/PTLUsuarioEmpresaSC.model'
import { PTLUsuarioRoleAPModel } from 'src/app/theme/shared/_helpers/models/PTLUsuarioRole.model'
import { PTLRoleAPModel } from 'src/app/theme/shared/_helpers/models/PTLRoleAP.model'
import { PTLActividadModel } from '../../../theme/shared/_helpers/models/PTLActividades.model';
import { PTLActividadRoleModel } from 'src/app/theme/shared/_helpers/models/PTLActividadesRoles.model'

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        LanguageSelectorComponent,
        SharedModule,
        TranslateModule,
        FullScreenSliderComponent,
        SocialNetworksComponent
    ],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
    //#region VARIABLES
    classList!: { toggle: (arg0: string) => void }
    registrosSub?: Subscription
    registros: PTLSuscriptorModel[] = []
    usuariosSCSub?: Subscription
    usuariosSC: PTLUsuarioSCModel[] = []
    usuariosSub?: Subscription
    usuarios: PTLUsuarioModel[] = []
    empresasSCSub?: Subscription
    empresasSC: PTLEmpresaSCModel[] = []

    userRoles: any[] = []
    todosLosRoles: any[] = []
    tipoRolSeleccionado: string = ''
    rolesAsignadosAlUsuario: any[] = []
    actividades: PTLActividadModel[] = []
    actividadesRoles: PTLActividadRoleModel[] = []
    aplicaciones: PTLAplicacionModel[] = []
    aplicacionesSub?: Subscription
    suitesSub?: Subscription
    suites: PTLSuiteAPModel[] = []
    suscriptores: PTLSuscriptorModel[] = []
    suitesApp: PTLSuiteAPModel[] = []
    empresaSC: PTLEmpresaSCModel[] = []
    empresaSCFiltradas: PTLEmpresaSCModel[] = []
    usuariosRoles: PTLUsuarioRoleAPModel[] = []
    mostrarSeleccionRoles: boolean = false
    usuarioEmpresaSC: PTLUsuaioEmpresasSCModel[] = []
    roles: PTLRoleAPModel[] = []

    loginForm!: FormGroup
    loginSub?: Subscription
    usernameValue: string = ''
    userPassword: string = ''
    returnUrl!: string
    error: string = ''
    loading: boolean = false
    submitted: boolean = false
    remember: boolean = false
    idiomas: PTLIdioma[] = []
    //#endregion VARIABLES

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private translate: TranslateService,
        private _localstorageService: LocalStorageService,
        private _swalService: SwalAlertService,
        private _themeService: ThemeService,
        private _actividadesRolesService: PtlactividadesRolesService,
        private _actividadesService: PtlActividadesService,
        private _aplicacionesService: PtlAplicacionesService,
        private _suitesService: PtlSuitesAPService,
        private _suscriptoresService: PTLSuscriptoresService,
        private _localStorageService: LocalStorageService,
        private _usuariosRolesService: PtlusuariosRolesApService,
        private _usuariosSCService: PtlusuariosScService,
        private _empresasSCService: PtlEmpresasScService,
        private _usuariosEmpresasSCService: PtlusuariosEmpresasScService,
        private _rolesService: PTLRolesAPService,
        private _rolesUsuariosService: PtlusuariosRolesApService,

        private _languagesService: LanguageService,
        private _authenticationService: AuthenticationService
    ) {
        this.translate.use(localStorage.getItem('lang') || 'es')
        if (this._authenticationService.currentUserValue) {
            //    this.router.navigate(['/dashboard/analytics']);
        }
    }

    ngOnInit() {
        this.loginForm = this.formBuilder.group({
            username: ['', Validators.required],
            password: ['', Validators.required]
        })
        this.actividades = this._actividadesService.getActividadesActuales()
        this.actividadesRoles = this._actividadesRolesService.getActividadesRolesActuales()
        this.suites = this._suitesService.getSuitesActuales()
        this.aplicaciones = this._aplicacionesService.getBAplicacionesActuales()
        this.suscriptores = this._suscriptoresService.getSuscriptoresActuales()
        this.usuariosSC = this._usuariosSCService.getUsuariosSCActuales()
        this.empresaSC = this._empresasSCService.getEmpresasSCActuales()
        this.usuariosRoles = this._rolesUsuariosService.getUsuairosRolesActuales()
        this.usuariosSC = this._usuariosSCService.getUsuariosSCActuales()
        this.usuarioEmpresaSC = this._usuariosEmpresasSCService.getUsuariosEmpresasSCActuales()
        this.suscriptores = this._suscriptoresService.getSuscriptoresActuales()
        const togglePassword = document.querySelector('#togglePassword')
        const password = document.querySelector('#password')
        togglePassword?.addEventListener('click', () => {
            const type = password?.getAttribute('type') === 'password' ? 'text' : 'password'
            password?.setAttribute('type', type)
            this.classList.toggle('icon-eye-off')
        })
        this.returnUrl = this.route.snapshot.queryParams['returnUrl']
        this.idiomas = this._languagesService.getRegistrosActuales()
        console.log('idiomas actualoes', this.idiomas)
    }

    OnDestroy() {
        this.loginSub?.unsubscribe()
    }

    get formValues() {
        return this.loginForm.controls
    }

    get usernameControl() {
        return this.loginForm.get('username')
    }

    get passwordControl() {
        return this.loginForm.get('password')
    }

    consultarRolesActividadesUsuario(codUsuario: string) {
        let rolesUsuarioFinal: any[] = []
        const usuarioSC = this.usuariosSC.filter(ru => ru.codigoUsuario == codUsuario && ru.estadoUsuarioSC == true)[0]
        const suscriptor = this.suscriptores.filter(ru => ru.codigoSuscriptor === usuarioSC.codigoSuscriptor && ru.estadoSuscriptor == true)[0]
        const empresasSC = this.empresasSC.filter(ru => ru.codigoSuscriptor == suscriptor.codigoSuscriptor && ru.estadoEmpresa == true)
        const usuariosEmpresaSC = this.usuarioEmpresaSC.filter(ru => ru.codigoUsuarioSC == usuarioSC.codigoUsuarioSC && ru.estadoUsuarioEmpresaSC == true)
        let rolesUsuario: PTLUsuarioRoleAPModel[] = []
        let actividadesUsuario: any[] = []
        usuariosEmpresaSC.forEach(usuEmp => {
            const roles = this.usuariosRoles.filter(ue => ue.codigoUsuarioEmpresaSC === usuEmp.codigoUsuarioEmpresaSC && ue.estadoUsuarioRole == true)
            roles.forEach(role => {
                const activisRole = this.actividadesRoles.filter(x => x.codigoRole == role.codigoRole)
                const emp = empresasSC.filter(x => x.codigoEmpresaSC == usuEmp.codigoEmpresaSC)[0]
                const actisRoles = {
                    empresa: emp.codigoEmpresaSC,
                    role: role.codigoRole,
                    actividades: activisRole
                }
                actividadesUsuario.push(actisRoles)
                role.codigoEmpresaSC = emp.codigoEmpresaSC
            });
            rolesUsuario.push(...roles)
        });
        rolesUsuarioFinal = rolesUsuario.map(ru => {
            const role = this.roles.find(r => r.codigoRole === ru.codigoRole && r.estadoRole == true)
            const suite = this.suites.find(s => s.codigoSuite === ru?.codigoSuite)
            const aplicacion = this.aplicaciones.find(a => a.codigoAplicacion === ru?.codigoAplicacion)
            const empresa = empresasSC.find(a => a.codigoEmpresaSC === ru.codigoEmpresaSC)
            return {
                suscriptor: suscriptor ? suscriptor.nombreSuscriptor : 'Sin Suscriptor',
                empresa: empresa ? empresa.nombreEmpresa : 'Sin Empresa',
                aplicacion: aplicacion ? aplicacion.nombreAplicacion : 'Sin Aplicación',
                suite: suite ? suite.nombreSuite : 'Sin Suite',
                role: role ? role.nombreRole : 'Rol Desconocido'
            }
        })
        console.log('actividadesUsuario', actividadesUsuario);
        console.log('rolesUsuario', rolesUsuarioFinal);
        return rolesUsuarioFinal
    }

    onLoginUserClick(): void {
        this.submitted = true
        if (this.loginForm.invalid) {
            return
        }
        this.error = ''
        this.loading = true
        const userName = this.formValues?.['username']?.value
        const password = this.formValues?.['password']?.value
        this.loginSub = this._authenticationService
            .login(userName, password)
            .pipe(
                tap((resp: any) => {
                    this.loading = false
                    console.log('resp login', resp)
                    if (!resp.ok) {
                        this._localstorageService.setTokenLocalStorage(resp.token)
                        this._swalService.getAlertError(this.translate.instant('PLATAFORMA.USERNOTFOUND'))
                        return
                    }
                    this.consultarRolesActividadesUsuario(resp.usuario.codigoUsuario)
                    const currentUser = this._localstorageService.getCurrentUserLocalStorage()
                    console.log('++++++++ usuario activo', currentUser)
                    if (currentUser === null) {
                        console.log('el usuario no tiene roles asignados')
                        this._swalService.getAlertError(this.translate.instant('PLATAFORMA.NOROLESASIGN'))
                        this._localstorageService.setLogOut()
                    } else {
                        this.router.navigate(['/starter/inicio-aplicaciones'])
                        //   this.router.navigate(['/aplicaciones/aplicaciones']);
                    }

                    console.log('Login exitoso:', resp.usuario.codigoUsuario)
                    //   const logData = {
                    //     codigoTipoLog: '',
                    //     codigoRespuesta: '201',
                    //     descripcionLog: this.translate.instant('PLATAFORMA.LOGINSUCCESS')
                    //   };
                    //   this._logActividadesService.postCrearRegistro(logData).subscribe(() => console.log('log creado exitosamente'));
                    //   this._swalService.getAlertSuccess(this.translate.instant('PLATAFORMA.LOGINSUCCESS'));
                    //   this._localStorageService.setSuscriptorLocalStorage(dataSuscriptor);
                }),
                catchError(err => {
                    this.loading = false
                    this.error = err
                    //   const logData = {
                    //     codigoTipoLog: '',
                    //     codigoRespuesta: '501',
                    //     codigoUsuairo: userName,
                    //     descripcionLog: this.translate.instant('PLATAFORMA.LOGINFAILED')
                    //   };
                    //   this._logActividadesService.postCrearRegistro(logData).subscribe(() => console.log('log creado exitosamente'));
                    this._swalService.getAlertError(this.translate.instant('PLATAFORMA.LOGINFAILED'))
                    return of(null)
                })
            )
            .subscribe()
        //   }
        // } else {
        //   const logData = {
        //     codigoTipoLog: '',
        //     codigoRespuesta: '501',
        //     descripcionLog: this.translate.instant('PLATAFORMA.USERNOTSUPSCRIPTOR')
        //   };
        //   this._logActividadesService.postCrearRegistro(logData).subscribe(() => console.log('log creado exitosamente'));
        //   this._swalService.getAlertError(this.translate.instant('PLATAFORMA.USERNOTSUPSCRIPTOR'));
        // }
    }

    onChangePasswordClick() {
        this.router.navigate(['/autenticacion/change-password'])
    }


    onResetPasswordClick() {
        this.router.navigate(['/autenticacion/reset-password'])
    }

    toggleTheme() {
        this._themeService.toggleDarkTheme()
    }
}
