/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { PTLUsuarioModel } from '../_helpers/models/PTLUsuario.model';
// import { User } from '../_helpers/user';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { LocalStorageService } from './local-storage.service';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  // eslint-disable-next-line
  private currentUserSubject: BehaviorSubject<PTLUsuarioModel | any>;
  public currentUser: Observable<PTLUsuarioModel>;
  isValid: boolean = false;

  constructor(
    private router: Router,
    private http: HttpClient,
    private _localstorageService: LocalStorageService
  ) {
    // eslint-disable-next-line
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

  login(username: string, password: string): Observable<PTLUsuarioModel> {
    return this.http.post<PTLUsuarioModel>(`${environment.apiUrl}/auth`, { username, password }).pipe(
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

  private setSession(user: PTLUsuarioModel): void {
    // console.log('subir usuario al localstorage', user);
    this._localstorageService.setCurrentUserLocalStorage(user);
    this.currentUserSubject.next(user);
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
