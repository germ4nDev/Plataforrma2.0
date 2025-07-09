// Angular Import
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'roles',
        loadComponent: () => import('./roles/roles.component').then((m) => m.RolesComponent)
      },
      {
        path: 'gestion-roles',
        loadComponent: () => import('./roles/gestion-roles/gestion-roles.component').then((m) => m.GestionRolesComponent)
      },
      {
        path: 'roles-usuarios',
        loadComponent: () => import('./roles-usuarios/roles-usuarios.component').then((m) => m.RolesUsuariosComponent)
      },
      {
        path: 'gestion-roles-usuario',
        loadComponent: () => import('./roles-usuarios/gestion-roles-usuario/gestion-roles-usuario.component').then((m) => m.GestionRolesUsuarioComponent)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RolesRoutingModule {}
