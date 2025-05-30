import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'conexiones',
        loadComponent: () => import('./conexiones/conexiones.component').then(m => m.ConexionesComponent)
      },
      {
        path: 'gestion-conexion',
        loadComponent: () => import('./conexiones/gestion-conexion/gestion-conexion.component').then(m => m.GestionConexionComponent)
      },
      {
        path: 'log-actividades',
        loadComponent: () => import('./log-actividades/log-actividades.component').then(m => m.LogActividadesComponent)
      },
      {
        path: 'scripts',
        loadComponent: () => import('./scripts/scripts.component').then(m => m.ScriptsComponent)
      },
      {
        path: 'gestion-script',
        loadComponent: () => import('./scripts/gestion-script/gestion-script.component').then(m => m.GestionScriptComponent)
      },
      {
        path: 'servidores',
        loadComponent: () => import('./servidores/servidores.component').then(m => m.ServidoresComponent)
      },
      {
        path: 'gestion-servidor',
        loadComponent: () => import('./servidores/gestion-servidor/gestion-servidor.component').then(m => m.GestionServidorComponent)
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
export class AdministracionBDRoutingModule {}
