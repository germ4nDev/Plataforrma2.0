import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SitesRoutingModule } from './sites-routing.module';
import { SharedModule } from '../../theme/shared/shared.module';
import { BreadcrumbComponent } from 'src/app/theme/shared/components/breadcrumb/breadcrumb.component';

@NgModule({
  imports: [
    CommonModule, SitesRoutingModule, SharedModule
  ],
  declarations: [],
  providers: [BreadcrumbComponent]
})
export class SitesModule { }
