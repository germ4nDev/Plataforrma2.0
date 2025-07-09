
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';

// third party
import { NarikCustomValidatorsModule } from '@narik/custom-validators';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadcrumbComponent } from 'src/app/theme/shared/components/breadcrumb/breadcrumb.component';
import { PTLEnlacesSTService } from 'src/app/theme/shared/service/ptlenlaces-st.service';
import { PTLEnlaceSTModel } from 'src/app/theme/shared/_helpers/models/PTLEnlaceST.model';
import Swal from 'sweetalert2';
import { PTLSitiosAPModel } from 'src/app/theme/shared/_helpers/models/PTLSitioAP.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-gestion-enlace',
  standalone: true,
  imports: [CommonModule, SharedModule, NarikCustomValidatorsModule],
  templateUrl: './gestion-enlace.component.html',
  styleUrl: './gestion-enlace.component.scss'
})
export class GestionEnlaceComponent {

    // private props
    FormRegistro: PTLEnlaceSTModel = new PTLEnlaceSTModel();
    form: undefined;
    isSubmit: boolean;
    modoEdicion: boolean = false;
    sitiosSub?: Subscription;
    sitios: PTLSitiosAPModel[] = [];

    // constructor
    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private BreadCrumb: BreadcrumbComponent,
        private enlacesService: PTLEnlacesSTService) {
        this.isSubmit = false;
    }

    // ngOnInit() {
    //     this.BreadCrumb.setBreadcrumb();
    //     this.route.queryParams.subscribe(params => {
    //         const id = params['enlaceId'];
    //         console.log('me llena el Id', id);

    //         if (id) {
    //             this.modoEdicion = true;
    //             this.enlacesService.getEnlaceById(id).subscribe({
    //                 next: (resp: any) => {
    //                     this.FormRegistro = resp.data;
    //                 },
    //                 error: () => {
    //                     Swal.fire('Error', 'No se pudo obtener el enlace', 'error');
    //                 }
    //             });
    //         }
    //         else {
    //             this.modoEdicion = false;
    //             this.FormRegistro = {
    //                 enlaceId: 0,
    //                 sitioId: 0,
    //                 nombreEnlace: '',
    //                 descripcionEnlace: '',
    //                 rutaEnlace: '',
    //                 estadoEnlace: true
    //             };
    //         }
    //     });
    // }
      ngOnInit() {
        this.BreadCrumb.setBreadcrumb();
        this.route.queryParams.subscribe((params) => {
          const id = params['regId'];
          console.log('me llena el Id', id);
          if (id) {
            this.modoEdicion = true;
            this.enlacesService.getEnlaceById(id).subscribe({
              next: (resp: any) => {
                this.FormRegistro = resp.enlace;
                console.log('respuesta componente', this.FormRegistro);
              },
              error: () => {
                Swal.fire('Error', 'No se pudo obtener el enlace', 'error');
              }
            });
          } else {
            this.modoEdicion = false;
          }
        });
      }

    btnInsertEditEnlace(form: any) {
        this.isSubmit = true;

        if (!form.valid) {
            return;
        }

        if (this.modoEdicion) {
            this.enlacesService.modificarEnlaces(this.FormRegistro).subscribe({
                next: (resp: any) => {
                    if (resp.ok) {
                        Swal.fire('', 'El enlace se modificó correctamente', 'success');
                        this.router.navigate(['/sites/enlaces']);
                    } else {
                        Swal.fire('Error', resp.message || 'No se pudo actualizar el sitio', 'error');
                    }
                },
                error: (err: any) => {
                    console.error(err);
                    Swal.fire('Error', 'No se pudo actualizar el enlace', 'error');
                }
            });
        }
        else {
            this.enlacesService.insertarEnlace(this.FormRegistro).subscribe({
                next: (resp: any) => {
                    if (resp.ok) {
                        Swal.fire('', 'El enlace se insertó correctamente', 'success');
                        form.resetForm();
                        this.isSubmit = false;
                        this.router.navigate(['/sites/enlaces']);
                    }
                },
                error: (err: any) => {
                    console.error(err);
                    Swal.fire('Error', 'No se pudo insertar el enlace', 'error');
                }
            });
        }
    }

    btnRegresarEnlace() {
        this.router.navigate(['/sites/enlaces']);
    }
}
