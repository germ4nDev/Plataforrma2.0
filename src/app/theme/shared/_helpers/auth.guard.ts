import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, CanLoad, Route, UrlSegment, UrlTree } from '@angular/router';
import { Observable, combineLatest, of } from 'rxjs';
import { take, map, catchError, filter } from 'rxjs/operators';
// Asegúrate de que la ruta a tu servicio sea la correcta
import { AuthenticationService } from '../service/authentication.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate, CanLoad {
  constructor(
    private router: Router,
    // Inyección del servicio de autenticación, permitiendo usar 'this.authService'.
    private authService: AuthenticationService
  ) {}

  /**
   * Lógica principal que espera por la inicialización de la autenticación
   * y luego verifica el estado de login.
   * * @param url La URL a la que se intentó acceder.
   * @returns Observable<boolean | UrlTree>
   */
  private checkAuth(url: string): Observable<boolean | UrlTree> {
    // combineLatest: Espera a que ambos Observables emitan un valor.
    return combineLatest([
      // 1. isAuthInitialized$: Solo deja pasar el flujo cuando la inicialización es verdadera (true).
      // Esto previene que el guard actúe antes de que el servicio haya terminado de revisar si hay un token guardado.
      this.authService.isAuthInitialized$.pipe(filter((initialized) => initialized)),
      // 2. isLoggedIn$: El estado actual de login.
      this.authService.isLoggedIn$
    ]).pipe(
      // take(1): Tomamos el primer resultado combinado después de la inicialización y completamos.
      take(1),
      map(([initialized, isLoggedIn]) => {
        if (isLoggedIn) {
          console.log('********** AuthGuard: Acceso concedido. Usuario Logueado.', initialized);
          return true; // Acceso permitido
        }

        // Si no está logueado, se crea el UrlTree para redirigir al login.
        console.log('********** AuthGuard: Acceso denegado. Redirigiendo a login.');
        // Se añade 'returnUrl' para que el usuario pueda volver a la página original después de iniciar sesión.
        return this.router.createUrlTree(['autenticacion/login'], { queryParams: { returnUrl: url } });
      }),
      // catchError: Captura cualquier error inesperado en el flujo y, por seguridad, redirige al login.
      catchError((error) => {
        console.error('********** AuthGuard: Error inesperado en el guard. Redirigiendo.', error);
        return of(this.router.createUrlTree(['autenticacion/login']));
      })
    );
  }

  // Implementación para proteger rutas normales (CanActivate)
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> {
    return this.checkAuth(state.url);
  }

  // Implementación para proteger la carga perezosa de módulos (CanLoad)
  canLoad(route: Route, segments: UrlSegment[]): Observable<boolean | UrlTree> {
    // Reconstruye la URL para el 'returnUrl'
    const url = segments.length > 0 ? `/${segments.join('/')}` : '/';
    return this.checkAuth(url);
  }
}
