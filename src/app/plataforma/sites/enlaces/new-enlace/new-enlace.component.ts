
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';

// third party
import { NarikCustomValidatorsModule } from '@narik/custom-validators';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadcrumbComponent } from 'src/app/theme/shared/components/breadcrumb/breadcrumb.component';
import { PTLEnlacesSTService } from 'src/app/theme/shared/service/ptlenlaces-st.service';
import Swal from 'sweetalert2';

export class FormEnlace {
  enlaceId!: number;
  sitioId!: number;
  nombreEnlace!: string;
  descripcionEnlace!: string;
  rutaEnlace!: string;
  estadoEnlace!: boolean;
}

@Component({
  selector: 'app-new-enlace',
  standalone: true,
  imports: [CommonModule, SharedModule, NarikCustomValidatorsModule],
  templateUrl: './new-enlace.component.html',
  styleUrl: './new-enlace.component.scss'
})
export class NewEnlaceComponent implements OnInit {

  // private props
  FormEnlace!: FormEnlace;
  form: undefined;
  isSubmit: boolean;
  modoEdicion: boolean = false;

  // constructor
  constructor(private router: Router,
        private route: ActivatedRoute,
        private BreadCrumb : BreadcrumbComponent,
        private enlacesService : PTLEnlacesSTService)
        {
            this.isSubmit = false;
        }

  ngOnInit() {
      this.BreadCrumb.setBreadcrumb();
      this.route.queryParams.subscribe(params => {
        const id = params['enlaceId'];
        console.log('me llena el Id', id);

        if (id) {
          this.modoEdicion = true;
          this.enlacesService.getEnlaceById(+id).subscribe({
            next: (resp: any) => {
              this.FormEnlace = resp.data;
            },
            error: () => {
              Swal.fire('Error', 'No se pudo obtener el enlace', 'error');
            }
          });
        }
        else {
          this.modoEdicion = false;
          this.FormEnlace = {
            enlaceId: 0,
            sitioId: 0,
            nombreEnlace: '',
            descripcionEnlace: '',
            rutaEnlace: '',
            estadoEnlace: true
          };
        }
      });
    }

    btnInsertEditEnlace(form: any) {
      this.isSubmit = true;

      if (!form.valid) {
        return;
      }

      if (this.modoEdicion) {
          this.enlacesService.modificarEnlaces(this.FormEnlace).subscribe({
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
        else
        {
          this.enlacesService.insertarEnlace(this.FormEnlace).subscribe({
              next: (resp:any) => {
                if (resp.ok) {
                  Swal.fire('', 'El enlace se insertó correctamente', 'success');
                  form.resetForm();
                  this.isSubmit = false;
                  this.router.navigate(['/sites/enlaces']);
                }
              },
              error: (err:any) => {
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
