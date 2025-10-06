/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { PTLUsuariosService } from 'src/app/theme/shared/service/ptlusuarios.service';
import { LanguageService } from 'src/app/theme/shared/service/lenguage.service';
import { v4 as uuidv4 } from 'uuid';
import Swal from 'sweetalert2';
import { HttpClient } from '@angular/common/http';
import { UploadFilesService } from 'src/app/theme/shared/service/upload-files.service';
import { NavBarComponent } from 'src/app/theme/layout/admin/nav-bar/nav-bar.component';
import { NavContentComponent } from 'src/app/theme/layout/admin/navigation/nav-content/nav-content.component';
import { NavigationService } from 'src/app/theme/shared/service/navigation.service';
import { NavigationItem } from 'src/app/theme/layout/admin/navigation/navigation';
import { PTLUsuarioModel } from 'src/app/theme/shared/_helpers/models/PTLUsuario.model';
import { TextEditorComponent } from 'src/app/theme/shared/components/text-editor/text-editor.component';
import { AuthenticationService } from 'src/app/theme/shared/service';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, SharedModule, TranslateModule, NavBarComponent, NavContentComponent, TextEditorComponent],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.scss'
})
export class PerfilComponent implements OnInit {
  @Output() toggleSidebar = new EventEmitter<void>();
  FormRegistro: PTLUsuarioModel = new PTLUsuarioModel();
  form: undefined;
  isSubmit: boolean = false;
  menuItems: NavigationItem[] = [];
  modoEdicion: boolean = false;
  codeRegistro = uuidv4();
  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;
  userPhotoUrl: string = '';
  claveUsuario: string = '';
  fileName: string | null = null;
  selectedFileUrl: string | null = null;
  tipoEditorTexto = 'basica';
  claveActual: string = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    private _authService: AuthenticationService,
    private navigationService: NavigationService,
    private registrosService: PTLUsuariosService,
    private translate: TranslateService,
    private languageService: LanguageService,
    private uploadService: UploadFilesService
  ) {
    this.isSubmit = false;
  }

  ngOnInit() {
    this.menuItems = this.navigationService.getNavigationItems();
    this.route.queryParams.subscribe((params) => {
      const registroId = params['regId'];
      if (registroId) {
        console.log('me llena el Id', registroId);
        this.modoEdicion = true;
        this.registrosService.getUsuarioById(registroId).subscribe({
          next: (resp: any) => {
            this.FormRegistro = resp.usuario;
            this.claveUsuario = resp.usuario.claveUsuario;
            this.selectedFileUrl = 'assets/images/user/' + resp.usuario.fotoUsuario;
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
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.selectedFileUrl = e.target.result;
      };
      reader.readAsDataURL(file);

      this.uploadService.uploadUserPhoto(file, objUpload).subscribe({
        next: (path) => {
          this.userPhotoUrl = path;
        },
        error: () => {
          alert('Error al subir la imagen');
          //   this.selectedFileUrl = null;
        }
      });
    } else {
      this.selectedFileUrl = null;
      this.userPhotoUrl = '';
    }
  }

  actualizarDescripcionVersion(nuevoContenido: string): void {
    this.FormRegistro.descripcionUsuario = nuevoContenido;
    console.log('Descripción de versión actualizada:', this.FormRegistro.descripcionUsuario);
    // if (this.validationForm && this.isSubmit) {
    // }
  }

  validarClaveActual(claveActual: string) {
    const userName = this.FormRegistro.userNameUsuario || '';
    console.log('validar la clave', userName, claveActual);

    this._authService.verificarClaveActual(userName, claveActual).subscribe((data) => {
      console.log('respuesta perfil', data);
    });
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
      this.FormRegistro.fotoUsuario = this.userPhotoUrl != '' ? this.userPhotoUrl : 'no-photo.png';
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

  toggleNav(): void {
    this.toggleSidebar.emit();
  }
}
