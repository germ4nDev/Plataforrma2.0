// Angular Import
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'usuarios',
        loadComponent: () => import('./usuarios/usuarios.component').then(m => m.UsuariosComponent)
      },
      {
        path: 'gestion-usuario',
        loadComponent: () => import('./usuarios/gestion-usuario/gestion-usuario.component').then(m => m.GestionUsuarioComponent)
      },
      {
        path: 'roles-usuarios',
        loadComponent: () => import('./roles-usuarios/roles-usuarios.component').then(m => m.RolesUsuariosComponent)
      },
      {
        path: 'gestion-roles-usuario',
        loadComponent: () => import('./roles-usuarios/gestion-roles-usuario/gestion-roles-usuario.component').then(m => m.GestionRolesUsuarioComponent)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsuariosRoutingModule {}
