import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NarikCustomValidatorsModule } from '@narik/custom-validators';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { PTLContenidosELService } from 'src/app/theme/shared/service/ptlcontenidos-el.service';
import { BreadcrumbComponent } from 'src/app/theme/shared/components/breadcrumb/breadcrumb.component';

export class FormContenido {
    contenidoId!: number;
    enlaceId!: number;
    nombreContenido!: string;
    descripcionContenido!: string;
    contenido!: string;
    estadoContenido!: boolean;
}

@Component({
  selector: 'app-new-contenido',
  standalone: true,
  imports: [CommonModule, SharedModule, NarikCustomValidatorsModule],
  templateUrl: './new-contenido.component.html',
  styleUrl: './new-contenido.component.scss'
})
export class NewContenidoComponent implements OnInit {
  FormContenido!: FormContenido;
  form: undefined;
  isSubmit: boolean;
  modoEdicion: boolean = false;

  constructor(private router: Router,
    private route : ActivatedRoute,
    private contenidoService : PTLContenidosELService,
    private BreadCrumb : BreadcrumbComponent
  ) {
    this.isSubmit = false;
  }

  ngOnInit() {
      this.BreadCrumb.setBreadcrumb();
      this.route.queryParams.subscribe(params => {
        const id = params['contenidoId'];
        console.log('me llena el Id', id);

        if (id) {
          this.modoEdicion = true;
          this.contenidoService.getContenidoById(+id).subscribe({
            next: (resp: any) => {
              this.FormContenido = resp.data;
            },
            error: () => {
              Swal.fire('Error', 'No se pudo obtener el contenido', 'error');
            }
          });
        }
        else {
          this.modoEdicion = false;
          this.FormContenido = {
            contenidoId: 0,
            enlaceId: 0,
            nombreContenido: '',
            descripcionContenido: '',
            contenido: '',
            estadoContenido: true
          };
        }
      });
    }

    btnInsertEditContenido(form: any) {
      this.isSubmit = true;

      if (!form.valid) {
        return;
      }

      if (this.modoEdicion) {
          this.contenidoService.modificarContenido(this.FormContenido).subscribe({
            next: (resp: any) => {
              if (resp.ok) {
                Swal.fire('', 'El contenido se modificó correctamente', 'success');
                this.router.navigate(['/sites/contenidos']);
              } else {
                Swal.fire('Error', resp.message || 'No se pudo actualizar el contenido', 'error');
              }
            },
            error: (err: any) => {
              console.error(err);
              Swal.fire('Error', 'No se pudo actualizar el contenido', 'error');
            }
          });
        }
        else
        {
          this.contenidoService.insertarContenido(this.FormContenido).subscribe({
              next: (resp:any) => {
                if (resp.ok) {
                  Swal.fire('', 'El contenido se insertó correctamente', 'success');
                  form.resetForm();
                  this.isSubmit = false;
                  this.router.navigate(['/sites/contenidos']);
                }
              },
              error: (err:any) => {
                console.error(err);
                Swal.fire('Error', 'No se pudo insertar el contenido', 'error');
              }
            });
        }
    }

    btnRegresarContenido() {
      this.router.navigate(['/sites/contenidos']);
    }
}
