import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NarikCustomValidatorsModule } from '@narik/custom-validators';
import { PTLSuscriptorModel } from 'src/app/theme/shared/_helpers/models/PTLSuscriptor.model';
import { BreadcrumbComponent } from 'src/app/theme/shared/components/breadcrumb/breadcrumb.component';
import { PTLSuscriptoresService } from 'src/app/theme/shared/service/ptlsuscriptores.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-gestion-suscriptor',
  standalone: true,
  imports: [CommonModule, SharedModule, NarikCustomValidatorsModule],
  templateUrl: './gestion-suscriptor.component.html',
  styleUrl: './gestion-suscriptor.component.scss'
})
export class GestionSuscriptorComponent {
 // private props
  FormRegistro: PTLSuscriptorModel = new PTLSuscriptorModel();
  form: undefined;
  isSubmit: boolean;
  modoEdicion: boolean = false;

  // constructor
  constructor(
    private router: Router,
    private suscriptoresService: PTLSuscriptoresService,
    private route: ActivatedRoute,
    private BreadCrumb: BreadcrumbComponent
  ) {
    this.isSubmit = false;
  }

  ngOnInit() {
    this.BreadCrumb.setBreadcrumb();
    // this.FormRegistro.aplicacionId = -1;
    this.route.queryParams.subscribe((params) => {
      const id = params['regId'];
      console.log('me llena el Id', id);
      if (id) {
        this.modoEdicion = true;
        this.suscriptoresService.getSuscriptorById(id).subscribe({
          next: (resp: any) => {
            this.FormRegistro = resp.suscriptor;
            console.log('respuesta componente', this.FormRegistro);
          },
          error: () => {
            Swal.fire('Error', 'No se pudo obtener el suscriptor', 'error');
          }
        });
      } else {
        this.modoEdicion = false;
      }
    });
  }

  btnInsertEditSucriptor(form: any) {
    this.isSubmit = true;
    if (!form.valid) {
      return;
    }
    if (this.modoEdicion) {
      this.suscriptoresService.actualizarSuscriptor(this.FormRegistro).subscribe({
        next: (resp: any) => {
          if (resp.ok) {
            Swal.fire('', 'El suscriptor se modificó correctamente', 'success');
            this.router.navigate(['/suscriptor/suscriptores']);
          } else {
            Swal.fire('Error', resp.message || 'No se pudo actualizar el suscriptor', 'error');
          }
        },
        error: (err: any) => {
          console.error(err);
          Swal.fire('Error', 'No se pudo actualizar el suscriptor', 'error');
        }
      });
    } else {
      this.suscriptoresService.crearSuscriptor(this.FormRegistro).subscribe({
        next: (resp: any) => {
          if (resp.ok) {
            Swal.fire('', 'El suscriptor se insertó correctamente', 'success');
            form.resetForm();
            this.isSubmit = false;
            this.router.navigate(['/suscriptor/suscriptores']);
          }
        },
        error: (err: any) => {
          console.error(err);
          Swal.fire('Error', 'No se pudo insertar el suscriptor', 'error');
        }
      });
    }
  }

  btnRegresarClick() {
    this.router.navigate(['/suscriptor/suscriptores']);
  }
}
