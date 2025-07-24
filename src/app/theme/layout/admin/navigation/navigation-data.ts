import { NavigationItem } from '../../../shared/_helpers/models/Navigation.model';

export const NavigationPlataforma: NavigationItem[] = [
  {
    id: 'e1a8fa99-15db-479b-a0a4-9c2be72273b5',
    title: 'MANUAPPS.PLATAFORMA.MENU',
    type: 'group',
    icon: 'feather icon-monitor',
    children: [
      {
        id: 'autenticacion',
        title: 'MANUAPPS.PLATAFORMA.AUTENTICACION',
        type: 'collapse',
        icon: 'feather icon-home',
        children: [
          {
            id: 'logn',
            title: 'MANUAPPS.PLATAFORMA.LOGIN',
            type: 'item',
            url: '/autenticacion/login'
          },
          {
            id: 'change-password',
            title: 'MANUAPPS.PLATAFORMA.CAMBIOCLAVE',
            type: 'item',
            url: '/autenticacion/change-password'
          },
          {
            id: 'reset-password',
            title: 'MANUAPPS.PLATAFORMA.RESETCLAVE',
            type: 'item',
            url: '/autenticacion/reset-password'
          },
          {
            id: 'perfil',
            title: 'MANUAPPS.PLATAFORMA.PERFILUSUARIO',
            type: 'item',
            url: '/autenticacion/perfil'
          },
          {
            id: 'perfil-configuracion',
            title: 'MANUAPPS.PLATAFORMA.CONFIGURACIONPERFIL',
            type: 'item',
            url: '/autenticacion/perfil-configuracion'
          }
        ]
      },
      {
        id: 'home',
        title: 'HOME.MENU',
        type: 'collapse',
        icon: 'feather icon-home',
        children: [
          {
            id: 'home',
            title: 'HOME.DASHBOARD',
            type: 'item',
            url: '/home/home'
          }
        ]
      },
      {
        id: 'frontal',
        title: 'FRONTAL.MENU',
        type: 'collapse',
        icon: 'feather icon-home',
        children: [
          {
            id: 'inicio',
            title: 'FRONTAL.INICIO',
            type: 'item',
            url: '/frontal/inicio'
          },
          {
            id: 'login',
            title: 'FRONTAL.LOGIN',
            type: 'item',
            url: '/frontal/login'
          }
        ]
      },
      {
        id: 'sites',
        title: 'SITIOS.MENU',
        type: 'collapse',
        icon: 'feather icon-home',
        children: [
          {
            id: 'sites',
            title: 'SITIOS.SITIOS',
            type: 'item',
            url: '/sites/sites'
          },
          {
            id: 'enlaces',
            title: 'SITIOS.ENLACES',
            type: 'item',
            url: '/sites/enlaces'
          },
          {
            id: 'contenidos',
            title: 'SITIOS.CONTENIDOS',
            type: 'item',
            url: '/sites/contenidos'
          }
        ]
      },
      {
        id: 'usuarios',
        title: 'USUARIOS.MENU',
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

export const Suscrptor: NavigationItem[] = [
  // Otro ejemplo
];

export const BurgueApp: NavigationItem[] = [
  // Otro ejemplo
];

export const Qplus: NavigationItem[] = [
  // Otro ejemplo
];

// Navegación por defecto
export const NavigationItems: NavigationItem[] = NavigationPlataforma;
