/* eslint-disable no-case-declarations */
// /* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable @angular-eslint/contextual-lifecycle */
// import { Injectable, OnInit } from '@angular/core';
// import { NavigationItem } from '../../layout/admin/navigation/navigation';
// import { PtlAplicacionesService } from './ptlaplicaciones.service';
// import { PtlSuitesAPService } from './ptlsuites-ap.service';
// import { PtlmodulosApService } from './ptlmodulos-ap.service';
// import { Subscription, tap, catchError, of, Observable, BehaviorSubject } from 'rxjs';
// import { PTLAplicacionModel } from '../_helpers/models/PTLAplicacion.model';
// import { PTLModuloAP } from '../_helpers/models/PTLModuloAP.model';
// import { PTLSuiteAPModel } from '../_helpers/models/PTLSuiteAP.model';
// import { LocalStorageService } from './local-storage.service';

// @Injectable({
//   providedIn: 'root'
// })
// export class NavigationService implements OnInit {
//   aplicaciones: PTLAplicacionModel[] = [];
//   suites: PTLSuiteAPModel[] = [];
//   suitesApp: PTLSuiteAPModel[] = [];
//   modulos: PTLModuloAP[] = [];
//   modulosSu: PTLModuloAP[] = [];
//   modulosSu2: PTLModuloAP[] = [];
//   aplicacionesSub?: Subscription;
//   suitesSub?: Subscription;
//   modulosSub?: Subscription;
//   aplicacion: PTLAplicacionModel = new PTLAplicacionModel();
//   suite: PTLSuiteAPModel = new PTLSuiteAPModel();
//   modulo: PTLModuloAP = new PTLModuloAP();
//   modulo2: PTLModuloAP = new PTLModuloAP();
//   private menuSubject = new BehaviorSubject<NavigationItem[]>([]);
//   public menuItems$: Observable<NavigationItem[]> = this.menuSubject.asObservable();

//   constructor(
//     private _aplicacionesService: PtlAplicacionesService,
//     private _suitesService: PtlSuitesAPService,
//     private _modulosService: PtlmodulosApService,
//     private _localStorageService: LocalStorageService
//   ) {
//     // this.consultarAplicacines();
//   }

//   ngOnInit() {
//     // this.consultarModulos();
//     this.consultarAplicacines();
//     this.consultarSuites();
//   }

//   consultarAplicacines() {
//     this.aplicacionesSub = this._aplicacionesService
//       .getAplicaciones()
//       .pipe(
//         tap((resp) => {
//           if (resp.ok) {
//             this.aplicaciones = resp.aplicaciones;
//           }
//         }),
//         catchError((err) => {
//           console.error(err);
//           return of([]);
//         })
//       )
//       .subscribe();
//   }

//   consultarSuites(): void {
//     this.suitesSub = this._suitesService
//       .geSuitesAP()
//       .pipe(
//         tap((resp) => {
//           if (resp.ok) {
//             this.suites = resp.suites;
//           }
//         }),
//         catchError((err) => {
//           console.error(err);
//           return of([]);
//         })
//       )
//       .subscribe();
//   }

//   consultarModulos(): void {
//     this.modulosSub = this._modulosService
//       .getRegistros()
//       .pipe(
//         tap((resp) => {
//           if (resp.ok) {
//             this.modulos = resp.modulos;
//             console.log('modulos', this.modulos);
//           }
//         }),
//         catchError((err) => {
//           console.error(err);
//           return of([]);
//         })
//       )
//       .subscribe();
//   }

//   getNavigationItems(): void {
//     this.aplicacion = this._localStorageService.getAplicaicionLocalStorage();
//     let menu: NavigationItem[] = [];
//     switch (this.aplicacion.codigoAplicacion) {
//       case 'ela8fa09-15db-479b-a0a4-9c2be72273b5':
//         this._modulosService.getRegistros().subscribe((data) => {
//           this.modulos = data.modulos;
//           console.log('modulos para el menu', this.modulos);

//           if (data.modulos.length > 0) {
//             menu = this.getAplicacionSuiteItems();
//             console.log('este es el menu', menu);
//             this.menuSubject.next(menu);
//           }
//         });
//         break;
//       case 'helpdesk':
//         menu = this.getHelpDeskItems();
//         this.menuSubject.next(menu);
//         break;
//       default:
//         this.menuSubject.next([]);
//         break;
//     }
//   }

//   private getPlataformaItems(): NavigationItem[] {
//     this.suitesApp = this.suites.filter((x) => x.codigoAplicacion == this.aplicacion.codigoAplicacion);
//     return [
//       {
//         id: 'e1a8fa99-15db-479b-a0a4-9c2be72273b5',
//         title: 'Plataforma',
//         type: 'group',
//         icon: 'feather icon-monitor',
//         children: [
//           {
//             id: 'autenticacion',
//             title: 'Autenticación',
//             type: 'collapse',
//             icon: 'feather icon-home',
//             children: [
//               {
//                 id: 'logn',
//                 title: 'Login',
//                 type: 'item',
//                 url: '/autenticacion/login'
//               },
//               {
//                 id: 'change-password',
//                 title: 'Cambio Clave',
//                 type: 'item',
//                 url: '/autenticacion/change-password'
//               },
//               {
//                 id: 'reset-password',
//                 title: 'Resetear Clave',
//                 type: 'item',
//                 url: '/autenticacion/reset-password'
//               },
//               {
//                 id: 'perfil',
//                 title: 'Perfil Usuario',
//                 type: 'item',
//                 url: '/autenticacion/perfil'
//               },
//               {
//                 id: 'perfil-configuracion',
//                 title: 'Configuración Perfil',
//                 type: 'item',
//                 url: '/autenticacion/perfil-configuracion'
//               }
//             ]
//           },
//           {
//             id: 'home',
//             title: 'Home',
//             type: 'collapse',
//             icon: 'feather icon-home',
//             children: [
//               {
//                 id: 'home',
//                 title: 'Dashboard',
//                 type: 'item',
//                 url: '/home/home'
//               }
//             ]
//           },
//           {
//             id: 'frontal',
//             title: 'External',
//             type: 'collapse',
//             icon: 'feather icon-home',
//             children: [
//               {
//                 id: 'inicio',
//                 title: 'Inicio Apps',
//                 type: 'item',
//                 url: '/frontal/inicio'
//               },
//               {
//                 id: 'login',
//                 title: 'Login',
//                 type: 'item',
//                 url: '/frontal/login'
//               }
//             ]
//           },
//           {
//             id: 'sites',
//             title: 'Sites',
//             type: 'collapse',
//             icon: 'feather icon-home',
//             children: [
//               {
//                 id: 'sites',
//                 title: 'Sites',
//                 type: 'item',
//                 url: '/sites/sites'
//               },
//               {
//                 id: 'enlaces',
//                 title: 'Enlaces',
//                 type: 'item',
//                 url: '/sites/enlaces'
//               },
//               {
//                 id: 'contenidos',
//                 title: 'Contenidos',
//                 type: 'item',
//                 url: '/sites/contenidos'
//               }
//             ]
//           },
//           {
//             id: 'usuarios',
//             title: 'Usuarios',
//             type: 'collapse',
//             icon: 'feather icon-home',
//             children: [
//               {
//                 id: 'usuarios',
//                 title: 'Usuarios',
//                 type: 'item',
//                 url: '/usuarios/usuarios'
//               }
//             ]
//           },
//           {
//             id: 'administracion-bd',
//             title: 'AdministradorBD',
//             type: 'collapse',
//             icon: 'feather icon-home',
//             children: [
//               {
//                 id: 'servidores',
//                 title: 'Servidores',
//                 type: 'item',
//                 url: '/administracion-bd/servidores'
//               },
//               {
//                 id: 'conexiones',
//                 title: 'Conexiones',
//                 type: 'item',
//                 url: '/administracion-bd/conexiones'
//               },
//               {
//                 id: 'scripts',
//                 title: 'Scripts',
//                 type: 'item',
//                 url: '/administracion-bd/scripts'
//               },
//               {
//                 id: 'log-actividades',
//                 title: 'Log Actividades',
//                 type: 'item',
//                 url: '/administracion-bd/log-actividades'
//               },
//               {
//                 id: 'estadisticas',
//                 title: 'Estadisticas',
//                 type: 'item',
//                 url: '/administracion-bd/estadisticas'
//               }
//             ]
//           },
//           {
//             id: 'aplicaciones',
//             title: 'Aplicaciones',
//             type: 'collapse',
//             icon: 'feather icon-home',
//             children: [
//               {
//                 id: 'aplicaciones',
//                 title: 'Aplicaciones',
//                 type: 'item',
//                 url: '/aplicaciones/aplicaciones'
//               },
//               {
//                 id: 'suites',
//                 title: 'Suites',
//                 type: 'item',
//                 url: '/aplicaciones/suites'
//               },
//               {
//                 id: 'modulos',
//                 title: 'Modulos',
//                 type: 'item',
//                 url: '/aplicaciones/modulos'
//               },
//               {
//                 id: 'versiones',
//                 title: 'Versiones',
//                 type: 'item',
//                 url: '/aplicaciones/versiones'
//               },
//               {
//                 id: 'paquetes',
//                 title: 'Paqauetes',
//                 type: 'item',
//                 url: '/aplicaciones/paquetes'
//               },
//               {
//                 id: 'log-actividades',
//                 title: 'Log Actividades',
//                 type: 'item',
//                 url: '/aplicaciones/log-actividades'
//               },
//               {
//                 id: 'log-actividades',
//                 title: 'LogExcepciones',
//                 type: 'item',
//                 url: '/aplicaciones/log-excepciones'
//               },
//               {
//                 id: 'estadisticas',
//                 title: 'Estadisticas',
//                 type: 'item',
//                 url: '/aplicaciones/estadisticas'
//               }
//             ]
//           },
//           {
//             id: 'suscriptor',
//             title: 'Suscriptores',
//             type: 'collapse',
//             icon: 'feather icon-home',
//             children: [
//               {
//                 id: 'suscriptores',
//                 title: 'Suscriptores',
//                 type: 'item',
//                 url: '/suscriptor/suscriptores'
//               },
//               {
//                 id: 'empresas',
//                 title: 'Empresas',
//                 type: 'item',
//                 url: '/suscriptor/empresas'
//               },
//               {
//                 id: 'usuarios-suscriptor',
//                 title: 'Usuarios',
//                 type: 'item',
//                 url: '/suscriptor/usuarios-suscriptor'
//               }
//             ]
//           },
//           {
//             id: 'licencias',
//             title: 'Licencias',
//             type: 'collapse',
//             icon: 'feather icon-monitor',
//             children: [
//               {
//                 id: 'licencias-afiliado',
//                 title: 'Licencias Afiliado',
//                 type: 'item',
//                 url: '/licencias/licencias-afiliado'
//               },
//               {
//                 id: 'adiciones-sustracciones',
//                 title: 'Adiciones/Sustracciones',
//                 type: 'item',
//                 url: '/licencias/adiciones-sustracciones'
//               },
//               {
//                 id: 'historial-pagos',
//                 title: 'Historial Pagos',
//                 type: 'item',
//                 url: '/licencias/historial-pagos'
//               }
//             ]
//           },
//           {
//             id: 'logs',
//             title: 'Logs',
//             type: 'collapse',
//             icon: 'feather icon-monitor',
//             children: [
//               {
//                 id: 'log-actividades',
//                 title: 'Log Actividades',
//                 type: 'item',
//                 url: '/logs/log-actividades'
//               },
//               {
//                 id: 'log-actualizaciones',
//                 title: 'Log Actualizaciones',
//                 type: 'item',
//                 url: '/logs/log-actualizaciones'
//               },
//               {
//                 id: 'log-transacciones',
//                 title: 'Log Transacciones',
//                 type: 'item',
//                 url: '/logs/log-transacciones'
//               },
//               {
//                 id: 'estadisticas',
//                 title: 'Estadisticas',
//                 type: 'item',
//                 url: '/logs/estadisticas'
//               }
//             ]
//           },
//           {
//             id: 'help-desk',
//             title: 'Help Desk',
//             type: 'collapse',
//             icon: 'feather icon-monitor',
//             children: [
//               {
//                 id: 'estadisticas',
//                 title: 'Estadícas',
//                 type: 'item',
//                 url: '/help-desk/estadisticas'
//               },
//               {
//                 id: 'requerimientos',
//                 title: 'Requerimientos',
//                 type: 'item',
//                 url: '/help-desk/requerimientos'
//               },
//               {
//                 id: 'seguimientos',
//                 title: 'Seguimientos',
//                 type: 'item',
//                 url: '/help-desk/seguimientos'
//               },
//               {
//                 id: 'tickets',
//                 title: 'Tickets',
//                 type: 'item',
//                 url: '/help-desk/tickets'
//               }
//             ]
//           },
//           {
//             id: 'roles',
//             title: 'Roles',
//             type: 'collapse',
//             icon: 'feather icon-monitor',
//             children: [
//               {
//                 id: 'roles',
//                 title: 'Roles',
//                 type: 'item',
//                 url: '/roles/roles'
//               },
//               {
//                 id: 'roles-usuarios',
//                 title: 'Roles Usuarios',
//                 type: 'item',
//                 url: '/roles/roles-usuarios'
//               }
//             ]
//           }
//         ]
//       }
//     ];
//   }

//   private getAplicacionSuiteItems(): NavigationItem[] {
//     this.suite = this._localStorageService.getSuiteLocalStorage();
//     this.modulosSu2 = this.modulos.filter((x) => x.codigoSuite === this.suite.codigoSuite);
//     console.log('**** modulos de la suite', this.modulosSu2);
//     if (this.modulosSu2.length === 0) {
//       return [];
//     }
//     const modulosPadreRaiz = this.modulosSu2.filter((x) => x.codigoPadre === '0');
//     const hijosDelNodoSuite = this.buildMenuItems(modulosPadreRaiz, this.modulosSu2);
//     const nodoSuite: NavigationItem = {
//       id: this.suite.codigoSuite || '',
//       title: this.suite.nombreSuite || '',
//       type: 'group',
//       icon: 'feather icon-monitor',
//       children: hijosDelNodoSuite
//     };
//     return [nodoSuite];
//   }

//   private consultarNodosHijos(codModulo: string, modulos: PTLModuloAP[]) {
//     const hijos = modulos.filter((x) => x.codigoPadre == codModulo);
//     return hijos;
//   }

//   private buildMenuItems(modulosPadre: PTLModuloAP[], todosLosModulos: PTLModuloAP[]): NavigationItem[] {
//     const menuItems: NavigationItem[] = [];
//     modulosPadre.forEach((modulo: any) => {
//       const childrenNodes = this.consultarNodosHijos(modulo.codigoModulo, todosLosModulos);
//       const hasChildren = modulo.hijos == true;
//       const type: 'collapse' | 'item' = hasChildren ? 'collapse' : 'item';
//       const url = !hasChildren ? modulo.rutaModulo : undefined;
//       const item: NavigationItem = {
//         id: modulo.codigoModulo,
//         title: modulo.nombreModulo,
//         type: type,
//         url: url,
//         icon: 'feather icon-menu'
//       };
//       if (hasChildren) {
//         item.children = this.buildMenuItems(childrenNodes, todosLosModulos);
//       }
//       menuItems.push(item);
//     });
//     return menuItems;
//   }

//   private getHelpDeskItems(): NavigationItem[] {
//     return [
//       {
//         id: 'helpdesk-group',
//         title: 'HELPDESK.MENU',
//         type: 'group',
//         children: [
//           {
//             id: 'tickets',
//             title: 'HELPDESK.TICKETS',
//             type: 'item',
//             url: '/helpdesk/tickets',
//             icon: 'feather icon-tag'
//           },
//           {
//             id: 'estadisticas',
//             title: 'HELPDESK.ESTADISTICAS',
//             type: 'item',
//             url: '/helpdesk/estadisticas',
//             icon: 'feather icon-pie-chart'
//           }
//         ]
//       }
//     ];
//   }
// }

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/contextual-lifecycle */
import { Injectable, OnInit } from '@angular/core';
import { NavigationItem } from '../../layout/admin/navigation/navigation';
import { PtlAplicacionesService } from './ptlaplicaciones.service';
import { PtlSuitesAPService } from './ptlsuites-ap.service';
import { PtlmodulosApService } from './ptlmodulos-ap.service';
import { Subscription, tap, catchError, of, Observable, BehaviorSubject } from 'rxjs';
import { PTLAplicacionModel } from '../_helpers/models/PTLAplicacion.model';
import { PTLModuloAP } from '../_helpers/models/PTLModuloAP.model';
import { PTLSuiteAPModel } from '../_helpers/models/PTLSuiteAP.model';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class NavigationService implements OnInit {
  aplicaciones: PTLAplicacionModel[] = [];
  suites: PTLSuiteAPModel[] = [];
  suitesApp: PTLSuiteAPModel[] = [];
  modulos: PTLModuloAP[] = [];
  modulosSu: PTLModuloAP[] = [];
  modulosSu2: PTLModuloAP[] = [];
  aplicacionesSub?: Subscription;
  suitesSub?: Subscription;
  modulosSub?: Subscription;
  aplicacion: PTLAplicacionModel = new PTLAplicacionModel();
  suite: PTLSuiteAPModel = new PTLSuiteAPModel();
  modulo: PTLModuloAP = new PTLModuloAP();
  modulo2: PTLModuloAP = new PTLModuloAP();

  private menuSubject = new BehaviorSubject<NavigationItem[]>([]);
  public menuItems$: Observable<NavigationItem[]> = this.menuSubject.asObservable();

  constructor(
    private _aplicacionesService: PtlAplicacionesService,
    private _suitesService: PtlSuitesAPService,
    private _modulosService: PtlmodulosApService,
    private _localStorageService: LocalStorageService
  ) {
    // this.consultarAplicacines();
  }

  ngOnInit() {
    this.consultarAplicacines();
    this.consultarSuites();
  }

  consultarAplicacines() {
    this.aplicacionesSub = this._aplicacionesService
      .getAplicaciones()
      .pipe(
        tap((resp) => {
          if (resp.ok) {
            this.aplicaciones = resp.aplicaciones;
          }
        }),
        catchError((err) => {
          console.error(err);
          return of([]);
        })
      )
      .subscribe();
  }

  consultarSuites(): void {
    this.suitesSub = this._suitesService
      .geSuitesAP()
      .pipe(
        tap((resp) => {
          if (resp.ok) {
            this.suites = resp.suites;
          }
        }),
        catchError((err) => {
          console.error(err);
          return of([]);
        })
      )
      .subscribe();
  }

  getNavigationItems(): void {
    this.aplicacion = this._localStorageService.getAplicaicionLocalStorage();
    this.suite = this._localStorageService.getSuiteLocalStorage();
    const codigoApp = this.aplicacion.codigoAplicacion;
    switch (codigoApp) {
      case 'e1a8fa99-15db-479b-a0a4-9c2be72273b5':
        this._modulosService.getRegistros().subscribe((data) => {
          const nuevosModulos = data.modulos;
          if (nuevosModulos.length > 0) {
            const menu = this.getAplicacionSuiteItems(nuevosModulos);
            this.menuSubject.next(menu);
          } else {
            this.menuSubject.next([]);
          }
        });
        break;
      case 'helpdesk':
        const menuHelpdesk = this.getHelpDeskItems();
        this.menuSubject.next(menuHelpdesk);
        break;
      default:
        this.menuSubject.next([]);
        break;
    }
  }

  private getAplicacionSuiteItems(todosLosModulos: PTLModuloAP[]): NavigationItem[] {
    const codigoSuiteActual = this.suite.codigoSuite;
    const modulosDeLaSuite = todosLosModulos.filter((x) => x.codigoSuite === codigoSuiteActual);
    if (modulosDeLaSuite.length === 0) {
      return [];
    }
    const modulosPadreRaiz = modulosDeLaSuite.filter((x) => x.codigoPadre === '0');
    const hijosDelNodoSuite = this.buildMenuItems(modulosPadreRaiz, modulosDeLaSuite);
    const hijosOrdenados = this.sortMenuItems(hijosDelNodoSuite);
    const nodoSuite: NavigationItem = {
      id: this.suite.codigoSuite || '',
      title: this.suite.nombreSuite || '',
      type: 'group',
      icon: 'feather icon-monitor',
      children: hijosOrdenados
    };
    return [nodoSuite];
  }

  private consultarNodosHijos(codModulo: string, modulos: PTLModuloAP[]) {
    const hijos = modulos.filter((x) => x.codigoPadre == codModulo);
    return hijos;
  }

  private buildMenuItems(modulosPadre: PTLModuloAP[], todosLosModulos: PTLModuloAP[]): NavigationItem[] {
    const menuItems: NavigationItem[] = [];
    modulosPadre.forEach((modulo: any) => {
      const childrenNodes = this.consultarNodosHijos(modulo.codigoModulo, todosLosModulos);
      const hasChildren = modulo.hijos == true;
      const type: 'collapse' | 'item' = hasChildren ? 'collapse' : 'item';
      const item: NavigationItem = {
        id: modulo.codigoModulo,
        title: modulo.nombreModulo,
        type: type,
        icon: 'feather icon-menu'
      };
      if (hasChildren) {
        item.children = this.buildMenuItems(childrenNodes, todosLosModulos);
      } else {
        item.url = modulo.rutaModulo;
      }
      menuItems.push(item);
    });
    return menuItems;
  }

  private getPlataformaItems(): NavigationItem[] {
    this.suitesApp = this.suites.filter((x) => x.codigoAplicacion == this.aplicacion.codigoAplicacion);
    return [
      {
        id: 'e1a8fa99-15db-479b-a0a4-9c2be72273b5',
        title: 'Plataforma',
        type: 'group',
        icon: 'feather icon-monitor',
        children: [
          // ... (Resto de tu menú estático) ...
          {
            id: 'autenticacion',
            title: 'Autenticación',
            type: 'collapse',
            icon: 'feather icon-home',
            children: [
              {
                id: 'logn',
                title: 'Login',
                type: 'item',
                url: '/autenticacion/login'
              },
              {
                id: 'change-password',
                title: 'Cambio Clave',
                type: 'item',
                url: '/autenticacion/change-password'
              },
              {
                id: 'reset-password',
                title: 'Resetear Clave',
                type: 'item',
                url: '/autenticacion/reset-password'
              },
              {
                id: 'perfil',
                title: 'Perfil Usuario',
                type: 'item',
                url: '/autenticacion/perfil'
              },
              {
                id: 'perfil-configuracion',
                title: 'Configuración Perfil',
                type: 'item',
                url: '/autenticacion/perfil-configuracion'
              }
            ]
          },
          {
            id: 'home',
            title: 'Home',
            type: 'collapse',
            icon: 'feather icon-home',
            children: [
              {
                id: 'home',
                title: 'Dashboard',
                type: 'item',
                url: '/home/home'
              }
            ]
          },
          {
            id: 'frontal',
            title: 'External',
            type: 'collapse',
            icon: 'feather icon-home',
            children: [
              {
                id: 'inicio',
                title: 'Inicio Apps',
                type: 'item',
                url: '/frontal/inicio'
              },
              {
                id: 'login',
                title: 'Login',
                type: 'item',
                url: '/frontal/login'
              }
            ]
          },
          {
            id: 'sites',
            title: 'Sites',
            type: 'collapse',
            icon: 'feather icon-home',
            children: [
              {
                id: 'sites',
                title: 'Sites',
                type: 'item',
                url: '/sites/sites'
              },
              {
                id: 'enlaces',
                title: 'Enlaces',
                type: 'item',
                url: '/sites/enlaces'
              },
              {
                id: 'contenidos',
                title: 'Contenidos',
                type: 'item',
                url: '/sites/contenidos'
              }
            ]
          },
          {
            id: 'usuarios',
            title: 'Usuarios',
            type: 'collapse',
            icon: 'feather icon-home',
            children: [
              {
                id: 'usuarios',
                title: 'Usuarios',
                type: 'item',
                url: '/usuarios/usuarios'
              }
            ]
          },
          {
            id: 'administracion-bd',
            title: 'AdministradorBD',
            type: 'collapse',
            icon: 'feather icon-home',
            children: [
              {
                id: 'servidores',
                title: 'Servidores',
                type: 'item',
                url: '/administracion-bd/servidores'
              },
              {
                id: 'conexiones',
                title: 'Conexiones',
                type: 'item',
                url: '/administracion-bd/conexiones'
              },
              {
                id: 'scripts',
                title: 'Scripts',
                type: 'item',
                url: '/administracion-bd/scripts'
              },
              {
                id: 'log-actividades',
                title: 'Log Actividades',
                type: 'item',
                url: '/administracion-bd/log-actividades'
              },
              {
                id: 'estadisticas',
                title: 'Estadisticas',
                type: 'item',
                url: '/administracion-bd/estadisticas'
              }
            ]
          },
          {
            id: 'aplicaciones',
            title: 'Aplicaciones',
            type: 'collapse',
            icon: 'feather icon-home',
            children: [
              {
                id: 'aplicaciones',
                title: 'Aplicaciones',
                type: 'item',
                url: '/aplicaciones/aplicaciones'
              },
              {
                id: 'suites',
                title: 'Suites',
                type: 'item',
                url: '/aplicaciones/suites'
              },
              {
                id: 'modulos',
                title: 'Modulos',
                type: 'item',
                url: '/aplicaciones/modulos'
              },
              {
                id: 'versiones',
                title: 'Versiones',
                type: 'item',
                url: '/aplicaciones/versiones'
              },
              {
                id: 'paquetes',
                title: 'Paqauetes',
                type: 'item',
                url: '/aplicaciones/paquetes'
              },
              {
                id: 'log-actividades',
                title: 'Log Actividades',
                type: 'item',
                url: '/aplicaciones/log-actividades'
              },
              {
                id: 'log-actividades',
                title: 'LogExcepciones',
                type: 'item',
                url: '/aplicaciones/log-excepciones'
              },
              {
                id: 'estadisticas',
                title: 'Estadisticas',
                type: 'item',
                url: '/aplicaciones/estadisticas'
              }
            ]
          },
          {
            id: 'suscriptor',
            title: 'Suscriptores',
            type: 'collapse',
            icon: 'feather icon-home',
            children: [
              {
                id: 'suscriptores',
                title: 'Suscriptores',
                type: 'item',
                url: '/suscriptor/suscriptores'
              },
              {
                id: 'empresas',
                title: 'Empresas',
                type: 'item',
                url: '/suscriptor/empresas'
              },
              {
                id: 'usuarios-suscriptor',
                title: 'Usuarios',
                type: 'item',
                url: '/suscriptor/usuarios-suscriptor'
              }
            ]
          },
          {
            id: 'licencias',
            title: 'Licencias',
            type: 'collapse',
            icon: 'feather icon-monitor',
            children: [
              {
                id: 'licencias-afiliado',
                title: 'Licencias Afiliado',
                type: 'item',
                url: '/licencias/licencias-afiliado'
              },
              {
                id: 'adiciones-sustracciones',
                title: 'Adiciones/Sustracciones',
                type: 'item',
                url: '/licencias/adiciones-sustracciones'
              },
              {
                id: 'historial-pagos',
                title: 'Historial Pagos',
                type: 'item',
                url: '/licencias/historial-pagos'
              }
            ]
          },
          {
            id: 'logs',
            title: 'Logs',
            type: 'collapse',
            icon: 'feather icon-monitor',
            children: [
              {
                id: 'log-actividades',
                title: 'Log Actividades',
                type: 'item',
                url: '/logs/log-actividades'
              },
              {
                id: 'log-actualizaciones',
                title: 'Log Actualizaciones',
                type: 'item',
                url: '/logs/log-actualizaciones'
              },
              {
                id: 'log-transacciones',
                title: 'Log Transacciones',
                type: 'item',
                url: '/logs/log-transacciones'
              },
              {
                id: 'estadisticas',
                title: 'Estadisticas',
                type: 'item',
                url: '/logs/estadisticas'
              }
            ]
          },
          {
            id: 'help-desk',
            title: 'Help Desk',
            type: 'collapse',
            icon: 'feather icon-monitor',
            children: [
              {
                id: 'estadisticas',
                title: 'Estadícas',
                type: 'item',
                url: '/help-desk/estadisticas'
              },
              {
                id: 'requerimientos',
                title: 'Requerimientos',
                type: 'item',
                url: '/help-desk/requerimientos'
              },
              {
                id: 'seguimientos',
                title: 'Seguimientos',
                type: 'item',
                url: '/help-desk/seguimientos'
              },
              {
                id: 'tickets',
                title: 'Tickets',
                type: 'item',
                url: '/help-desk/tickets'
              }
            ]
          },
          {
            id: 'roles',
            title: 'Roles',
            type: 'collapse',
            icon: 'feather icon-monitor',
            children: [
              {
                id: 'roles',
                title: 'Roles',
                type: 'item',
                url: '/roles/roles'
              },
              {
                id: 'roles-usuarios',
                title: 'Roles Usuarios',
                type: 'item',
                url: '/roles/roles-usuarios'
              }
            ]
          }
        ]
      }
    ];
  }

  private getHelpDeskItems(): NavigationItem[] {
    return [
      {
        id: 'helpdesk-group',
        title: 'HELPDESK.MENU',
        type: 'group',
        children: [
          {
            id: 'tickets',
            title: 'HELPDESK.TICKETS',
            type: 'item',
            url: '/helpdesk/tickets',
            icon: 'feather icon-tag'
          },
          {
            id: 'estadisticas',
            title: 'HELPDESK.ESTADISTICAS',
            type: 'item',
            url: '/helpdesk/estadisticas',
            icon: 'feather icon-pie-chart'
          }
        ]
      }
    ];
  }

  private sortMenuItems(items: NavigationItem[]): NavigationItem[] {
    if (!items || items.length === 0) {
      return [];
    }
    items.sort((a, b) => {
      const titleA = a.title || '';
      const titleB = b.title || '';
      return titleA.localeCompare(titleB, 'es', { sensitivity: 'base' });
    });
    items.forEach((item) => {
      if (item.children && item.children.length > 0) {
        item.children = this.sortMenuItems(item.children);
      }
    });
    return items;
  }
}
