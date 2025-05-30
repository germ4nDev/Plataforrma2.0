// Angular Import
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// project import
import { AdminComponent } from './theme/layout/admin/admin.component';
import { GuestComponent } from './theme/layout/guest/guest.component';

const routes: Routes = [
    {
        path: '',
        component: AdminComponent,
        children: [
            {
                path: '',
                redirectTo: '/autenticacion/login',
                pathMatch: 'full'
            },
            // {
            //     path: 'dashboard',
            //     loadChildren: () => import('./demo/dashboard/dashboard.module').then((module) => module.DashboardModule)
            // },
            // {
            //     path: 'widget',
            //     loadChildren: () => import('./demo/widget/widget.module').then((module) => module.WidgetModule)
            // },
            // {
            //     path: 'users',
            //     loadChildren: () => import('./demo/users/users.module').then((module) => module.UsersModule)
            // },
            // {
            //     path: 'basic',
            //     loadChildren: () => import('./demo/ui-elements/ui-basic/ui-basic.module').then((module) => module.UiBasicModule)
            // },
            // {
            //     path: 'advance',
            //     loadChildren: () => import('./demo/ui-elements/ui-advance/ui-advance.module').then((module) => module.UiAdvanceModule)
            // },
            // {
            //     path: 'forms',
            //     loadChildren: () => import('./demo/forms/forms.module').then((module) => module.FormsModule)
            // },
            // {
            //     path: 'charts',
            //     loadChildren: () => import('./demo/chart-maps/core-chart/core-chart.module').then((module) => module.CoreChartModule)
            // },
            // {
            //     path: 'maps',
            //     loadChildren: () => import('./demo/chart-maps/core-maps/core-maps.module').then((module) => module.CoreMapsModule)
            // },
            // {
            //     path: 'email',
            //     loadChildren: () => import('./demo/application/email/email.module').then((module) => module.EmailModule)
            // },
            // {
            //     path: 'task',
            //     loadChildren: () => import('./demo/application/task/task.module').then((module) => module.TaskModule)
            // },
            // {
            //     path: 'todo',
            //     loadChildren: () => import('./demo/application/todo/todo.module').then((module) => module.TodoModule)
            // },
            // {
            //     path: 'gallery',
            //     loadChildren: () => import('./demo/application/gallery/gallery.module').then((module) => module.GalleryModule)
            // },
            // {
            //     path: 'helpdesk',
            //     loadChildren: () => import('./demo/application/helpdesk/helpdesk.module').then((module) => module.HelpdeskModule)
            // },
            // {
            //     path: 'editor',
            //     loadChildren: () => import('./demo/extension/editor/editor.module').then((module) => module.EditorModule)
            // },
            // {
            //     path: 'invoice',
            //     loadChildren: () => import('./demo/extension/invoice/invoice.module').then((module) => module.InvoiceModule)
            // },
            // {
            //     path: 'full-calendar',
            //     loadChildren: () =>
            //         import('./demo/extension/full-event-calendar/full-event-calendar.module').then((module) => module.FullEventCalendarModule)
            // },

            //   PLATAFORMA DYM

            {
                path: 'tbl-bootstrap',
                loadChildren: () => import('./plataforma/table/tbl-bootstrap/tbl-bootstrap.module').then((module) => module.TblBootstrapModule)
            },
            {
                path: 'tbl-datatable',
                loadComponent: () => import('./plataforma/table/tbl-datatable/tbl-datatable.component')
            },
            {
                path: 'administracion-bd',
                loadChildren: () =>
                    import('./plataforma/administracion-bd/administracion-bd.module').then((module) => module.AdministracionBDModule)
            },
            {
                path: 'layout',
                loadChildren: () => import('./plataforma/layout/layout.module').then((module) => module.LayoutModule)
            },
            {
                path: 'suscriptor',
                loadChildren: () =>
                    import('./plataforma/suscriptor/suscriptor.module').then((module) => module.SuscriptorModule)
            },
            {
                path: 'aplicaciones',
                loadChildren: () =>
                    import('./plataforma/aplicaciones/aplicaciones.module').then((module) => module.AplicacionesModule)
            },
            {
                path: 'licencias',
                loadChildren: () =>
                    import('./plataforma/licencias/licencias.module').then((module) => module.LicenciasModule)
            },
            {
                path: 'sites',
                loadChildren: () =>
                    import('./plataforma/sites/sites.module').then((module) => module.SitesModule)
            },
            {
                path: 'help-desk',
                loadChildren: () =>
                    import('./plataforma/help-desk/help-desk.module').then((module) => module.HelpDeskModule)
            },
            {
                path: 'usuarios',
                loadChildren: () =>
                    import('./plataforma/usuarios/usuarios.module').then((module) => module.UsuariosModule)
            },
            {
                path: 'roles',
                loadChildren: () =>
                    import('./plataforma/roles/roles.module').then((module) => module.RolesModule)
            },
            {
                path: 'home',
                loadChildren: () =>
                    import('./plataforma/home/home.module').then((module) => module.HomeModule)
            },

            // END PLATAFORMA DYM

            // {
            //     path: 'file-upload',
            //     loadComponent: () => import('./demo/extension/file-upload/file-upload.component')
            // },
            // {
            //     path: 'sample-page',
            //     loadComponent: () => import('./demo/other/sample-page/sample-page.component')
            // }

        ]
    },
    {
        path: '',
        component: GuestComponent,
        children: [
            {
                path: 'autenticacion',
                loadChildren: () => import('./plataforma/autenticacion/autenticacion.module').then((module) => module.AutenticacionModule)
            },
            {
                path: 'frontal',
                loadChildren: () =>
                    import('./plataforma/frontal/frontal.module').then((module) => module.FrontalModule)
            },
            {
                path: 'logs',
                loadChildren: () =>
                    import('./plataforma/logs/logs.module').then((module) => module.LogsModule)
            },
            {
                path: 'maintenance',
                loadChildren: () => import('./plataforma/maintenance/maintenance.module').then((module) => module.MaintenanceModule)
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
