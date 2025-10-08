// Angular Import
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'inicio',
        loadComponent: () => import('./inicio/inicio.component').then((m) => m.InicioComponent)
      },
      {
        path: 'launcher',
        loadComponent: () => import('./launcher/launcher.component').then((m) => m.LauncherComponent)
      },
      {
        path: 'home',
        loadComponent: () => import('./home/home.component').then((m) => m.HomeComponent)
      },
      {
        path: 'perfil',
        loadComponent: () => import('./perfil/perfil.component').then((m) => m.PerfilComponent)
      },
      {
        path: 'lock-screen',
        loadComponent: () => import('./lock-screen/lock-screen.component').then((m) => m.LockScreenComponent)
      },
      {
        path: 'unlock-screen',
        loadComponent: () => import('./lock-screen/unlock-screen/unlock-screen.component').then((m) => m.UnlockScreenComponent)
      },
      {
        path: 'gestion-inicio',
        loadComponent: () => import('./inicio/gestion-inicio/gestion-inicio.component').then((m) => m.GestionInicioComponent)
      },
      {
        path: 'gestion-home',
        loadComponent: () => import('./home/gestion-home/gestion-home.component').then((m) => m.GestionHomeComponent)
      },
      {
        path: 'gestion-launcher',
        loadComponent: () => import('./launcher/gestion-launcher/gestion-launcher.component').then((m) => m.GestionLauncherComponent)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FrontalRoutingModule {}
