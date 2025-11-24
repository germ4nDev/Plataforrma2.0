import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { ThemeStorageService } from './theme/shared/service/theme-storage.service';
import {
  AuthenticationService,
  LocalStorageService,
  PtlAplicacionesService,
  PtlEmpresasScService,
  PTLRolesAPService,
  PTLSuscriptoresService,
  PtlusuariosEmpresasScService,
  PtlusuariosRolesApService,
  PtlusuariosScService
} from './theme/shared/service';
import { PtlactividadesService } from './theme/shared/service/ptlactividades.service';
import { PtlactividadesRolesService } from './theme/shared/service/ptlactividades-roles.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(
    private router: Router,
    private themeStorage: ThemeStorageService,
    private _authenticationService: AuthenticationService,
    private _localStorageService: LocalStorageService,
    private _actividadesService: PtlactividadesService,
    private _actividadesRolesService: PtlactividadesRolesService,
    private _aplicacionesService: PtlAplicacionesService,
    private _usuariosRolesService: PtlusuariosRolesApService,
    private _usuariosSCService: PtlusuariosScService,
    private _usuariosEmpresasService: PtlusuariosEmpresasScService,
    private _empresasSCService: PtlEmpresasScService,
    private _suscriptoresService: PTLSuscriptoresService,
    private _rolesAPService: PTLRolesAPService
  ) {}

  ngOnInit() {
    this.router.events.subscribe((evt) => {
      if (evt instanceof NavigationEnd) {
        window.scrollTo(0, 0);
      }
    });
    const token = this._localStorageService.getTokenLocalStorage();
    if (token) {
      console.log('AppComponent: Token detectado en carga, iniciando carga de datos...');
      this.loadProtectedData();
    } else {this.router.navigate(['autenticacion/login']);}
    this._authenticationService.isLoggedIn$.subscribe((isLoggedIn) => {
      if (isLoggedIn) {
        console.log('AppComponent: Notificación de Login exitoso recibida, iniciando carga de datos...');
        this.loadProtectedData();
      }
    });
  }

  private loadProtectedData(): void {
    this._actividadesService.cargarRegistros().subscribe(
      () => console.log('** Actividades cargadas y guardadas en el servicio'),
      (err) => console.error('Error al cargar roles:', err)
    );
    this._actividadesRolesService.cargarRegistros().subscribe(
      () => console.log('** Actividades Roles cargadas y guardadas en el servicio'),
      (err) => console.error('Error al cargar roles:', err)
    );
    this._aplicacionesService.cargarAplicaciones().subscribe(
      () => console.log('** Aplicaciones cargadas y guardadas en el servicio'),
      (err) => console.error('Error al cargar aplicaciones:', err)
    );
    this._rolesAPService.cargarRegistros().subscribe(
      () => console.log('** Roles cargadas y guardadas en el servicio'),
      (err) => console.error('Error al cargar roles:', err)
    );
    this._usuariosRolesService.cargarRegistros().subscribe(
      () => console.log('** Usuarios Roles cargadas y guardadas en el servicio'),
      (err) => console.error('Error al cargar roles:', err)
    );
    this._suscriptoresService.getRegistros().subscribe(
      () => console.log('** Suscriptores cargadas y guardadas en el servicio'),
      (err) => console.error('Error al cargar Suscriptores:', err)
    );
    this._empresasSCService.cargarRegistros().subscribe(
      () => console.log('** EmpresasSC cargadas y guardadas en el servicio'),
      (err) => console.error('Error al cargar EmpresasSC:', err)
    );
    this._usuariosSCService.cargarRegistros().subscribe(
      () => console.log('** UsuariosSC cargadas y guardadas en el servicio'),
      (err) => console.error('Error al cargar UsuariosSC:', err)
    );
    this._usuariosEmpresasService.cargarRegistros().subscribe(
      () => console.log('** UsuariosEmpresasSC cargadas y guardadas en el servicio'),
      (err) => console.error('Error al cargar UsuariosEmpresasSC:', err)
    );
  }
}
