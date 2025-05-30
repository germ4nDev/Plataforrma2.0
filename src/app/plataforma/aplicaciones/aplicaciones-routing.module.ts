// Angular Import
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'aplicaciones',
        loadComponent: () => import('./aplicaciones/aplicaciones.component').then(m => m.AplicacionesComponent)
      },
      {
        path: 'log-actividades',
        loadComponent: () => import('./log-actividades/log-actividades.component').then(m => m.LogActividadesComponent)
      },
      {
        path: 'log-excepciones',
        loadComponent: () => import('./log-excepciones/log-excepciones.component').then(m => m.LogExcepcionesComponent)
      },
      {
        path: 'gestion-aplicacion',
        loadComponent: () => import('./aplicaciones/gestion-aplicacion/gestion-aplicacion.component').then(m => m.GestionAplicacionComponent)
      },
      {
        path: 'modulos',
        loadComponent: () => import('./modulos/modulos.component').then(m => m.ModulosComponent)
      },
      {
        path: 'modulos',
        loadComponent: () => import('./modulos/gestion-modulo/gestion-modulo.component').then(m => m.GestionModuloComponent)
      },
      {
        path: 'versiones',
        loadComponent: () => import('./versiones/versiones.component').then(m => m.VersionesComponent)
      },
      {
        path: 'gestion-version',
        loadComponent: () => import('./versiones/gestion-version/gestion-version.component').then(m => m.GestionVersionComponent)
      },
      {
        path: 'paquetes',
        loadComponent: () => import('./paquetes/paquetes.component').then(m => m.PaquetesComponent)
      },
      {
        path: 'paquetes',
        loadComponent: () => import('./paquetes/gestion-paquete/gestion-paquete.component').then(m => m.GestionPaqueteComponent)
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
export class AplicacionesRoutingModule {}
