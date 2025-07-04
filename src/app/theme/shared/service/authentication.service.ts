import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { PTLUsuarioAP } from '../_helpers/models/PTLUsuarioAP.model';
// import { User } from '../_helpers/user';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    // eslint-disable-next-line
    private currentUserSubject: BehaviorSubject<PTLUsuarioAP | any>;
    public currentUser: Observable<PTLUsuarioAP>;

    constructor(
        private router: Router,
        private http: HttpClient
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

    login(username: string, password: string): Observable<PTLUsuarioAP> {
        return this.http.post<PTLUsuarioAP>(`${environment.apiUrl}/auth`, { username, password }).pipe(
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

    private setSession(user: PTLUsuarioAP): void {
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
        this.router.navigate(['/autenticacion/login']);
    }
}
