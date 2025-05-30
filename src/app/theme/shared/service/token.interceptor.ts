/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError, switchMap, catchError, finalize } from 'rxjs';
import { AuthenticationService } from '../service/authentication.service';
import { Router } from '@angular/router';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  private isRefreshing = false;

  constructor(private auth: AuthenticationService, private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.auth.getAccessToken();
    let authReq = req;

    if (token) {
      authReq = this.addTokenHeader(req, token);
    }

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        // Si el token expiró, intentamos refrescar
        if (error.status === 401 && !this.isRefreshing) {
          this.isRefreshing = true;

          return this.auth.refreshToken().pipe(
            switchMap((res: any) => {
              const newAccessToken = res.accessToken;
              const refreshToken = localStorage.getItem('refreshToken')!;
              this.auth.saveTokens(newAccessToken, refreshToken);

              const retryReq = this.addTokenHeader(req, newAccessToken);
              return next.handle(retryReq);
            }),
            catchError(err => {
              this.auth.logout();
              this.router.navigate(['/login']);
              return throwError(() => err);
            }),
            finalize(() => {
              this.isRefreshing = false;
            })
          );
        }

        return throwError(() => error);
      })
    );
  }

  private addTokenHeader(req: HttpRequest<any>, token: string): HttpRequest<any> {
    return req.clone({
      setHeaders: { Authorization: token }
    });
  }
}
