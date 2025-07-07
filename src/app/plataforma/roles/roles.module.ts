import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RolesRoutingModule } from './roles-routing.module';
import { BreadcrumbComponent } from 'src/app/theme/shared/components/breadcrumb/breadcrumb.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule, RolesRoutingModule
  ],
  providers: [BreadcrumbComponent]
})
export class RolesModule { }
