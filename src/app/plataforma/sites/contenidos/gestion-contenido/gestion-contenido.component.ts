import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NarikCustomValidatorsModule } from '@narik/custom-validators';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { PTLContenidosELService } from 'src/app/theme/shared/service/ptlcontenidos-el.service';
import { BreadcrumbComponent } from 'src/app/theme/shared/components/breadcrumb/breadcrumb.component';
import { PTLContenidoELModel } from 'src/app/theme/shared/_helpers/models/PTLContenidoEL.model';
import { PTLEnlaceSTModel } from 'src/app/theme/shared/_helpers/models/PTLEnlaceST.model';
import { catchError, of, Subscription, tap } from 'rxjs';
import { PTLEnlacesSTService } from 'src/app/theme/shared/service/ptlenlaces-st.service';

@Component({
  selector: 'app-geston-contenido',
  standalone: true,
  imports: [CommonModule, SharedModule, NarikCustomValidatorsModule],
  templateUrl: './gestion-contenido.component.html',
  styleUrl: './gestion-contenido.component.scss'
})
export class GestonContenidoComponent implements OnInit {
  FormRegistro: PTLContenidoELModel = new PTLContenidoELModel();
  form: undefined;
  isSubmit: boolean;
  modoEdicion: boolean = false;
  enlaceSub?: Subscription;
  enlaces: PTLEnlaceSTModel[] = [];

  constructor(private router: Router,
    private route : ActivatedRoute,
    private contenidoService : PTLContenidosELService,
    private enlacesService: PTLEnlacesSTService,
    private BreadCrumb : BreadcrumbComponent
  ) {
    this.isSubmit = false;
  }

  ngOnInit() {
      this.BreadCrumb.setBreadcrumb();
      this.consultarEnlaces();
      this.route.queryParams.subscribe(params => {
        const id = params['regId'];
        console.log('me llena el Id', id);

        if (id) {
          this.modoEdicion = true;
          this.contenidoService.getContenidoById(id).subscribe({
            next: (resp: any) => {
              this.FormRegistro = resp.contenido;
              console.log('respuesta componente', this.FormRegistro);
            },
            error: () => {
              Swal.fire('Error', 'No se pudo obtener el contenido', 'error');
            }
          });
        }
        else {
          this.modoEdicion = false;
        }
      });
    }

    consultarEnlaces() {
          this.enlaceSub = this.enlacesService
            .getEnlaces()
            .pipe(
              tap((resp: any) => {
                if (resp.ok) {
                  this.enlaces = resp.enlace;
                  console.log('Todos los enlaces', this.enlaces);
                  return;
                }
              }),
              catchError((err) => {
                console.log('Ha ocurrido un error', err);
                return of(null);
              })
            )
            .subscribe();
        }

        onContenidochangeClick(event: any) {
        const value = event.target.value;
        const enlace = this.enlaces.filter((x) => x.enlaceId == value)[0];
        console.log('Id del enlace seleccionado:', value);
        console.log('datal enlace seleccionado:', enlace);
        this.FormRegistro.enlaceId = enlace.enlaceId;
      }

    btnInsertEditContenido(form: any) {
      this.isSubmit = true;

      if (!form.valid) {
        return;
      }

      if (this.modoEdicion) {
          this.contenidoService.modificarContenido(this.FormRegistro).subscribe({
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
          this.contenidoService.insertarContenido(this.FormRegistro).subscribe({
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
