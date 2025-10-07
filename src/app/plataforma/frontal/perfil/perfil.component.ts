/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { PTLUsuariosService } from 'src/app/theme/shared/service/ptlusuarios.service';
import { HttpClient } from '@angular/common/http';
import { UploadFilesService } from 'src/app/theme/shared/service/upload-files.service';
import { NavBarComponent } from 'src/app/theme/layout/admin/nav-bar/nav-bar.component';
import { NavContentComponent } from 'src/app/theme/layout/admin/navigation/nav-content/nav-content.component';
import { NavigationService } from 'src/app/theme/shared/service/navigation.service';
import { NavigationItem } from 'src/app/theme/layout/admin/navigation/navigation';
import { PTLUsuarioModel } from 'src/app/theme/shared/_helpers/models/PTLUsuario.model';
import { TextEditorComponent } from 'src/app/theme/shared/components/text-editor/text-editor.component';
import { AuthenticationService } from 'src/app/theme/shared/service';
import { v4 as uuidv4 } from 'uuid';
import Swal from 'sweetalert2';
import { SwalAlertService } from 'src/app/theme/shared/service/swal-alert.service';
import { LocalStorageService } from 'src/app/theme/shared/service/local-storage.service';

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
  isClaveActual: boolean = true;
  claveActual: string = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    private _navigationService: NavigationService,
    private _registrosService: PTLUsuariosService,
    private _authService: AuthenticationService,
    private _swalService: SwalAlertService,
    private _translate: TranslateService,
    private _localStorageService: LocalStorageService,
    private _uploadService: UploadFilesService
  ) {
    this.isSubmit = false;
  }

  ngOnInit() {
    this.menuItems = this._navigationService.getNavigationItems();
    this.route.queryParams.subscribe((params) => {
      const registroId = params['regId'];
      if (registroId) {
        console.log('me llena el Id', registroId);
        this.modoEdicion = true;
        this._registrosService.getUsuarioById(registroId).subscribe({
          next: (resp: any) => {
            this.FormRegistro = resp.usuario;
            this.claveUsuario = resp.usuario.claveUsuario;
            this.selectedFileUrl = this._uploadService.getFilePath('usuarios', resp.usuario.fotoUsuario);
            this.FormRegistro.claveNew = '';
            this.FormRegistro.claveConfirm = '';
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
      aplicacion: this._localStorageService.getAplicaicionLocalStorage().nombreAplicacion,
      carpeta: 'usuarios'
    };
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.selectedFileUrl = e.target.result;
      };
      reader.readAsDataURL(file);

      this._uploadService.uploadUserPhoto(file, objUpload).subscribe({
        next: (path) => {
          this.userPhotoUrl = path;
        },
        error: () => {
          this._swalService.getAlertError(this._translate.instant('PLATAFORMA.UPLOADPHOTOERROR'));
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

  validarClaveActual(claveActual: any) {
    console.log('validar la clave', claveActual);
    const userName = this.FormRegistro.userNameUsuario || '';
    console.log('validar el usuario', userName, claveActual);
    console.log('data el usuario', this.FormRegistro);
    this._authService.verificarClaveActual(userName, claveActual).subscribe((data: any) => {
      console.log('data', data);
      if (data.ok == true) {
        if (this.FormRegistro.usuarioId === data.usuario.usuarioId) {
          this.isClaveActual = false;
          console.log('respuesta perfil', data);
        }
      } else {
        this.FormRegistro.claveNew = '';
        this.FormRegistro.claveConfirm = '';
        this.isClaveActual = true;
      }
    });
  }

  btnGestionarAplicacionClick(form: any) {
    this.isSubmit = true;
    if (!form.valid) {
      return;
    }
    if (this.modoEdicion) {
      if (this.FormRegistro.claveNew != '') {
        if (this.FormRegistro.claveNew == this.FormRegistro.claveConfirm) {
          this.FormRegistro.claveUsuario = this.FormRegistro.claveNew;
          this._registrosService.actualizarUsuarioClave(this.FormRegistro).subscribe({
            next: (resp: any) => {
              if (resp.ok) {
                this._swalService.getAlertSuccess(this._translate.instant('PLATAFORMA.UPDATEUSERSUCCESS'));
                this.router.navigate(['/autenticacion/login']);
              } else {
                this._swalService.getAlertError(resp.message || this._translate.instant('PLATAFORMA.UPDATEUSERERROR'));
              }
            },
            error: (err: any) => {
              console.error(err);
              this._swalService.getAlertError(this._translate.instant('PLATAFORMA.UPDATEUSERERROR'));
            }
          });
        } else {
          this._swalService.getAlertError(this._translate.instant('PLATAFORMA.PASSWORDSERROR'));
        }
      } else {
        this._registrosService.actualizarUsuarioDatos(this.FormRegistro).subscribe({
          next: (resp: any) => {
            if (resp.ok) {
              this._swalService.getAlertSuccess(this._translate.instant('PLATAFORMA.UPDATEUSERSUCCESS'));
              this.router.navigate(['/frontal/home']);
            } else {
              this._swalService.getAlertError(resp.message || this._translate.instant('PLATAFORMA.UPDATEUSERERROR'));
            }
          },
          error: (err: any) => {
            console.error(err);
            this._swalService.getAlertError(this._translate.instant('PLATAFORMA.UPDATEUSERERROR'));
          }
        });
      }
    }
  }

  btnRegresarClick() {
    this.router.navigate(['/usuarios/usuarios']);
  }

  toggleNav(): void {
    this.toggleSidebar.emit();
  }
}
