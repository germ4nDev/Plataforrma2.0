// Angular Import
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'bt-basic',
        loadComponent: () => import('./tbl-basic/tbl-basic.component')
      },
      {
        path: 'bt-border',
        loadComponent: () => import('./tbl-border/tbl-border.component')
      },
      {
        path: 'bt-sizing',
        loadComponent: () => import('./tbl-sizing/tbl-sizing.component')
      },
      {
        path: 'bt-styling',
        loadComponent: () => import('./tbl-styling/tbl-styling.component')
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TblBootstrapRoutingModule {}
