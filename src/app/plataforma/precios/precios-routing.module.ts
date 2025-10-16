// Angular Import
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'precios-unitarios',
        loadComponent: () => import('./precios-unitarios/precios-unitarios.component').then((m) => m.PreciosUnitariosComponent)
      },
      {
        path: 'gestion=precio',
        loadComponent: () => import('./precios-unitarios/gestion-precio/gestion-precio.component').then((m) => m.GestionPrecioComponent)
      },
            {
        path: 'tipos-valor',
        loadComponent: () => import('./tipos-valor/tipos-valor.component').then((m) => m.TiposValorComponent)
      },
      {
        path: 'gestion=tipo',
        loadComponent: () => import('./tipos-valor/gestion-tipo/gestion-tipo.component').then((m) => m.GestionTipoComponent)
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PreciosRoutingModule {}
