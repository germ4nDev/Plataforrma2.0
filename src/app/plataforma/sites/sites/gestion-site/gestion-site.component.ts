/* eslint-disable @angular-eslint/use-lifecycle-interface */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NarikCustomValidatorsModule } from '@narik/custom-validators';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { PTLSitiosAPService } from 'src/app/theme/shared/service/ptlsitios-ap.service';
import { BreadcrumbComponent } from 'src/app/theme/shared/components/breadcrumb/breadcrumb.component';
import { PTLSitiosAPModel } from 'src/app/theme/shared/_helpers/models/PTLSitioAP.model';
import { PtlAplicacionesService } from 'src/app/theme/shared/service/ptlaplicaciones.service';
import { catchError, of, Subscription, tap } from 'rxjs';
import { PTLAplicacionModel } from 'src/app/theme/shared/_helpers/models/PTLAplicacion.model';

@Component({
  selector: 'app-gestion-site',
  standalone: true,
  imports: [CommonModule, SharedModule, NarikCustomValidatorsModule],
  templateUrl: './gestion-site.component.html',
  styleUrl: './gestion-site.component.scss'
})
export class GestionSiteComponent implements OnInit {
  // private props
  FormRegistro: PTLSitiosAPModel = new PTLSitiosAPModel();
  form: undefined;
  isSubmit: boolean;
  modoEdicion: boolean = false;
  aplicacionesSub?: Subscription;
  aplicaciones: PTLAplicacionModel[] = [];

  // constructor
  constructor(
    private router: Router,
    private sitiosService: PTLSitiosAPService,
    private aplicacionesService: PtlAplicacionesService,
    private route: ActivatedRoute,
    private BreadCrumb: BreadcrumbComponent
  ) {
    this.isSubmit = false;
  }

  ngOnInit() {
    this.BreadCrumb.setBreadcrumb();
    this.consultarAplicaciones();
    // this.FormRegistro.aplicacionId = -1;
    this.route.queryParams.subscribe((params) => {
      const id = params['regId'];
      console.log('me llena el Id', id);
      if (id) {
        this.modoEdicion = true;
        this.sitiosService.getSitioById(id).subscribe({
          next: (resp: any) => {
            this.FormRegistro = resp.sitio;
            console.log('respuesta componente', this.FormRegistro);
          },
          error: () => {
            Swal.fire('Error', 'No se pudo obtener el sitio', 'error');
          }
        });
      } else {
        this.modoEdicion = false;
      }
    });
  }

  consultarAplicaciones() {
    this.aplicacionesSub = this.aplicacionesService
      .getAplicaciones()
      .pipe(
        tap((resp: any) => {
          if (resp.ok) {
            this.aplicaciones = resp.aplicaciones;
            console.log('Todos las aplicaciones', this.aplicaciones);
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

  onAplicacionchangeClick(event: any) {
    const value = event.target.value;
    const app = this.aplicaciones.filter((x) => x.codigoAplicacion == value)[0];
    console.log('Código de aplicación seleccionado:', value);
    console.log('data aplicación seleccionado:', app);
    this.FormRegistro.aplicacionId = app.aplicacionId;
  }

  btnInsertEditSitios(form: any) {
    this.isSubmit = true;
    if (!form.valid) {
      return;
    }
    if (this.modoEdicion) {
      this.sitiosService.modificarSitio(this.FormRegistro).subscribe({
        next: (resp: any) => {
          if (resp.ok) {
            Swal.fire('', 'El sitio se modificó correctamente', 'success');
            this.router.navigate(['/sites/sites']);
          } else {
            Swal.fire('Error', resp.message || 'No se pudo actualizar el sitio', 'error');
          }
        },
        error: (err: any) => {
          console.error(err);
          Swal.fire('Error', 'No se pudo actualizar el sitio', 'error');
        }
      });
    } else {
      this.sitiosService.insertarSitio(this.FormRegistro).subscribe({
        next: (resp: any) => {
          if (resp.ok) {
            Swal.fire('', 'El sitio se insertó correctamente', 'success');
            form.resetForm();
            this.isSubmit = false;
            this.router.navigate(['/sites/sites']);
          }
        },
        error: (err: any) => {
          console.error(err);
          Swal.fire('Error', 'No se pudo insertar el sitio', 'error');
        }
      });
    }
  }

  btnRegresarSitio() {
    this.router.navigate(['/sites/sites']);
  }
}
