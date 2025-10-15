// Angular Import
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'colores-nav',
        loadComponent: () => import('./colores-nav/colores-nav.component').then(m => m.ColoresNavComponent)
      },
      {
        path: 'slider-inicio',
        loadComponent: () => import('./slider-inicio/slider-inicio.component').then(m => m.SliderInicioComponent)
      },
      {
        path: 'gestion-slider',
        loadComponent: () => import('./slider-inicio/gestion-slider/gestion-slider.component').then(m => m.GestionSliderComponent)
      },
      {
        path: 'gestion-color',
        loadComponent: () => import('./colores-nav/gestion-color/gestion-color.component').then(m => m.GestionColorComponent)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UtilidadesRoutingModule {}
