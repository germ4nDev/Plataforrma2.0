/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
      const cloned = request.clone({
        headers: request.headers.set('x-token', token)
      });

      return next.handle(cloned);
    }
    return next.handle(request);
  }
}
