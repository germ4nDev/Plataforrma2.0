import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'suscriptores',
        loadComponent: () => import('./suscriptores/suscriptores.component').then(m => m.SuscriptoresComponent)
      },
      {
        path: 'gestion-suscriptor',
        loadComponent: () => import('./suscriptores/gestion-suscriptor/gestion-suscriptor.component').then(m => m.GestionSuscriptorComponent)
      },
      {
        path: 'estadisticas',
        loadComponent: () => import('./suscriptores/estadisticas/estadisticas.component').then(m => m.EstadisticasComponent)
      },
      {
        path: 'empresas',
        loadComponent: () => import('./empresas/empresas.component').then(m => m.EmpresasComponent)
      },
      {
        path: 'usuarios-empresa',
        loadComponent: () => import('./empresas/usuarios-empresa/usuarios-empresa.component').then(m => m.UsuariosEmpresaComponent)
      },
      {
        path: 'gestion-empresa',
        loadComponent: () => import('./empresas/gestion-empresa/gestion-empresa.component').then(m => m.GestionEmpresaComponent)
      },
      {
        path: 'usuarios-suscriptor',
        loadComponent: () => import('./usuarios-suscriptor/usuarios-suscriptor.component').then(m => m.UsuariosSuscriptorComponent)
      },
      {
        path: 'gestion-usuario-suscriptor',
        loadComponent: () => import('./usuarios-suscriptor/gestion-usuario-suscrptor/gestion-usuario-suscrptor.component').then(m => m.GestionUsuarioSuscrptorComponent)
      },
      {
        path: 'gestion-usuario-suscriptor',
        loadComponent: () => import('./usuarios-suscriptor/gestion-perfil/gestion-perfil.component').then(m => m.GestionPerfilComponent)
      },
      {
        path: 'gestion-usuario-suscriptor',
        loadComponent: () => import('./usuarios-suscriptor/gestiop-claves/gestiop-claves.component').then(m => m.GestiopClavesComponent)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SuscriptorRoutingModule {}
