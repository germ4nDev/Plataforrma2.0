import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { DataTablesModule } from 'angular-datatables';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { PTLAplicacionModel } from '../../../../theme/shared/_helpers/models/PTLAplicacion.model';
import { BreadcrumbComponent } from 'src/app/theme/shared/components/breadcrumb/breadcrumb.component';
import { TranslateService } from '@ngx-translate/core';
import { PtlAplicacionesService } from 'src/app/theme/shared/service';
import { LanguageService } from 'src/app/theme/shared/service/lenguage.service';
import { v4 as uuidv4 } from 'uuid';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-gestion-aplicacion',
  standalone: true,
  imports: [CommonModule, DataTablesModule, SharedModule, BreadcrumbComponent],
  templateUrl: './gestion-aplicacion.component.html',
  styleUrl: './gestion-aplicacion.component.scss'
})
export class GestionAplicacionComponent implements OnInit {
  FormRegistro: PTLAplicacionModel = new PTLAplicacionModel();
  form: undefined;
  isSubmit: boolean = false;
  modoEdicion: boolean = false;
  codeAplicacion = uuidv4();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private aplicacionesService: PtlAplicacionesService,
    private translate: TranslateService,
    private languageService: LanguageService,
    private BreadCrumb: BreadcrumbComponent
  ) {
    this.isSubmit = false;
  }

  ngOnInit() {
    this.BreadCrumb.setBreadcrumb();
    this.route.queryParams.subscribe((params) => {
      const aplicacionId = params['aplicacionId'];
      if (aplicacionId) {
        console.log('me llena el Id', aplicacionId);
        this.modoEdicion = true;
        this.aplicacionesService.getAplicacionById(aplicacionId).subscribe({
          next: (resp: any) => {
            this.FormRegistro = resp.aplicacion;
            this.codeAplicacion = resp.aplicacion.codigoAplicacion;
          },
          error: () => {
            Swal.fire('Error', 'No se pudo obtener la Aplicación', 'error');
          }
        });
      } else {
        console.log('no llena el Id', aplicacionId);
        this.modoEdicion = false;
        this.FormRegistro.codigoAplicacion = uuidv4();
      }
    });
  }

  btnGestionarAplicacionClick(form: any) {
    this.isSubmit = true;
    if (!form.valid) {
      return;
    }
    if (this.modoEdicion) {
        console.log('1.0 modificar app', this.FormRegistro)
      this.aplicacionesService.actualizarAplicacion(this.FormRegistro).subscribe({
        next: (resp: any) => {
          if (resp.ok) {
            Swal.fire('', 'la Aplicación se modificó correctamente', 'success');
            this.router.navigate(['/aplicaciones/aplicaciones']);
          } else {
            Swal.fire('Error', resp.message || 'No se pudo actualizar la Aplicación', 'error');
          }
        },
        error: (err: any) => {
          console.error(err);
          Swal.fire('Error', 'No se pudo actualizar la Aplicación', 'error');
        }
      });
    } else {
      this.aplicacionesService.crearAplicacion(this.FormRegistro).subscribe({
        next: (resp: any) => {
          if (resp.ok) {
            Swal.fire('', 'La Aplicación se insertó correctamente', 'success');
            form.resetForm();
            this.isSubmit = false;
            this.router.navigate(['/aplicaciones/aplicaciones']);
          }
        },
        error: (err: any) => {
          console.error(err);
          Swal.fire('Error', 'No se pudo insertar la Aplicación', 'error');
        }
      });
    }
  }

  btnRegresarClick() {
    this.router.navigate(['/aplicaciones/aplicaciones']);
  }
}
