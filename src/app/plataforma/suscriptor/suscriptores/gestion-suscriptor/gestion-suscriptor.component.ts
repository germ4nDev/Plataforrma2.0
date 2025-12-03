/* eslint-disable @angular-eslint/use-lifecycle-interface */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TextEditorComponent } from 'src/app/theme/shared/components/text-editor/text-editor.component';
import { Observable, Subscription } from 'rxjs';
import {
  LocalStorageService,
  PtllogActividadesService,
  PTLUsuariosService,
  SwalAlertService,
  UploadFilesService
} from 'src/app/theme/shared/service';
import { TranslateService } from '@ngx-translate/core';
import { NavigationItem } from 'src/app/theme/shared/_helpers/models/Navigation.model';
import { NarikCustomValidatorsModule } from '@narik/custom-validators';
import { PTLSuscriptorModel } from 'src/app/theme/shared/_helpers/models/PTLSuscriptor.model';
import { PTLSuscriptoresService } from 'src/app/theme/shared/service/ptlsuscriptores.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NavBarComponent } from 'src/app/theme/layout/admin/nav-bar/nav-bar.component';
import { NavContentComponent } from 'src/app/theme/layout/admin/navigation/nav-content/nav-content.component';
import { NavigationService } from 'src/app/theme/shared/service/navigation.service';
import { v4 as uuidv4 } from 'uuid';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-gestion-suscriptor',
  standalone: true,
  imports: [CommonModule, SharedModule, NarikCustomValidatorsModule, NavBarComponent, NavContentComponent, TextEditorComponent],
  templateUrl: './gestion-suscriptor.component.html',
  styleUrl: './gestion-suscriptor.component.scss'
})
export class GestionSuscriptorComponent {
  // private props
  @Output() toggleSidebar = new EventEmitter<void>();
  FormRegistro: PTLSuscriptorModel = new PTLSuscriptorModel();
  classList!: { toggle: (arg0: string) => void };
  menuItems!: Observable<NavigationItem[]>;
  gradientConfig: any;
  navCollapsed: boolean = false;
  navCollapsedMob: boolean = false;
  windowWidth: number = 0;
  form: undefined;
  isSubmit: boolean;
  modoEdicion: boolean = false;
  isClaveActual: boolean = true;
  verificarHabilitado: boolean = true;
  isClaveValida: boolean = false;
  cosigoSusucriptor = uuidv4();
  tipoEditorTexto = 'basica';
  lockScreenSubscription: Subscription | undefined;
  isLocked: boolean = false;
  lockMessage: string = '';

  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;
  userPhotoUrl: string = '';
  fileName: string | null = null;
  selectedFileUrl: string | null = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private translate: TranslateService,
    private _suscriptoresService: PTLSuscriptoresService,
    private _navigationService: NavigationService,
    private _localStorageService: LocalStorageService,
    private _uploadService: UploadFilesService,
    private _usuariosService: PTLUsuariosService,
    private _logActividadesService: PtllogActividadesService,
    private _swalAlertService: SwalAlertService
  ) {
    this.isSubmit = false;
    this.route.queryParams.subscribe((params) => {
      const id = params['regId'];
      console.log('me llena el Id', id);
      if (id != 'nuevo') {
        this.modoEdicion = true;
        this.verificarHabilitado = false;
        this._suscriptoresService.getSuscriptorById(id).subscribe({
          next: (resp: any) => {
            this.FormRegistro = resp.suscriptor;
            console.log('respuesta componente', this.FormRegistro);
          },
          error: () => {
            Swal.fire('Error', 'No se pudo obtener el suscriptor', 'error');
          }
        });
      } else {
        this.verificarHabilitado = true;
        this.modoEdicion = false;
        this.FormRegistro.codigoSuscriptor = uuidv4();
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
    const togglePassword = document.querySelector('#togglePassword');
    const password = document.querySelector('#claveAdministrador');
    togglePassword?.addEventListener('click', () => {
      // toggle the type attribute
      const type = password?.getAttribute('type') === 'password' ? 'text' : 'password';
      password?.setAttribute('type', type);
      this.classList.toggle('icon-eye-off');
    });
    if (!this.modoEdicion) {
      console.log('modo edicion', this.modoEdicion);
      this.FormRegistro.codigoSuscriptor = uuidv4();
      this.FormRegistro.nombreSuscriptor = '';
      this.FormRegistro.identificacionSuscriptor = '';
      this.FormRegistro.direccionSuscriptor = '';
      this.FormRegistro.telefonoContacto = '';
      this.FormRegistro.numeroEmpresas = 0;
      this.FormRegistro.numeroUsuarios = 0;
      this.FormRegistro.usuarioAdministrador = '';
      this.FormRegistro.descripcionSuscriptor = '';
      this.FormRegistro.envioCorreosSuscriptor = false;
      this.FormRegistro.envioMensajesSuscriptor = false;
      this.FormRegistro.envioPublicidadSuscriptor = false;
      this.FormRegistro.estadoSuscriptor = false;
      console.log('FormRegistro', this.FormRegistro);
    }
  }

  actualizarDescripcionSuscriptor(nuevoContenido: string): void {
    this.FormRegistro.descripcionSuscriptor = nuevoContenido;
    console.log('Descripción de versión actualizada:', this.FormRegistro.descripcionSuscriptor);
    // if (this.validationForm && this.isSubmit) {
    // }
  }

  validarClaveActual(claveActual: any) {
    const codigo = this.FormRegistro.codigoAdministrador || '';
    this._usuariosService.verificarClaveActual(codigo, claveActual).subscribe((data: any) => {
      if (data.ok == true) {
        if (this.FormRegistro.codigoAdministrador === data.suscriptor.codigoAdministrador) {
          this.isClaveActual = false;
          this.isClaveValida = true;
        }
      } else {
        this.FormRegistro.claveNew = '';
        this.FormRegistro.claveConfirm = '';
        this.isClaveValida = false;
        this.isClaveActual = true;
        this._swalAlertService.getAlertError(this.translate.instant('PLATAFORMA.PASSWORDNOTMATCH'));
      }
    });
  }

  onFileSelectedClick(event: any) {
    const file: File = event.target.files[0];
    const objUpload = {
      susc: this.FormRegistro.codigoSuscriptor,
      tipo: 'suscriptores'
    };
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.selectedFileUrl = e.target.result;
      };
      this.FormRegistro.logoSuscriptor = '';
      reader.readAsDataURL(file);
      this._uploadService.uploadUserPhoto(file, objUpload).subscribe({
        next: (path: any) => {
          this.userPhotoUrl = path.nombreArchivo;
          this.FormRegistro.logoSuscriptor = path.nombreArchivo;
        },
        error: () => {
          this._swalAlertService.getAlertError(this.translate.instant('PLATAFORMA.UPLOADPHOTOERROR'));
        }
      });
    } else {
      this.selectedFileUrl = null;
      this.userPhotoUrl = '';
    }
  }

  btnGestionarRegistroClick(form: any) {
    this.isSubmit = true;
    if (!form.valid) {
      return;
    }
    const registroData = form.value as PTLSuscriptorModel;
    if (this.modoEdicion) {
      registroData.codigoUsuarioModificacion = this._localStorageService.getUsuarioLocalStorage().codigoUsuario;
      registroData.fechaModificacion = new Date().toISOString();
      if (this.isClaveValida == true) {
        if (this.FormRegistro.codigoAdministrador) {
          this._usuariosService.getUsuarioById(this.FormRegistro.codigoAdministrador).subscribe((user: any) => {
            if (user) {
              user.claveUsuario = this.FormRegistro.claveNew;
              this._usuariosService.actualizarUsuario(user).subscribe();
            }
          });
        }
      }
      this._suscriptoresService.actualizarSuscriptor(registroData).subscribe({
        next: (resp: any) => {
          if (resp.ok) {
            const logData = {
              codigoTipoLog: '',
              codigoRespuesta: '201',
              descripcionLog: this.translate.instant('PLATAFORMA.MODIFICAR')
            };
            this._logActividadesService.postCrearRegistro(logData).subscribe(() => console.log('log creado exitosamente'));
            this._swalAlertService.getAlertSuccess(this.translate.instant('PLATAFORMA.MODIFICAR'));
            this.router.navigate(['/suscriptor/suscriptores']);
          } else {
            const logData = {
              codigoTipoLog: '',
              codigoRespuesta: '501',
              descripcionLog: this.translate.instant('PLATAFORMA.NOMODIFICO')
            };
            this._logActividadesService.postCrearRegistro(logData).subscribe(() => console.log('log creado exitosamente'));
            this._swalAlertService.getAlertError(this.translate.instant('PLATAFORMA.NOMODIFICO') + resp.message);
          }
        },
        error: (err: any) => {
          console.error(err);
          const logData = {
            codigoTipoLog: '',
            codigoRespuesta: '501',
            descripcionLog: this.translate.instant('PLATAFORMA.NOMODIFICO')
          };
          this._logActividadesService.postCrearRegistro(logData).subscribe(() => console.log('log creado exitosamente'));
          this._swalAlertService.getAlertError(this.translate.instant('PLATAFORMA.NOMODIFICO') + err.message);
        }
      });
    } else {
      console.log('FormRegistro', this.FormRegistro);
      registroData.fechaCreacion = new Date().toISOString();
      registroData.codigoUsuarioCreacion = this._localStorageService.getUsuarioLocalStorage().codigoUsuario;
      registroData.codigoUsuarioModificacion = '';
      registroData.fechaModificacion = '';
      this._suscriptoresService.crearSuscriptor(registroData).subscribe({
        next: (resp: any) => {
          if (resp.ok) {
            const logData = {
              codigoTipoLog: '',
              codigoRespuesta: '201',
              descripcionLog: this.translate.instant('PLATAFORMA.MODIFICAR')
            };
            this._logActividadesService.postCrearRegistro(logData).subscribe(() => console.log('log creado exitosamente'));
            this._suscriptoresService.crearCarpetaSuscriptor(this.FormRegistro.codigoSuscriptor || '').subscribe((datos) => {
              console.log('Carpeta de suscriptor creada:', datos);
            });
            this._swalAlertService.getAlertSuccess(this.translate.instant('PLATAFORMA.INSERTAR'));
            form.resetForm();
            this.isSubmit = false;
            this.router.navigate(['/suscriptor/suscriptores']);
          }
        },
        error: (err: any) => {
          console.error(err);
          const logData = {
            codigoTipoLog: '',
            codigoRespuesta: '501',
            descripcionLog: this.translate.instant('PLATAFORMA.NOMODIFICO')
          };
          this._logActividadesService.postCrearRegistro(logData).subscribe(() => console.log('log creado exitosamente'));
          this._swalAlertService.getAlertError(this.translate.instant('PLATAFORMA.NOMODIFICO') + err.message);
        }
      });
    }
  }

  btnRegresarClick() {
    this.router.navigate(['/suscriptor/suscriptores']);
  }

  toggleNav(): void {
    this.toggleSidebar.emit();
  }
}
