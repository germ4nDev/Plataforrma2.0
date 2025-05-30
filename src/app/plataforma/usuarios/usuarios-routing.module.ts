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
            path: 'gestion-password',
            loadComponent: () => import('./usuarios/gestion-password/gestion-password.component').then(m => m.GestionPasswordComponent)
        }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsuariosRoutingModule {}
