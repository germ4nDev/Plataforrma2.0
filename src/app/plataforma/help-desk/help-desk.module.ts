import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HelpDeskRoutingModule } from './help-desk-routing.module';
import { BreadcrumbComponent } from 'src/app/theme/shared/components/breadcrumb/breadcrumb.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule, HelpDeskRoutingModule
  ],
      providers: [BreadcrumbComponent]
})
export class HelpDeskModule { }
