/* eslint-disable @angular-eslint/contextual-lifecycle */
import { Injectable, OnInit } from '@angular/core';
import { NavigationItem } from '../../layout/admin/navigation/navigation';
import { PtlAplicacionesService } from './ptlaplicaciones.service';
import { PtlSuitesAPService } from './ptlsuites-ap.service';
import { PtlmodulosApService } from './ptlmodulos-ap.service';
import { Subscription, tap, catchError, of } from 'rxjs';
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
  aplicacionesSub?: Subscription;
  suitesSub?: Subscription;
  modulosSub?: Subscription;
  aplicacion: PTLAplicacionModel = new PTLAplicacionModel();
  suite: PTLSuiteAPModel = new PTLSuiteAPModel();
  modulo: PTLModuloAP = new PTLModuloAP();

  constructor(
    private _aplicacionesService: PtlAplicacionesService,
    private _suitesService: PtlSuitesAPService,
    private _modulosService: PtlmodulosApService,
    private _localStorageService: LocalStorageService
  ) {}

  ngOnInit() {
    this.consultarAplicacines();
    this.consultarSuites();
    this.consultarModulos();
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

  consultarModulos(): void {
    this.modulosSub = this._modulosService
      .getRegistros()
      .pipe(
        tap((resp) => {
          if (resp.ok) {
            this.modulos = resp.modulos;
          }
        }),
        catchError((err) => {
          console.error(err);
          return of([]);
        })
      )
      .subscribe();
  }

  getNavigationItems(): NavigationItem[] {
    this.aplicacion = this._localStorageService.getAplicaicionLocalStorage();
    switch (this.aplicacion.codigoAplicacion) {
      case 'e1a8fa99-15db-479b-a0a4-9c2be72273b5':
        console.log('menu plataforma', this.getPlataformaItems());
        return this.getPlataformaItems();
      case 'helpdesk':
        return this.getHelpDeskItems();
      // Puedes agregar más casos según las aplicaciones disponibles
      default:
        return [];
    }
  }

  private getPlataformaItems(): NavigationItem[] {
    this.suitesApp = this.suites.filter(x => x.codigoAplicacion == this.aplicacion.codigoAplicacion);
    // let suiteMenu = [];
    // if (this.suitesApp.length > 0) {
    //     this.suitesApp.forEach(su => {
    //         this.modulosSu = this.modulos.filter(x => x.codigoSuite == su.codigoSuite);
    //         const modChildren = [];
    //         if (this.modulosSu.length > 0) {
    //              this.modulosSu.forEach(modu => {

    //             });
    //         }
    //         const objSu = {
    //             id: su.codigoSuite,
    //             title: su.nombreSuite,
    //             type: 'group',
    //             icon: 'feather icon-monitor',
    //             children: [

    //             ]
    //         }
    //     });
    // }



    return [
      {
        id: 'e1a8fa99-15db-479b-a0a4-9c2be72273b5',
        title: 'Plataforma',
        type: 'group',
        icon: 'feather icon-monitor',
        children: [
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
}
