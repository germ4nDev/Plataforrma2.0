// Angular Import
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    children: [
        {
            path: 'inicio',
            loadComponent: () => import('./inicio/inicio.component').then(m => m.InicioComponent)
        },
        {
            path: 'launcher',
            loadComponent: () => import('./launcher/launcher.component').then(m => m.LauncherComponent)
        },
        {
            path: 'home',
            loadComponent: () => import('./home/home.component').then(m => m.HomeComponent)
        },
        {
            path: 'gestion-inicio',
            loadComponent: () => import('./inicio/gestion-inicio/gestion-inicio.component').then(m => m.GestionInicioComponent)
        }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FrontalRoutingModule {}
