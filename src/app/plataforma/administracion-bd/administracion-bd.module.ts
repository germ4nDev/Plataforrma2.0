import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdministracionBDRoutingModule } from './administracion-bd-routing.module';
import { BreadcrumbComponent } from 'src/app/theme/shared/components/breadcrumb/breadcrumb.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule, AdministracionBDRoutingModule
  ],
        providers: [BreadcrumbComponent]
})
export class AdministracionBDModule { }
