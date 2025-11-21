/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, Subscription, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { PTLUsuarioModel } from '../_helpers/models/PTLUsuario.model';
// import { User } from '../_helpers/user';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { LocalStorageService } from './local-storage.service';
import { CurrentUserModel } from '../_helpers/models/CurrentUser.model';
import { PtlusuariosRolesApService } from './ptlusuarios-roles-ap.service';
import { PTLUsuarioRoleAP } from '../_helpers/models/PTLUsuarioRole.model';
import { PTLRolesAPService } from './ptlroles-ap.service';
import { PTLRoleAPModel } from '../_helpers/models/PTLRoleAP.model';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  // eslint-disable-next-line
  private currentUserSubject: BehaviorSubject<PTLUsuarioModel | any>;
  public currentUser: Observable<PTLUsuarioModel>;
  isValid: boolean = false;
  roles: PTLRoleAPModel[] = [];
  usuariosRoles: PTLUsuarioRoleAP[] = [];
  usuariosRolesSubscription: Subscription | undefined;
  rolesSubscription: Subscription | undefined;

  constructor(
    private router: Router,
    private http: HttpClient,
    private _localstorageService: LocalStorageService,
    private _rolesService: PTLRolesAPService,
    private _usuarioRolesService: PtlusuariosRolesApService
  ) {
    // eslint-disable-next-line
    console.log('************ SERVICIO DE AUTENTICACION ACTIVO');
    this.currentUserSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('currentUser')!));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue() {
    return this.currentUserSubject.value;
  }

  public getToken(): string | null {
    return this.currentUserValue?.token || null;
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

  consultarUsuariosRoles() {
    console.log('acaaaaaaaaa');
    this.usuariosRolesSubscription = this._usuarioRolesService._usuariosRoles$.subscribe({
      next: (userRoles: PTLUsuarioRoleAP[]) => {
        console.log('usuarios roles cargados con éxito:', userRoles.length);
        this.usuariosRoles = userRoles;
        console.log('usuarios roles:', userRoles);
      },
      error: (err) => {
        console.error('Error al cargar los roles de usuario:', err);
        this.usuariosRoles = [];
      }
    });
  }

  login(username: string, password: string): Observable<CurrentUserModel> {
    this.consultarRoles();
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
    const usuario = user.usuario?.codigoUsuario || '';
    const rolesUsuario: PTLUsuarioRoleAP[] = this.usuariosRoles.filter((x) => x.codigoUsuario == usuario);
    if (rolesUsuario.length > 0) {
      user.roles = [];
      rolesUsuario.forEach((role) => {
        const roleData = this.roles.filter((x) => x.codigoRole === role.codigoRole)[0];
        if (roleData) {
          const existe = user.roles?.filter((x) => x.codigoRole === roleData.codigoRole);
          if (existe?.length === 0) {
            user.roles?.push(roleData);
          }
        }
      });
      this._localstorageService.setCurrentUserLocalStorage(user);
      this.currentUserSubject.next(user);
    }
  }

  logout() {
    this._localstorageService.setLogOut();
    this.currentUserSubject.next(null);
    this.router.navigate(['/autenticacion/login']);
  }

  getAccessToken() {
    const token = '';
    return token;
  }

  refreshToken() {}

  saveTokens(token: string, refreshToken: string) {
    console.log('tokens', token, refreshToken);
  }
}
