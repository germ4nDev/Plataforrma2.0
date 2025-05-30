import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AplicacionesRoutingModule } from './aplicaciones-routing.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [],
  imports: [
    CommonModule, AplicacionesRoutingModule, TranslateModule
  ]
})
export class AplicacionesModule { }
