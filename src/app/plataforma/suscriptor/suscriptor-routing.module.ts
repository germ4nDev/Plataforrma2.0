import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'suscriptores',
        loadComponent: () => import('./suscriptores/suscriptores.component').then((m) => m.SuscriptoresComponent)
      },
      {
        path: 'gestion-suscriptor',
        loadComponent: () =>
          import('./suscriptores/gestion-suscriptor/gestion-suscriptor.component').then((m) => m.GestionSuscriptorComponent)
      },
      {
        path: 'conexiones',
        loadComponent: () => import('./conexiones/conexiones.component').then((m) => m.ConexionesComponent)
      },
      {
        path: 'gestion-conexiones',
        loadComponent: () => import('./conexiones/gestion-conexion/gestion-conexion.component').then((m) => m.GestionConexionComponent)
      },
      {
        path: 'estadisticas',
        loadComponent: () => import('./estadisticas/estadisticas.component').then((m) => m.EstadisticasComponent)
      },
      {
        path: 'empresas',
        loadComponent: () => import('./empresas/empresas.component').then((m) => m.EmpresasComponent)
      },
      {
        path: 'usuarios-empresa',
        loadComponent: () => import('./empresas/usuarios-empresa/usuarios-empresa.component').then((m) => m.UsuariosEmpresaComponent)
      },
      {
        path: 'gestion-empresa',
        loadComponent: () => import('./empresas/gestion-empresa/gestion-empresa.component').then((m) => m.GestionEmpresaComponent)
      },
      {
        path: 'usuarios-suscriptor',
        loadComponent: () => import('./usuarios-suscriptor/usuarios-suscriptor.component').then((m) => m.UsuariosSuscriptorComponent)
      },
      {
        path: 'gestion-usuario-suscriptor',
        loadComponent: () =>
          import('./usuarios-suscriptor/gestion-usuario-suscrptor/gestion-usuario-suscrptor.component').then(
            (m) => m.GestionUsuarioSuscrptorComponent
          )
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SuscriptorRoutingModule {}
