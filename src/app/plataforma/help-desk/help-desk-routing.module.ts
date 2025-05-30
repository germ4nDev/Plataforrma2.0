// Angular Import
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    children: [
        {
            path: 'requerimientos',
            loadComponent: () => import('./requerimientos/requerimientos.component').then(m => m.RequerimientosComponent)
        },
        {
            path: 'gestion-requerimiento',
            loadComponent: () => import('./requerimientos/gestion-requerimiento/gestion-requerimiento.component').then(m => m.GestionRequerimientoComponent)
        },
        {
            path: 'tickets',
            loadComponent: () => import('./tickets/tickets.component').then(m => m.TicketsComponent)
        },
        {
            path: 'gestion-ticket',
            loadComponent: () => import('./tickets/gestion-ticket/gestion-ticket.component').then(m => m.GestionTicketComponent)
        },
        {
            path: 'seguimientos',
            loadComponent: () => import('./seguimientos/seguimientos.component').then(m => m.SeguimientosComponent)
        },
        {
            path: 'gestion-seguimiento',
            loadComponent: () => import('./seguimientos/gestion-seguimiento/gestion-seguimiento.component').then(m => m.GestionSeguimientoComponent)
        },
        {
            path: 'estadisticas',
            loadComponent: () => import('./estadisticas/estadisticas.component').then(m => m.EstadisticasComponent)
        }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HelpDeskRoutingModule {}
