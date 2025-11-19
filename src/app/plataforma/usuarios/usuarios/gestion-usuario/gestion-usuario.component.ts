/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { PTLUsuarioModel } from '../../../../theme/shared/_helpers/models/PTLUsuario.model';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { PTLUsuariosService } from 'src/app/theme/shared/service/ptlusuarios.service';
import { UploadFilesService } from 'src/app/theme/shared/service/upload-files.service';
import { NavBarComponent } from 'src/app/theme/layout/admin/nav-bar/nav-bar.component';
import { NavContentComponent } from 'src/app/theme/layout/admin/navigation/nav-content/nav-content.component';
import { NavigationService } from 'src/app/theme/shared/service/navigation.service';
import { AuthenticationService, PtllogActividadesService } from 'src/app/theme/shared/service';
import { SwalAlertService } from 'src/app/theme/shared/service/swal-alert.service';
import { LocalStorageService } from 'src/app/theme/shared/service/local-storage.service';
import { v4 as uuidv4 } from 'uuid';
import Swal from 'sweetalert2';
import { TextEditorComponent } from 'src/app/theme/shared/components/text-editor/text-editor.component';
import { Observable, Subscription } from 'rxjs';
import { NavigationItem } from 'src/app/theme/shared/_helpers/models/Navigation.model';

@Component({
  selector: 'app-gestion-usuario',
  standalone: true,
  imports: [CommonModule, SharedModule, TranslateModule, NavBarComponent, NavContentComponent, TextEditorComponent],
  templateUrl: './gestion-usuario.component.html',
  styleUrl: './gestion-usuario.component.scss'
})
export class GestionUsuarioComponent implements OnInit {
  @Output() toggleSidebar = new EventEmitter<void>();
  FormRegistro: PTLUsuarioModel = new PTLUsuarioModel();
  form: undefined;
  isSubmit: boolean = false;
  menuItems!: Observable<NavigationItem[]>;
  modoEdicion: boolean = false;
  codeRegistro = uuidv4();
  claveUsuario: string = '';
  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;
  userPhotoUrl: string = '';
  fileName: string | null = null;
  selectedFileUrl: string | null = null;
  isClaveActual: boolean = true;
  claveActual: string = '';
  tipoEditorTexto = 'basica';
  lockScreenSubscription: Subscription | undefined;
  isLocked: boolean = false;
  lockMessage: string = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private translate: TranslateService,
    private _logActividadesService: PtllogActividadesService,
    private _navigationService: NavigationService,
    private _registrosService: PTLUsuariosService,
    private _authService: AuthenticationService,
    private _swalService: SwalAlertService,
    private _translate: TranslateService,
    private _localStorageService: LocalStorageService,
    private _uploadService: UploadFilesService
  ) {
    this.isSubmit = false;
    this.route.queryParams.subscribe((params) => {
      const registroId = params['regId'];
      if (registroId) {
        console.log('me llena el Id', registroId);
        this.modoEdicion = true;
        this._registrosService.getUsuarioById(registroId).subscribe({
          next: (resp: any) => {
            this.FormRegistro = resp.usuario;
            this.claveUsuario = resp.usuario.claveUsuario;
            this.selectedFileUrl = this._uploadService.getFilePath('plataforma', 'usuarios', resp.usuario.fotoUsuario);
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

  ngOnInit() {
    this._navigationService.getNavigationItems();
    this.menuItems = this._navigationService.menuItems$;
    this.lockScreenSubscription = this._navigationService.lockScreenEvent$.subscribe({
      next: (message: string) => {
        this._localStorageService.setFormRegistro(this.FormRegistro);
        this.isLocked = true;
        this.lockMessage = message;
      },
      error: (err) => console.error('Error al suscribirse al evento de bloqueo:', err)
    });
    const form = this._localStorageService.getFormRegistro();
    if (form != undefined) {
      this.FormRegistro = form;
      this._localStorageService.removeFormRegistro();
    }
    if (!this.modoEdicion) {
      this.FormRegistro.codigoUsuario = uuidv4();
    }
  }

  onFileSelectedClick(event: any) {
    const file: File = event.target.files[0];
    const objUpload = {
      susc: '0',
      aplicacion: this._localStorageService.getAplicaicionLocalStorage().nombreAplicacion,
      tipo: 'usuarios'
    };
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.selectedFileUrl = e.target.result;
      };
      reader.readAsDataURL(file);
      this._uploadService.uploadUserPhoto(file, objUpload).subscribe({
        next: (path: any) => {
          console.log('resultado', path);
          this.userPhotoUrl = path.nombreArchivo;
        },
        error: () => {
          this._swalService.getAlertError(this._translate.instant('PLATAFORMA.UPLOADPHOTOERROR'));
        }
      });
    } else {
      this.selectedFileUrl = null;
      this.userPhotoUrl = '';
    }
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

  actualizarDescripcionRegistro(nuevoContenido: string): void {
    this.FormRegistro.descripcionUsuario = nuevoContenido;
    console.log('Descripción de versión actualizada:', this.FormRegistro.descripcionUsuario);
    // if (this.validationForm && this.isSubmit) {
    // }
  }

  btnGestionarUsuarioClick(form: any) {
    this.isSubmit = true;
    if (!form.valid) {
      return;
    }
    const registroData = form.value as PTLUsuarioModel;
    if (this.modoEdicion) {
      if (this.FormRegistro.claveNew != '') {
        if (this.FormRegistro.claveNew == this.FormRegistro.claveConfirm) {
          registroData.claveUsuario = this.FormRegistro.claveNew;
          registroData.codigoUsuarioModificacion = this._localStorageService.getUsuarioLocalStorage().codigoUsuario;
          registroData.fechaModificacion = new Date().toISOString();
          this._registrosService.actualizarUsuarioClave(registroData).subscribe({
            next: (resp: any) => {
              if (resp.ok) {
                const logData = {
                  codigoTipoLog: '',
                  codigoRespuesta: '201',
                  descripcionLog: this.translate.instant('PLATAFORMA.MODIFICAR') + ', ' + resp.mensaje
                };
                this._logActividadesService.postCrearRegistro(logData).subscribe(() => console.log('log creado exitosamente'));
                this._swalService.getAlertSuccess(this._translate.instant('PLATAFORMA.UPDATEUSERSUCCESS'));
                this.router.navigate(['/autenticacion/login']);
              } else {
                const logData = {
                  codigoTipoLog: '',
                  codigoRespuesta: '501',
                  descripcionLog: this.translate.instant('PLATAFORMA.NOMODIFICO') + ', ' + resp.mensaje
                };
                this._logActividadesService.postCrearRegistro(logData).subscribe(() => console.log('log creado exitosamente'));
                this._swalService.getAlertError(resp.message || this._translate.instant('PLATAFORMA.UPDATEUSERERROR'));
              }
            },
            error: (err: any) => {
              console.error(err);
              const logData = {
                codigoTipoLog: '',
                codigoRespuesta: '501',
                descripcionLog: this.translate.instant('PLATAFORMA.NOMODIFICO') + ', ' + err.mensaje
              };
              this._logActividadesService.postCrearRegistro(logData).subscribe(() => console.log('log creado exitosamente'));
              this._swalService.getAlertError(this._translate.instant('PLATAFORMA.UPDATEUSERERROR'));
            }
          });
        } else {
          const logData = {
            codigoTipoLog: '',
            codigoRespuesta: '501',
            descripcionLog: this.translate.instant('PLATAFORMA.NOMODIFICO')
          };
          this._logActividadesService.postCrearRegistro(logData).subscribe(() => console.log('log creado exitosamente'));
          this._swalService.getAlertError(this._translate.instant('PLATAFORMA.PASSWORDSERROR'));
        }
      } else {
        registroData.codigoUsuarioModificacion = this._localStorageService.getUsuarioLocalStorage().codigoUsuario;
        registroData.fechaModificacion = new Date().toISOString();
        this._registrosService.actualizarUsuarioDatos(registroData).subscribe({
          next: (resp: any) => {
            if (resp.ok) {
              const logData = {
                codigoTipoLog: '',
                codigoRespuesta: '201',
                descripcionLog: this.translate.instant('PLATAFORMA.MODIFICAR')
              };
              this._logActividadesService.postCrearRegistro(logData).subscribe(() => console.log('log creado exitosamente'));
              this._swalService.getAlertSuccess(this._translate.instant('PLATAFORMA.UPDATEUSERSUCCESS'));
              this.router.navigate(['/usuarios/usuarios']);
            }
          },
          error: (err: any) => {
            console.error(err);
            const logData = {
              codigoTipoLog: '',
              codigoRespuesta: '501',
              descripcionLog: this.translate.instant('PLATAFORMA.NOMODIFICO') + ', ' + err.mensaje
            };
            this._logActividadesService.postCrearRegistro(logData).subscribe(() => console.log('log creado error'));
            this._swalService.getAlertError(this._translate.instant('PLATAFORMA.UPDATEUSERERROR'));
          }
        });
      }
    } else {
      this.FormRegistro.claveUsuario = this.FormRegistro.identificacionUsuario?.toString().trimEnd();
      this.FormRegistro.fotoUsuario = this.userPhotoUrl != '' ? this.userPhotoUrl : 'no-photo.png';
      console.log('formResgistro', this.FormRegistro);
      registroData.codigoUsuario = uuidv4();
      registroData.fechaCreacion = new Date().toISOString();
      registroData.codigoUsuarioCreacion = this._localStorageService.getUsuarioLocalStorage().codigoUsuario;
      console.log('registroData', registroData);
      this._registrosService.crearUsuario(registroData).subscribe({
        next: (resp: any) => {
          if (resp.ok) {
            const logData = {
              codigoTipoLog: '',
              codigoRespuesta: '201',
              descripcionLog: this.translate.instant('PLATAFORMA.INSERTAR')
            };
            this._logActividadesService.postCrearRegistro(logData).subscribe(() => console.log('log creado exitosamente'));
            this._swalService.getAlertSuccess(this._translate.instant('PLATAFORMA.INSERTUSERSUCCESS'));
            form.resetForm();
            this.isSubmit = false;
            this.router.navigate(['/usuarios/usuarios']);
          }
        },
        error: (err: any) => {
          console.error(err);
          const logData = {
            codigoTipoLog: '',
            codigoRespuesta: '501',
            descripcionLog: this.translate.instant('PLATAFORMA.NOINSERTO') + ', ' + err.mensaje
          };
          this._logActividadesService.postCrearRegistro(logData).subscribe(() => console.log('log creado error'));
          this._swalService.getAlertError(this._translate.instant('PLATAFORMA.INSERTUSERERROR'));
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
