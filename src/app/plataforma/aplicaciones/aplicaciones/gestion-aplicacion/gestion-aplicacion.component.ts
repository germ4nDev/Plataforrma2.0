import { Component } from '@angular/core';
import { BreadcrumbComponent } from '../../../../theme/shared/components/breadcrumb/breadcrumb.component';

@Component({
    selector: 'app-gestion-aplicacion',
    standalone: true,
    imports: [],
    templateUrl: './gestion-aplicacion.component.html',
    styleUrl: './gestion-aplicacion.component.scss'
})
export class GestionAplicacionComponent {

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private BreadCrumb: BreadcrumbComponent,
        private enlacesService: PTL) {
        this.isSubmit = false;
    }
}
