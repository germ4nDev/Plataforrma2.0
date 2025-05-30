// Angular Import
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    children: [
        {
            path: 'roles',
            loadComponent: () => import('./roles/roles.component').then(m => m.RolesComponent)
        },
        {
            path: 'roles-usuarios',
            loadComponent: () => import('./roles-usuarios/roles-usuarios.component').then(m => m.RolesUsuariosComponent)
        }

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RolesRoutingModule {}
