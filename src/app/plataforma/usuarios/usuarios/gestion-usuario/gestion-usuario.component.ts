import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { DataTablesModule } from 'angular-datatables';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { PTLUsuarioModel } from '../../../../theme/shared/_helpers/models/PTLUsuario.model';
import { BreadcrumbComponent } from 'src/app/theme/shared/components/breadcrumb/breadcrumb.component';
import { TranslateService } from '@ngx-translate/core';
import { PTLUsuariosService } from 'src/app/theme/shared/service/ptlusuarios.service';
import { LanguageService } from 'src/app/theme/shared/service/lenguage.service';
import { v4 as uuidv4 } from 'uuid';
import Swal from 'sweetalert2';
import { HttpClient } from '@angular/common/http';
import { UploadFilesService } from 'src/app/theme/shared/service/upload-files.service';

@Component({
  selector: 'app-gestion-usuario',
  standalone: true,
  imports: [CommonModule, DataTablesModule, SharedModule, BreadcrumbComponent],
  templateUrl: './gestion-usuario.component.html',
  styleUrl: './gestion-usuario.component.scss'
})
export class GestionUsuarioComponent {
  FormRegistro: PTLUsuarioModel = new PTLUsuarioModel();
  form: undefined;
  isSubmit: boolean = false;
  modoEdicion: boolean = false;
  codeRegistro = uuidv4();
  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;
  userPhotoUrl: string = '';
  claveUsuario: string = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    private registrosService: PTLUsuariosService,
    private translate: TranslateService,
    private languageService: LanguageService,
    private uploadService: UploadFilesService,
    private BreadCrumb: BreadcrumbComponent
  ) {
    this.isSubmit = false;
  }

  ngOnInit() {
    this.BreadCrumb.setBreadcrumb();
    this.route.queryParams.subscribe((params) => {
      const registroId = params['regId'];
      if (registroId) {
        console.log('me llena el Id', registroId);
        this.modoEdicion = true;
        this.registrosService.getUsuarioById(registroId).subscribe({
          next: (resp: any) => {
            this.FormRegistro = resp.usuario;
            this.claveUsuario = resp.usuario.claveUsuario;
            // this.codeRegistro = resp.aplicacion.codigoAplicacion;
          },
          error: () => {
            Swal.fire('Error', 'No se pudo obtener la Aplicación', 'error');
          }
        });
      } else {
        console.log('no llena el Id', registroId);
        this.modoEdicion = false;
        // this.FormRegistro.codigoAplicacion = uuidv4();
      }
    });
  }

  onFileSelectedClick(event: any) {
    const file: File = event.target.files[0];
    const objUpload = {
      suscriptor: '0',
      aplicacion: 'plataforma',
      carpeta: 'usuarios'
    };

    if (file) {
      this.uploadService.uploadUserPhoto(file, objUpload).subscribe({
        next: (path) => {
          this.userPhotoUrl = `http://localhost:3000/${path}`;
        },
        error: () => {
          alert('Error al subir la imagen');
        }
      });
    }
  }

  btnGestionarAplicacionClick(form: any) {
    this.isSubmit = true;
    if (!form.valid) {
      return;
    }
    if (this.modoEdicion) {
      console.log('1.0 modificar usuario', this.FormRegistro);
      this.FormRegistro.claveUsuario = this.claveUsuario;
      this.registrosService.actualizarUsuario(this.FormRegistro).subscribe({
        next: (resp: any) => {
          if (resp.ok) {
            Swal.fire('', 'El Usuario se modificó correctamente', 'success');
            this.router.navigate(['/usuarios/usuarios']);
          } else {
            Swal.fire('Error', resp.message || 'No se pudo actualizar el Usuairo', 'error');
          }
        },
        error: (err: any) => {
          console.error(err);
          Swal.fire('Error', 'No se pudo actualizar el Usuario', 'error');
        }
      });
    } else {
      this.FormRegistro.claveUsuario = this.FormRegistro.identificacionUsuario?.toString().trimEnd();
      this.registrosService.crearUsuario(this.FormRegistro).subscribe({
        next: (resp: any) => {
          if (resp.ok) {
            Swal.fire('', 'El Usuario se insertó correctamente', 'success');
            form.resetForm();
            this.isSubmit = false;
            this.router.navigate(['/usuarios/usuarios']);
          }
        },
        error: (err: any) => {
          console.error(err);
          Swal.fire('Error', 'No se pudo insertar el Usuairo', 'error');
        }
      });
    }
  }

  btnRegresarClick() {
    this.router.navigate(['/usuarios/usuarios']);
  }
}
