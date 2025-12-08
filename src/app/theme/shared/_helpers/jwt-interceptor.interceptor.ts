/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  // Define una lista de prefijos de URL que NO deben incluir el token de autenticación.
  // Es crucial incluir aquí la URL base de tu backend si está haciendo peticiones a rutas públicas.
  // Si tu backend usa algo como /api/v1/public o solo /api/websites, ajústalo.
  private publicUrls = [
    '/api/public/websites', // Ejemplo si tu backend sirve contenido web aquí
    '/api/public/data',
    '/assets/' // A menudo quieres excluir activos estáticos
  ];

  constructor() {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    // 1. Verificar si la URL debe ser pública
    const isPublic = this.publicUrls.some(url => request.url.includes(url));

    if (isPublic) {
      // Si la URL es pública, simplemente se pasa la solicitud sin modificar (sin token).
      return next.handle(request);
    }

    // 2. Lógica de token (solo para rutas protegidas)
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');

    if (token) {
      const cloned = request.clone({
        // Tu API usa 'x-token', lo cual es correcto para este caso
        headers: request.headers.set('x-token', token)
      });

      return next.handle(cloned);
    }

    // Si no hay token, pero la ruta no fue marcada como pública, la solicitud pasa sin token.
    return next.handle(request);
  }
}

/* eslint-disable @typescript-eslint/no-explicit-any */
// import { Injectable } from '@angular/core';
// import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
// import { Observable } from 'rxjs';

// @Injectable()
// export class JwtInterceptor implements HttpInterceptor {

//   // Define una lista de prefijos de URL que NO deben incluir el token de autenticación.
//   // Es CRUCIAL que estas URLs coincidan con las rutas públicas de tu BACKEND.
//   private publicUrls = [
//     // Ejemplo CLAVE para tu caso de uso (ruta pública que sirve la web)
//     '/api/public/websites',
//     '/api/public/data',
//     '/assets/' // Activos estáticos
//   ];

//   constructor() {}

//   intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

//     // 1. Verificar si la URL solicitada contiene ALGUNO de los prefijos públicos
//     const isPublicApiCall = this.publicUrls.some(url => request.url.includes(url));

//     if (isPublicApiCall) {
//       // Si la URL es pública, se pasa la solicitud sin modificar (sin 'x-token').
//       console.log(`Interceptor JWT: Solicitud a URL pública (${request.url}). Sin token.`);
//       return next.handle(request);
//     }

//     // 2. Lógica de token (solo para rutas protegidas)
//     const token = localStorage.getItem('token') || sessionStorage.getItem('token');

//     if (token) {
//       const cloned = request.clone({
//         // Añadir el 'x-token' requerido por tu API
//         headers: request.headers.set('x-token', token)
//       });
//       console.log(`Interceptor JWT: Solicitud a URL privada (${request.url}). Token añadido.`);
//       return next.handle(cloned);
//     }

//     // Si la ruta no es pública PERO no hay token (ej: el usuario acaba de cerrar sesión)
//     console.log(`Interceptor JWT: Solicitud a URL privada sin token. Continuar...`);
//     return next.handle(request);
//   }
// }
