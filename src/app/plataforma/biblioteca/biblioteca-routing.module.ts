// Angular Import
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    // component: LayoutComponent,
    children: [
      {
        path: 'biblioteca',
        loadComponent: () => import('./biblioteca/biblioteca.component').then((m) => m.BibliotecaComponent)
      },
      {
        path: 'gestion-biblioteca',
        loadComponent: () =>
          import('./biblioteca/gestion-biblioteca/gestion-biblioteca.component').then((m) => m.GestionBibliotecaComponent)
      },
      {
        path: 'galeria',
        loadComponent: () => import('./galeria/galeria.component').then((m) => m.GaleriaComponent)
      },
      {
        path: 'galeria/gestion-galeria',
        loadComponent: () => import('./galeria/gestion-galeria/gestion-galeria.component').then((m) => m.GestionGaleriaComponent)
      },
      {
        path: 'tiposGaleria',
        loadComponent: () => import('./tiposGaleria/tipos-galeria.component').then((m) => m.TiposGaleriaComponent)
      },
      {
        path: 'gestion-tipos-galeria',
        loadComponent: () =>
          import('./tiposGaleria/gestion-tiposGaleria/gestion-tipos-galeria.component').then(
            (m) => m.GestionTiposGaleriaComponent
          )
      },
      {
        path: 'formatos-galeria',
        loadComponent: () => import('./formatosGaleria/formatos-galeria.component').then((m) => m.FormatosGaleriaComponent)
      },
      {
        path: 'gestion-formatos-galeria',
        loadComponent: () =>
          import('./formatosGaleria/gestion-formatosGaleria/gestion-formatos-galeria.component').then(
            (m) => m.GestionFormatosGaleriaComponent
          )
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BibliotecaRoutingModule {}
