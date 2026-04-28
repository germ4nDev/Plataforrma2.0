import { Component, OnInit } from '@angular/core'
import { NavigationEnd, Router } from '@angular/router'
import {
  AuthenticationService,
  LocalStorageService,
  PtlAplicacionesService,
  PtlBibliotecasService,
  PtlEmpresasScService,
  PtlformatosGaleriaService,
  PtlGaleriasService,
  PtlmodulosApService,
  PTLRolesAPService,
  PtlSuitesAPService,
  PTLSuscriptoresService,
  PtlTiposGaleriaService,
  PtlusuariosEmpresasScService,
  PtlusuariosRolesApService,
  PtlusuariosScService,
  ThemeService
} from './theme/shared/service'
import { PtlActividadesService } from './theme/shared/service/ptlactividades.service'
import { PtlactividadesRolesService } from './theme/shared/service/ptlactividades-roles.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor (
    private router: Router,
    private themeService: ThemeService,
    private _authenticationService: AuthenticationService,
    private _localStorageService: LocalStorageService,
    private _actividadesService: PtlActividadesService,
    private _actividadesRolesService: PtlactividadesRolesService,
    private _aplicacionesService: PtlAplicacionesService,
    private _modulosService: PtlmodulosApService,
    private _suitesService: PtlSuitesAPService,
    private _usuariosRolesService: PtlusuariosRolesApService,
    private _usuariosSCService: PtlusuariosScService,
    private _usuariosEmpresasService: PtlusuariosEmpresasScService,
    private _bibliotecasService: PtlBibliotecasService,
    private _galeriasService: PtlGaleriasService,
    private _formatosGaleriaService: PtlformatosGaleriaService,
    private _tiposGaleriaService: PtlTiposGaleriaService,
    private _empresasSCService: PtlEmpresasScService,
    private _suscriptoresService: PTLSuscriptoresService,
    private _rolesAPService: PTLRolesAPService
  ) {}

  ngOnInit () {
    this.router.events.subscribe(evt => {
      if (evt instanceof NavigationEnd) {
        window.scrollTo(0, 0)
      }
    })
    const themeSettings = this._localStorageService.getThemeSettings()
    if (themeSettings) {
      this.themeService.setDarkTheme(themeSettings.isDarkTheme)
    }
    const token = this._localStorageService.getTokenLocalStorage()
    if (token) {
      console.log('AppComponent: Token detectado en carga, iniciando carga de datos...')
      this.loadProtectedData()
    } else {
      this.router.navigate(['autenticacion/login'])
    }
    this._authenticationService.isLoggedIn$.subscribe(isLoggedIn => {
      if (isLoggedIn) {
        console.log('AppComponent: Notificación de Login exitoso recibida, iniciando carga de datos...')
        this.loadProtectedData()
      }
    })
  }

  private loadProtectedData (): void {
    this._actividadesService.cargarRegistros().subscribe(
      () => console.log('** Actividades cargadas y guardadas en el servicio'),
      err => console.error('Error al cargar roles:', err)
    )
    this._actividadesRolesService.cargarRegistros().subscribe(
      () => console.log('** Actividades Roles cargadas y guardadas en el servicio'),
      err => console.error('Error al cargar roles:', err)
    )
    this._aplicacionesService.cargarAplicaciones().subscribe(
      () => console.log('** Aplicaciones cargadas y guardadas en el servicio'),
      err => console.error('Error al cargar aplicaciones:', err)
    )
    this._modulosService.cargarRegistros().subscribe(
      () => console.log('** Modulos cargadas y guardadas en el servicio'),
      err => console.error('Error al cargar modulos:', err)
    )
    this._suitesService.cargarRegistros().subscribe(
      () => console.log('** Suites cargadas y guardadas en el servicio'),
      err => console.error('Error al cargar suites:', err)
    )
    this._rolesAPService.cargarRegistros().subscribe(
      () => console.log('** Roles cargadas y guardadas en el servicio'),
      err => console.error('Error al cargar roles:', err)
    )
    this._usuariosRolesService.cargarRegistros().subscribe(
      () => console.log('** Usuarios Roles cargadas y guardadas en el servicio'),
      err => console.error('Error al cargar roles:', err)
    )
    this._suscriptoresService.getRegistros().subscribe(
      () => console.log('** Suscriptores cargadas y guardadas en el servicio'),
      err => console.error('Error al cargar Suscriptores:', err)
    )
    this._empresasSCService.cargarRegistros().subscribe(
      () => console.log('** EmpresasSC cargadas y guardadas en el servicio'),
      err => console.error('Error al cargar EmpresasSC:', err)
    )
    this._usuariosSCService.cargarRegistros().subscribe(
      () => console.log('** UsuariosSC cargadas y guardadas en el servicio'),
      err => console.error('Error al cargar UsuariosSC:', err)
    )
    this._usuariosEmpresasService.cargarRegistros().subscribe(
      () => console.log('** UsuariosEmpresasSC cargadas y guardadas en el servicio'),
      err => console.error('Error al cargar UsuariosEmpresasSC:', err)
    )
    this._bibliotecasService.cargarBibliotecas().subscribe(
      () => console.log('** bibliotecas cargadas y guardadas en el servicio'),
      err => console.error('Error al cargar bibliotecas:', err)
    )
    this._galeriasService.cargarGaleria().subscribe(
      () => console.log('** galerias cargadas y guardadas en el servicio'),
      err => console.error('Error al cargar galerias:', err)
    )
    this._formatosGaleriaService.cargarFormatosGaleria().subscribe(
      () => console.log('** formatosGaleria cargadas y guardadas en el servicio'),
      err => console.error('Error al cargar formatosGaleria:', err)
    )
    this._tiposGaleriaService.cargarTiposGaleria().subscribe(
      () => console.log('** tiposGaleria cargadas y guardadas en el servicio'),
      err => console.error('Error al cargar tiposGaleria:', err)
    )
  }
}
