// Angular Import
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from 'src/app/theme/shared/components/layout/layout.component';

const routes: Routes = [
  {
    path: '',
    // component: LayoutComponent,
    children: [
      {
        path: 'aplicaciones',
        loadComponent: () => import('./aplicaciones/aplicaciones.component').then((m) => m.AplicacionesComponent)
      },
      {
        path: 'log-actividades',
        loadComponent: () => import('./log-actividades/log-actividades.component').then((m) => m.LogActividadesComponent)
      },
      {
        path: 'log-excepciones',
        loadComponent: () => import('./log-excepciones/log-excepciones.component').then((m) => m.LogExcepcionesComponent)
      },
      {
        path: 'gestion-aplicacion',
        loadComponent: () =>
          import('./aplicaciones/gestion-aplicacion/gestion-aplicacion.component').then((m) => m.GestionAplicacionComponent)
      },
      {
        path: 'suites',
        loadComponent: () => import('./suites/suites.component').then((m) => m.SuitesComponent)
      },
      {
        path: 'gestion-suite',
        loadComponent: () => import('./suites/gestion-suite/gestion-suite.component').then((m) => m.GestionSuiteComponent)
      },
      {
        path: 'modulos',
        loadComponent: () => import('./modulos/modulos.component').then((m) => m.ModulosComponent)
      },
      {
        path: 'gestion-modulo',
        loadComponent: () => import('./modulos/gestion-modulo/gestion-modulo.component').then((m) => m.GestionModuloComponent)
      },
      {
        path: 'versiones',
        loadComponent: () => import('./versiones/versiones.component').then((m) => m.VersionesComponent)
      },
      {
        path: 'gestion-version',
        loadComponent: () => import('./versiones/gestion-version/gestion-version.component').then((m) => m.GestionVersionComponent)
      },
      {
        path: 'paquetes',
        loadComponent: () => import('./paquetes/paquetes.component').then((m) => m.PaquetesComponent)
      },
      {
        path: 'gestion-paquete',
        loadComponent: () => import('./paquetes/gestion-paquete/gestion-paquete.component').then((m) => m.GestionPaqueteComponent)
      },
      {
        path: 'estadisticas',
        loadComponent: () => import('./estadisticas/estadisticas.component').then((m) => m.EstadisticasComponent)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AplicacionesRoutingModule {}
