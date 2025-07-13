export interface NavigationItem {
  id: string;
  title: string;
  type: 'item' | 'collapse' | 'group';
  translate?: string;
  icon?: string;
  hidden?: boolean;
  url?: string;
  classes?: string;
  exactMatch?: boolean;
  external?: boolean;
  target?: boolean;
  breadcrumbs?: boolean;
  badge?: {
    title?: string;
    type?: string;
  };
  children?: NavigationItem[];
}

export const NavigationItems: NavigationItem[] = [
  {
    id: 'plataforma',
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
