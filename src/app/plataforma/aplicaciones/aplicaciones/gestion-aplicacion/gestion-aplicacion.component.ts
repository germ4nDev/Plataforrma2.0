import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { DataTablesModule } from 'angular-datatables';

// project import
import { BreadcrumbComponent } from '../../../../theme/shared/components/breadcrumb/breadcrumb.component';
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
    selector: 'app-gestion-aplicacion',
    standalone: true,
    imports: [CommonModule, DataTablesModule, SharedModule, BreadcrumbComponent],
    templateUrl: './gestion-aplicacion.component.html',
    styleUrl: './gestion-aplicacion.component.scss'
})
export class GestionAplicacionComponent {
    isSubmit = false;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private BreadCrumb: BreadcrumbComponent,
    ) {
        this.isSubmit = false;
    }
}
