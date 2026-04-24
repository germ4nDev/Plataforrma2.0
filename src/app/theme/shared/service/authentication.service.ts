/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, Subscription, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { PTLUsuarioModel } from '../_helpers/models/PTLUsuario.model';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { LocalStorageService } from './local-storage.service';
import { CurrentUserModel } from '../_helpers/models/CurrentUser.model';
import { PtlusuariosRolesApService } from './ptlusuarios-roles-ap.service';
import { PTLRolesAPService } from './ptlroles-ap.service';
import { PTLRoleAPModel } from '../_helpers/models/PTLRoleAP.model';
import { PtlEmpresasScService } from './ptlempresas-sc.service';
import { PTLEmpresaSCModel } from '../_helpers/models/PTLEmpresaSC.model';
import { PtlusuariosScService } from './ptlusuarios-sc.service';
import { PtlusuariosEmpresasScService } from './ptlusuarios-empresas-sc.service';
import { PTLUsuaioEmpresasSCModel } from '../_helpers/models/PTLUsuarioEmpresaSC.model';
import { PTLUsuarioSCModel } from '../_helpers/models/PTLUsuarioSC.model';
import { PTLSuscriptorModel } from '../_helpers/models/PTLSuscriptor.model';
import { PTLSuscriptoresService } from './ptlsuscriptores.service';
import { PTLUsuarioRoleAPModel } from '../_helpers/models/PTLUsuarioRole.model';
import { PtlActividadesService } from './ptlactividades.service';
import { PtlactividadesRolesService } from './ptlactividades-roles.service';
import { PTLActividadModel } from '../_helpers/models/PTLActividades.model';
import { PTLActividadRoleModel } from '../_helpers/models/PTLActividadesRoles.model';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  // eslint-disable-next-line
  private currentUserSubject: BehaviorSubject<PTLUsuarioModel | any>;
  public currentUser: Observable<PTLUsuarioModel>;

  // === PROPIEDAD REQUERIDA POR EL AUTH GUARD (MODIFICACIÓN CLAVE 1) ===
  // Subject para indicar que la verificación inicial del token ha terminado.
  private initializedSubject = new BehaviorSubject<boolean>(false);
  // Observable público que el AuthGuard usa para esperar.
  public isAuthInitialized$ = this.initializedSubject.asObservable();

  // === MODIFICACIÓN CLAVE 2: Comprobación del token movida al constructor/inicio ===
  // El hasToken se llama dentro de initializeAuth para asegurar el flujo asíncrono.
  private loggedInSubject = new BehaviorSubject<boolean>(false);
  public isLoggedIn$ = this.loggedInSubject.asObservable();

  isValid: boolean = false;
  roles: PTLRoleAPModel[] = [];
  usuariosRoles: PTLUsuarioRoleAPModel[] = [];
  emrpesasSC: PTLEmpresaSCModel[] = [];
  usuariosSC: PTLUsuarioSCModel[] = [];
  usuariosEmpresas: PTLUsuaioEmpresasSCModel[] = [];
  suscriptores: PTLSuscriptorModel[] = [];
  usuariosRolesSub: Subscription | undefined;
  rolesSubscription: Subscription | undefined;
  empresasSCSubscription: Subscription | undefined;
  usuariosSCSubscription: Subscription | undefined;
  usuariosEmpresasSCSubscription: Subscription | undefined;
  suscriptorSubscription: Subscription | undefined;

  constructor(
    private router: Router,
    private http: HttpClient,
    private _localstorageService: LocalStorageService,
    private _suscriptoresService: PTLSuscriptoresService,
    private _usuariosSCService: PtlusuariosScService,
    private _usuariosEmpresasSCService: PtlusuariosEmpresasScService,
    private _empresasSCService: PtlEmpresasScService,
    private _rolesService: PTLRolesAPService,
    private _usuarioRolesService: PtlusuariosRolesApService
  ) {
    // eslint-disable-next-line
    console.log('************ SERVICIO DE AUTENTICACION ACTIVO');
    this.currentUserSubject = new BehaviorSubject(this._localstorageService.getCurrentUserLocalStorage());
    this.currentUser = this.currentUserSubject.asObservable();

    // === MODIFICACIÓN CLAVE 3: Iniciar la lógica de comprobación de autenticación ===
    this.initializeAuth();
  }

  /**
   * Lógica de inicialización: Comprueba si existe un token válido al cargar la app.
   * Esto se ejecuta inmediatamente después del constructor.
   */
  private initializeAuth(): void {
    // Ejecuta la comprobación del token.
    const isLoggedIn = this.hasToken();

    // Emite el estado de login basado en el token encontrado/validado.
    this.loggedInSubject.next(isLoggedIn);

    // IMPORTANTE: Marca el servicio como inicializado. Esto desbloquea el AuthGuard.
    this.initializedSubject.next(true);

    console.log('AuthService: Inicialización completada. Usuario logueado:', isLoggedIn);
  }

  private hasToken(): boolean {
    // Utiliza el mismo método de hasToken que ya tenías
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    return !!(currentUser && currentUser.token && !this.isTokenExpired(currentUser.token));
  }

  public get currentUserValue() {
    return this.currentUserSubject.value;
  }

  public getToken(): string | null {
    return this.currentUserValue?.token || null;
  }

  // --- El resto de tus métodos (consultarRoles, login, logout, etc.) siguen igual ---

  consultarRoles() {
    console.log('acaaaaaaaaa');
    this.rolesSubscription = this._rolesService.roles$.subscribe({
      next: (roles: PTLRoleAPModel[]) => {
        console.log('Roles de usuario cargados con éxito:', roles.length);
        this.roles = roles;
        this.consultarUsuariosRoles();
        console.log('Roles de usuario:', roles);
      },
      error: (err) => {
        console.error('Error al cargar los roles de usuario:', err);
        this.roles = [];
      }
    });
  }

  consultarActividades() {
    console.log('actividades');
    // this.actividadesSub = this._actividadesService.actividades$.subscribe({
    //   next: (actividades: PTLActividadModel[]) => {
    //     console.log('Roles de usuario cargados con éxito:', actividades.length);
    //     this.actividades = actividades;
    //     console.log('Roles de usuario:', actividades);
    //   },
    //   error: (err) => {
    //     console.error('Error al cargar los actividades de usuario:', err);
    //     this.roles = [];
    //   }
    // });
  }

  consultarActividadesRoles(codRole: string) {
    console.log('actividades Role');
    // this.actividadesRolesSub = this._actividadesRolesService.actividadesRoles$.subscribe({
    //   next: (actividades: PTLActividadRoleModel[]) => {
    //     console.log('ActividadRole de usuario cargados con éxito:', actividades.length);
    //     const actsRole = actividades.filter(x => x.codigoRole === codRole);
    //     this.actividadesRoles = actsRole.filter(x => x.permiso === true);;
    //     console.log('Roles de usuario:', actividades);
    //   },
    //   error: (err) => {
    //     console.error('Error al cargar los actividades de usuario:', err);
    //     this.roles = [];
    //   }
    // });
  }

  consultarUsuariosRoles() {
    console.log('acaaaaaaaaa');
    this.usuariosRolesSub = this._usuarioRolesService._usuariosRoles$.subscribe({
      next: (userRoles: PTLUsuarioRoleAPModel[]) => {
        console.log('usuarios roles cargados con éxito:', userRoles.length);
        this.usuariosRoles = userRoles;
        this.consultarUsuariosSC();
        console.log('usuarios roles:', userRoles);
      },
      error: (err) => {
        console.error('Error al cargar los roles de usuario:', err);
        this.usuariosRoles = [];
      }
    });
  }

  consultarUsuariosSC() {
    console.log('&&&&&&&& usuariosSC');
    this.usuariosSCSubscription = this._usuariosSCService._usuariosSC$.subscribe({
      next: (usuariosSC: PTLUsuarioSCModel[]) => {
        console.log('usuariosSC cargadas con éxito:', usuariosSC.length);
        this.usuariosSC = usuariosSC;
        this.consultarSuscriptores();
        this.consultarEmpresasSC();
        console.log('usuariosSC:', usuariosSC);
      },
      error: (err) => {
        console.error('Error al cargar los roles de usuariosSC:', err);
        this.usuariosSC = [];
      }
    });
  }

  consultarSuscriptores() {
    console.log('acaaaaaaaaa');
    this.suscriptorSubscription = this._suscriptoresService._suscriptores.subscribe({
      next: (suscriptores: PTLSuscriptorModel[]) => {
        console.log('suscriptores cargadas con éxito:', suscriptores.length);
        this.suscriptores = suscriptores;
        this.consultarEmpresasSC();
        console.log('usuarios roles:', suscriptores);
      },
      error: (err) => {
        console.error('Error al cargar los roles de usuario:', err);
        this.suscriptores = [];
      }
    });
  }

  consultarEmpresasSC() {
    console.log('acaaaaaaaaa');
    this.empresasSCSubscription = this._empresasSCService.empresasSC$.subscribe({
      next: (empresasSC: PTLEmpresaSCModel[]) => {
        console.log('empresasSC cargadas con éxito:', empresasSC.length);
        this.emrpesasSC = empresasSC;
        console.log('EmpresasSC:', empresasSC);
        this.consultarUsuariosEmpresasSC();
      },
      error: (err) => {
        console.error('Error al cargar los roles de usuario:', err);
        this.emrpesasSC = [];
      }
    });
  }

  consultarUsuariosEmpresasSC() {
    console.log('acaaaaaaaaa');
    this.usuariosEmpresasSCSubscription = this._usuariosEmpresasSCService._usuariosEmpresas$.subscribe({
      next: (usuariosEmpresas: PTLUsuarioSCModel[]) => {
        console.log('usuariosEmpresas cargadas con éxito:', usuariosEmpresas.length);
        this.usuariosEmpresas = usuariosEmpresas;
        console.log('usuarios roles:', usuariosEmpresas);
      },
      error: (err) => {
        console.error('Error al cargar los roles de usuario:', err);
        this.usuariosEmpresas = [];
      }
    });
  }

  login(username: string, password: string): Observable<CurrentUserModel> {
    return this.http.post<CurrentUserModel>(`${environment.apiUrl}/auth`, { username, password }).pipe(
      tap((user) => {
        if (!user) {
          throw new Error('Usuario no válido');
        }
        this.setSession(user);
      }),
      catchError((error: HttpErrorResponse) => {
        const errorMessage = error.error?.msg || 'Error en la autenticación';
        return throwError(() => errorMessage);
      })
    );
  }

  verificarClaveActual(username: string, password: string) {
    return this.http.post(`${environment.apiUrl}/auth/compare`, { username, password }).pipe(
      tap((user) => {
        if (!user) {
          throw new Error('Usuario no válido');
        }
        return {
          ok: true,
          usuario: user
        };
      }),
      catchError((error: HttpErrorResponse) => {
        const errorMessage = error.error?.msg || 'Error en la autenticación';
        return throwError(() => errorMessage);
      })
    );
  }

  private setSession(user: CurrentUserModel): void {
    this._localstorageService.setCurrentUserLocalStorage(user);
    this.currentUserSubject.next(user);
    // === MODIFICACIÓN CLAVE 4: Actualizar estado de login ===
    this.loggedInSubject.next(true);
  }

  logout() {
    this._localstorageService.setLogOut();
    this.currentUserSubject.next(null);
    // === MODIFICACIÓN CLAVE 5: Actualizar estado de login ===
    this.loggedInSubject.next(false);
    this.router.navigate(['/autenticacion/login']);
  }

  public isTokenExpired(token: string): boolean {
    try {
      const decoded: any = jwtDecode(token);
      const now = Math.floor(new Date().getTime() / 1000);
      return decoded.exp < now;
    } catch (err) {
      return true;
    }
  }
}
