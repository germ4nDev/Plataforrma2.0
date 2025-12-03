import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, CanLoad, Route, UrlSegment, UrlTree } from '@angular/router';
import { Observable, combineLatest, of } from 'rxjs';
import { take, map, catchError, filter } from 'rxjs/operators';
import { AuthenticationService } from '../theme/shared/service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate, CanLoad {
  constructor(
    private router: Router,
    private authService: AuthenticationService
  ) {}

  private checkAuth(url: string): Observable<boolean | UrlTree> {
    return combineLatest([
      this.authService.isAuthInitialized$.pipe(filter((initialized) => initialized)),
      this.authService.isLoggedIn$
    ]).pipe(
      take(1),
      map(([initialized, isLoggedIn]) => {
        if (isLoggedIn) {
          console.log('********** AuthGuard: Acceso concedido. Usuario Logueado.', initialized);
          return true;
        }
        console.log('********** AuthGuard: Acceso denegado. Redirigiendo a login.');
        return this.router.createUrlTree(['autenticacion/login'], { queryParams: { returnUrl: url } });
      }),
      catchError((error) => {
        console.error('********** AuthGuard: Error inesperado en el guard. Redirigiendo.', error);
        return of(this.router.createUrlTree(['autenticacion/login']));
      })
    );
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> {
    return this.checkAuth(state.url);
  }

  canLoad(route: Route, segments: UrlSegment[]): Observable<boolean | UrlTree> {
    // Reconstruye la URL para el 'returnUrl'
    const url = segments.length > 0 ? `/${segments.join('/')}` : '/';
    return this.checkAuth(url);
  }
}
