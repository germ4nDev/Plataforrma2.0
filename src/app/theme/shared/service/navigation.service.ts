/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/contextual-lifecycle */
import { Injectable, OnDestroy, OnInit } from '@angular/core'
import { PtlmodulosApService } from './ptlmodulos-ap.service'
import { Subscription, Observable, BehaviorSubject, tap, catchError, of, Subject } from 'rxjs'
import { PTLAplicacionModel } from '../_helpers/models/PTLAplicacion.model'
import { PTLModuloAP } from '../_helpers/models/PTLModuloAP.model'
import { PTLSuiteAPModel } from '../_helpers/models/PTLSuiteAP.model'
import { LocalStorageService } from './local-storage.service'
import { TranslateService } from '@ngx-translate/core'
import { LanguageService } from './lenguage.service'
import { Router } from '@angular/router'
import { NavigationItem } from '../_helpers/models/Navigation.model'
import { PtlBibliotecasService } from './ptlbibliotecas.service'

@Injectable({
  providedIn: 'root'
})
export class NavigationService implements OnInit, OnDestroy {
  aplicaciones: PTLAplicacionModel[] = []
  suites: PTLSuiteAPModel[] = []
  suitesApp: PTLSuiteAPModel[] = []
  modulos: PTLModuloAP[] = []
  modulosSu: PTLModuloAP[] = []
  modulosSu2: PTLModuloAP[] = []
  aplicacionesSub?: Subscription
  suitesSub?: Subscription
  modulosSub?: Subscription
  aplicacion: PTLAplicacionModel = new PTLAplicacionModel()
  suite: PTLSuiteAPModel = new PTLSuiteAPModel()
  modulo: PTLModuloAP = new PTLModuloAP()
  modulo2: PTLModuloAP = new PTLModuloAP()

  menuSubject = new BehaviorSubject<NavigationItem[]>([])
  menuItems$: Observable<NavigationItem[]> = this.menuSubject.asObservable()
  langSubscription: Subscription | undefined
  lockScreenSubject = new Subject<string>()
  lockScreenEvent$: Observable<string> = this.lockScreenSubject.asObservable()

  constructor (
    private router: Router,
    private _modulosService: PtlmodulosApService,
    private _bibliotecasService: PtlBibliotecasService,
    private _localStorageService: LocalStorageService,
    private _languageService: LanguageService,
    private translate: TranslateService
  ) {
    this.langSubscription = this._languageService.currentLang$.subscribe(lang => {
      console.log(`[NavigationService] Detectado cambio de idioma a: ${lang}. Actualizando menú.`)
      this.getNavigationItems()
    })
  }

  ngOnInit () {}

  ngOnDestroy (): void {
    if (this.langSubscription) {
      this.langSubscription.unsubscribe()
    }
  }

  emitLockScreen (message: string): void {
    // console.log('Navigation: Emitiendo evento de bloqueo:', message);
    this.lockScreenSubject.next(message)
  }

  private getAbsoluteUrl (url: string | undefined): string | undefined {
    if (!url) {
      return undefined
    }
    return url.startsWith('/') ? url : `/${url}`
  }

  private createTranslationKey (base: string, name: string): string {
    if (!name) return `${base}.DEFAULT`
    const safeName = name
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '_')
      .replace(/_{2,}/g, '_')
    return `${base}.${safeName}`
  }

  private sortMenuItems (items: NavigationItem[]): NavigationItem[] {
    if (!items || items.length === 0) {
      return []
    }

    items.sort((a, b) => {
      const titleA = a.title || ''
      const titleB = b.title || ''
      return titleA.localeCompare(titleB, 'es', { sensitivity: 'base' })
    })

    items.forEach(item => {
      if (item.children && item.children.length > 0) {
        item.children = this.sortMenuItems(item.children)
      }
    })

    return items
  }

  private consultarNodosHijos (codModulo: string, modulos: PTLModuloAP[]) {
    const hijos = modulos.filter(x => x.codigoPadre == codModulo)
    return hijos
  }

  private buildMenuItems (modulosPadre: PTLModuloAP[], todosLosModulos: PTLModuloAP[]): NavigationItem[] {
    const menuItems: NavigationItem[] = []
    modulosPadre.forEach((modulo: any) => {
      const childrenNodes = this.consultarNodosHijos(modulo.codigoModulo, todosLosModulos)
      const hasChildren = modulo.hijos == true
      const type: 'collapse' | 'item' = hasChildren ? 'collapse' : 'item'
      const titleKey = this.translate.instant('PLATAFORMA.MODULOS.' + modulo.translateKey)
      const item: NavigationItem = {
        id: modulo.codigoModulo,
        title: titleKey,
        type: type,
        icon: modulo.icon
      }
      if (hasChildren) {
        item.children = this.buildMenuItems(childrenNodes, todosLosModulos)
      } else {
        item.url = this.getAbsoluteUrl(modulo.rutaModulo)
      }
      menuItems.push(item)
    })
    return menuItems
  }

  private getAplicacionSuiteItems (todosLosModulos: PTLModuloAP[]): NavigationItem[] {
    const codigoSuiteActual = this.suite.codigoSuite
    const modulosDeLaSuite = todosLosModulos.filter(x => x.codigoSuite === codigoSuiteActual)
    if (modulosDeLaSuite.length === 0) {
      return []
    }
    const modulosPadreRaiz = modulosDeLaSuite.filter(x => x.codigoPadre === '0')
    let hijosDelNodoSuite = this.buildMenuItems(modulosPadreRaiz, modulosDeLaSuite)
    hijosDelNodoSuite = this.sortMenuItems(hijosDelNodoSuite)
    const suiteTitleKey = this.translate.instant('PLATAFORMA.SUITES.' + this.suite.translateKey)

    const nodoSuite: NavigationItem = {
      id: this.suite.codigoSuite || '',
      title: suiteTitleKey,
      type: 'group',
      icon: 'feather icon-monitor',
      children: hijosDelNodoSuite
    }
    return [nodoSuite]
  }

  //   private getPlataformaItems(): NavigationItem[] {
  //     return [
  //       {
  //         id: 'e1a8fa99-15db-479b-a0a4-9c2be72273b5',
  //         title: 'PLATAFORMA.GRUPO', // Clave
  //         type: 'group',
  //         icon: 'feather icon-monitor',
  //         children: [
  //           {
  //             id: 'autenticacion',
  //             title: 'PLATAFORMA.AUTENTICACION', // Clave
  //             type: 'collapse',
  //             icon: 'feather icon-home',
  //             children: [
  //               {
  //                 id: 'logn',
  //                 title: 'PLATAFORMA.LOGIN', // Clave
  //                 type: 'item',
  //                 url: this.getAbsoluteUrl('/autenticacion/login')
  //               },
  //               {
  //                 id: 'change-password',
  //                 title: 'PLATAFORMA.CAMBIO_CLAVE', // Clave
  //                 type: 'item',
  //                 url: this.getAbsoluteUrl('/autenticacion/change-password')
  //               },
  //               {
  //                 id: 'reset-password',
  //                 title: 'PLATAFORMA.RESETEAR_CLAVE', // Clave
  //                 type: 'item',
  //                 url: this.getAbsoluteUrl('/autenticacion/reset-password')
  //               },
  //               {
  //                 id: 'perfil',
  //                 title: 'PLATAFORMA.PERFIL_USUARIO', // Clave
  //                 type: 'item',
  //                 url: this.getAbsoluteUrl('/autenticacion/perfil')
  //               },
  //               {
  //                 id: 'perfil-configuracion',
  //                 title: 'PLATAFORMA.CONFIGURACION_PERFIL', // Clave
  //                 type: 'item',
  //                 url: this.getAbsoluteUrl('/autenticacion/perfil-configuracion')
  //               }
  //             ]
  //           },
  //           // Repetir el proceso de CLAVE DE TRADUCCIÓN para todos los demás nodos estáticos:
  //           {
  //             id: 'home',
  //             title: 'PLATAFORMA.HOME',
  //             type: 'collapse',
  //             icon: 'feather icon-home',
  //             children: [{ id: 'dashboard', title: 'PLATAFORMA.DASHBOARD', type: 'item', url: this.getAbsoluteUrl('/home/home') }]
  //           },
  //           {
  //             id: 'frontal',
  //             title: 'PLATAFORMA.EXTERNAL',
  //             type: 'collapse',
  //             icon: 'feather icon-home',
  //             children: [
  //               { id: 'inicio', title: 'PLATAFORMA.INICIO_APPS', type: 'item', url: this.getAbsoluteUrl('/frontal/inicio') },
  //               { id: 'login', title: 'PLATAFORMA.LOGIN_FRONTAL', type: 'item', url: this.getAbsoluteUrl('/frontal/login') }
  //             ]
  //           },
  //           //... (continuar con Sites, Usuarios, AdministracionBD, Aplicaciones, Suscriptor, Licencias, Logs, HelpDesk, Roles)
  //           {
  //             id: 'sites',
  //             title: 'PLATAFORMA.SITES',
  //             type: 'collapse',
  //             icon: 'feather icon-home',
  //             children: [
  //               { id: 'sites', title: 'PLATAFORMA.SITES_LISTADO', type: 'item', url: this.getAbsoluteUrl('/sites/sites') },
  //               { id: 'enlaces', title: 'PLATAFORMA.ENLACES', type: 'item', url: this.getAbsoluteUrl('/sites/enlaces') },
  //               { id: 'contenidos', title: 'PLATAFORMA.CONTENIDOS', type: 'item', url: this.getAbsoluteUrl('/sites/contenidos') }
  //             ]
  //           },
  //           {
  //             id: 'usuarios',
  //             title: 'PLATAFORMA.USUARIOS',
  //             type: 'collapse',
  //             icon: 'feather icon-home',
  //             children: [
  //               { id: 'usuarios', title: 'PLATAFORMA.USUARIOS_LISTADO', type: 'item', url: this.getAbsoluteUrl('/usuarios/usuarios') }
  //             ]
  //           },
  //           {
  //             id: 'administracion-bd',
  //             title: 'PLATAFORMA.ADMINISTRADORBD',
  //             type: 'collapse',
  //             icon: 'feather icon-home',
  //             children: [
  //               { id: 'servidores', title: 'PLATAFORMA.SERVIDORES', type: 'item', url: this.getAbsoluteUrl('/administracion-bd/servidores') },
  //               { id: 'conexiones', title: 'PLATAFORMA.CONEXIONES', type: 'item', url: this.getAbsoluteUrl('/administracion-bd/conexiones') },
  //               { id: 'scripts', title: 'PLATAFORMA.SCRIPTS', type: 'item', url: this.getAbsoluteUrl('/administracion-bd/scripts') },
  //               {
  //                 id: 'log-actividades',
  //                 title: 'PLATAFORMA.LOG_ACTIVIDADES_BD',
  //                 type: 'item',
  //                 url: this.getAbsoluteUrl('/administracion-bd/log-actividades')
  //               },
  //               {
  //                 id: 'estadisticas',
  //                 title: 'PLATAFORMA.ESTADISTICAS_BD',
  //                 type: 'item',
  //                 url: this.getAbsoluteUrl('/administracion-bd/estadisticas')
  //               }
  //             ]
  //           },
  //           {
  //             id: 'aplicaciones',
  //             title: 'PLATAFORMA.APLICACIONES',
  //             type: 'collapse',
  //             icon: 'feather icon-home',
  //             children: [
  //               {
  //                 id: 'aplicaciones',
  //                 title: 'PLATAFORMA.APLICACIONES_LISTADO',
  //                 type: 'item',
  //                 url: this.getAbsoluteUrl('/aplicaciones/aplicaciones')
  //               },
  //               { id: 'suites', title: 'PLATAFORMA.SUITES', type: 'item', url: this.getAbsoluteUrl('/aplicaciones/suites') },
  //               { id: 'modulos', title: 'PLATAFORMA.MODULOS', type: 'item', url: this.getAbsoluteUrl('/aplicaciones/modulos') },
  //               { id: 'versiones', title: 'PLATAFORMA.VERSIONES', type: 'item', url: this.getAbsoluteUrl('/aplicaciones/versiones') },
  //               { id: 'paquetes', title: 'PLATAFORMA.PAQUETES', type: 'item', url: this.getAbsoluteUrl('/aplicaciones/paquetes') },
  //               {
  //                 id: 'log-actividades',
  //                 title: 'PLATAFORMA.LOG_ACTIVIDADES_APP',
  //                 type: 'item',
  //                 url: this.getAbsoluteUrl('/aplicaciones/log-actividades')
  //               },
  //               {
  //                 id: 'log-excepciones',
  //                 title: 'PLATAFORMA.LOG_EXCEPCIONES',
  //                 type: 'item',
  //                 url: this.getAbsoluteUrl('/aplicaciones/log-excepciones')
  //               },
  //               {
  //                 id: 'estadisticas',
  //                 title: 'PLATAFORMA.ESTADISTICAS_APP',
  //                 type: 'item',
  //                 url: this.getAbsoluteUrl('/aplicaciones/estadisticas')
  //               }
  //             ]
  //           },
  //           {
  //             id: 'suscriptor',
  //             title: 'PLATAFORMA.SUSCRIPTORES',
  //             type: 'collapse',
  //             icon: 'feather icon-home',
  //             children: [
  //               {
  //                 id: 'suscriptores',
  //                 title: 'PLATAFORMA.SUSCRIPTORES_LISTADO',
  //                 type: 'item',
  //                 url: this.getAbsoluteUrl('/suscriptor/suscriptores')
  //               },
  //               { id: 'empresas', title: 'PLATAFORMA.EMPRESAS', type: 'item', url: this.getAbsoluteUrl('/suscriptor/empresas') },
  //               {
  //                 id: 'usuarios-suscriptor',
  //                 title: 'PLATAFORMA.USUARIOS_SUSCRIPTOR',
  //                 type: 'item',
  //                 url: this.getAbsoluteUrl('/suscriptor/usuarios-suscriptor')
  //               }
  //             ]
  //           },
  //           {
  //             id: 'licencias',
  //             title: 'PLATAFORMA.LICENCIAS',
  //             type: 'collapse',
  //             icon: 'feather icon-monitor',
  //             children: [
  //               {
  //                 id: 'licencias-afiliado',
  //                 title: 'PLATAFORMA.LICENCIAS_AFILIADO',
  //                 type: 'item',
  //                 url: this.getAbsoluteUrl('/licencias/licencias-afiliado')
  //               },
  //               {
  //                 id: 'adiciones-sustracciones',
  //                 title: 'PLATAFORMA.ADICIONES_SUSTRACCIONES',
  //                 type: 'item',
  //                 url: this.getAbsoluteUrl('/licencias/adiciones-sustracciones')
  //               },
  //               {
  //                 id: 'historial-pagos',
  //                 title: 'PLATAFORMA.HISTORIAL_PAGOS',
  //                 type: 'item',
  //                 url: this.getAbsoluteUrl('/licencias/historial-pagos')
  //               }
  //             ]
  //           },
  //           {
  //             id: 'logs',
  //             title: 'PLATAFORMA.LOGS',
  //             type: 'collapse',
  //             icon: 'feather icon-monitor',
  //             children: [
  //               {
  //                 id: 'log-actividades',
  //                 title: 'PLATAFORMA.LOG_ACTIVIDADES_GENERAL',
  //                 type: 'item',
  //                 url: this.getAbsoluteUrl('/logs/log-actividades')
  //               },
  //               {
  //                 id: 'log-actualizaciones',
  //                 title: 'PLATAFORMA.LOG_ACTUALIZACIONES',
  //                 type: 'item',
  //                 url: this.getAbsoluteUrl('/logs/log-actualizaciones')
  //               },
  //               {
  //                 id: 'log-transacciones',
  //                 title: 'PLATAFORMA.LOG_TRANSACCIONES',
  //                 type: 'item',
  //                 url: this.getAbsoluteUrl('/logs/log-transacciones')
  //               },
  //               { id: 'estadisticas', title: 'PLATAFORMA.ESTADISTICAS_LOGS', type: 'item', url: this.getAbsoluteUrl('/logs/estadisticas') }
  //             ]
  //           },
  //           {
  //             id: 'help-desk',
  //             title: 'PLATAFORMA.HELP_DESK',
  //             type: 'collapse',
  //             icon: 'feather icon-monitor',
  //             children: [
  //               {
  //                 id: 'estadisticas',
  //                 title: 'PLATAFORMA.ESTADISTICAS_HD',
  //                 type: 'item',
  //                 url: this.getAbsoluteUrl('/help-desk/estadisticas')
  //               },
  //               {
  //                 id: 'requerimientos',
  //                 title: 'PLATAFORMA.REQUERIMIENTOS',
  //                 type: 'item',
  //                 url: this.getAbsoluteUrl('/help-desk/requerimientos')
  //               },
  //               { id: 'seguimientos', title: 'PLATAFORMA.SEGUIMIENTOS', type: 'item', url: this.getAbsoluteUrl('/help-desk/seguimientos') },
  //               { id: 'tickets', title: 'PLATAFORMA.TICKETS', type: 'item', url: this.getAbsoluteUrl('/help-desk/tickets') }
  //             ]
  //           },
  //           {
  //             id: 'roles',
  //             title: 'PLATAFORMA.ROLES',
  //             type: 'collapse',
  //             icon: 'feather icon-monitor',
  //             children: [
  //               { id: 'roles', title: 'PLATAFORMA.ROLES_LISTADO', type: 'item', url: this.getAbsoluteUrl('/roles/roles') },
  //               { id: 'roles-usuarios', title: 'PLATAFORMA.ROLES_USUARIOS', type: 'item', url: this.getAbsoluteUrl('/roles/roles-usuarios') }
  //             ]
  //           }
  //         ]
  //       }
  //     ];
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
  //             url: this.getAbsoluteUrl('/helpdesk/tickets'),
  //             icon: 'feather icon-tag'
  //           },
  //           {
  //             id: 'estadisticas',
  //             title: 'HELPDESK.ESTADISTICAS',
  //             type: 'item',
  //             url: this.getAbsoluteUrl('/helpdesk/estadisticas'),
  //             icon: 'feather icon-pie-chart'
  //           }
  //         ]
  //       }
  //     ];
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
  //           // ... (Resto de tu menú estático) ...
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

  getNavigationItems (): void {
    //// console.log('2');
    this.aplicacion = this._localStorageService.getAplicaicionLocalStorage()
    this.suite = this._localStorageService.getSuiteLocalStorage()
    const codigoApp = this.aplicacion.codigoAplicacion
    // console.log('==============codigo aplicacion', codigoApp);
    switch (codigoApp) {
      case 'e1a8fa99-15db-479b-a0a4-9c2be72273b5':
        this._modulosService.getRegistros().subscribe(data => {
          const nuevosModulos = data.modulos
          if (nuevosModulos.length > 0) {
            const ordenado = nuevosModulos.sort((a: any, b: any) => a.nombreModulo - b.nombreModulo)
            const menu = this.getAplicacionSuiteItems(ordenado)
            this.menuSubject.next(menu)
          } else {
            this.menuSubject.next([])
          }
        })
        break
      default:
        this.menuSubject.next([])
        break
    }
  }

  navigateNodoMenu (url: any) {
    // const bibliotecas = this._bibliotecasService.getBibliotecasActuales()
    const modulos = this._modulosService.getModulosActuales()
    const modulo = modulos.filter(x => x.codigoModulo == url.id)[0]
    // const biblio = bibliotecas.filter(x => x.codigoModulo == url.id)[0]
    // console.log('bibioteca', biblio);

    if (modulo) {
    //   modulo.codigoBiblioteca = biblio.codigoBiblioteca || ''
    //   modulo.nomBiblioteca = biblio.nombreBiblioteca || ''
      this._localStorageService.setModuloLocalStorage(modulo)
    }
    if (modulo.codigoModulo !== undefined) {
      this.router.navigate([modulo.rutaModulo], { queryParams: { regId: modulo.codigoModulo } })
    } else {
      this.router.navigate([modulo.rutaModulo])
    }
  }
}
