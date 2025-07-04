import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AplicacionesRoutingModule } from './aplicaciones-routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { BreadcrumbComponent } from 'src/app/theme/shared/components/breadcrumb/breadcrumb.component';

@NgModule({
    declarations: [],
    imports: [
        CommonModule, AplicacionesRoutingModule, TranslateModule
    ],
    providers: [BreadcrumbComponent]
})
export class AplicacionesModule { }
