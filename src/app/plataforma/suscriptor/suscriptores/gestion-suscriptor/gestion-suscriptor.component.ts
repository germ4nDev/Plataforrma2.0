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

  get clavesCoinciden(): boolean {
    const clave = this.FormRegistro.claveNew;
    const confirmacion = this.FormRegistro.claveConfirm;

    // Si ambos están vacíos, no mostramos error de "no coinciden"
    if (!clave && !confirmacion) {
      return true;
    }

    return clave === confirmacion;
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
      this.isClaveActual = false; // Permitir escribir claves nuevas de una vez
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
    if (!form.valid) return;

    // 1. Clonamos el objeto actual
    const rawData = { ...this.FormRegistro };

    // 2. Definimos el objeto que REALMENTE espera el servidor
    // Ajusta los nombres de la derecha según lo que pida tu API
    const registroParaEnvio = {
      codigoSuscriptor: rawData.codigoSuscriptor,
      identificacionSuscriptor: rawData.identificacionSuscriptor,
      nombreSuscriptor: rawData.nombreSuscriptor,
      direccionSuscriptor: rawData.direccionSuscriptor,
      telefonoContacto: rawData.telefonoContacto,
      numeroEmpresas: rawData.numeroEmpresas,
      numeroUsuarios: rawData.numeroUsuarios,
      usuarioAdministrador: rawData.usuarioAdministrador,
      descripcionSuscriptor: rawData.descripcionSuscriptor,
      logoSuscriptor: rawData.logoSuscriptor,
      envioCorreosSuscriptor: rawData.envioCorreosSuscriptor,
      envioMensajesSuscriptor: rawData.envioMensajesSuscriptor,
      envioPublicidadSuscriptor: rawData.envioPublicidadSuscriptor,
      estadoSuscriptor: rawData.estadoSuscriptor,
      // MAREAR LA CLAVE: El backend suele esperar un campo como 'claveUsuario'
      claveUsuario: rawData.claveNew
    };

    const usuarioLogueado = this._localStorageService.getUsuarioLocalStorage();

    if (this.modoEdicion) {
      const dataUpdate = {
        ...registroParaEnvio,
        suscriptorId: rawData.suscriptorId,
        codigoUsuarioModificacion: usuarioLogueado.codigoUsuario,
        fechaModificacion: new Date().toISOString()
      };

      this._suscriptoresService.actualizarSuscriptor(dataUpdate as any).subscribe({
        next: (resp: any) => {
          this._swalAlertService.getAlertSuccess(this.translate.instant('PLATAFORMA.MODIFICAR'));
          this.router.navigate(['/suscriptor/suscriptores']);
        },
        error: (err) => console.error(err)
      });
    } else {
      // MODO CREACIÓN
      const dataCreate = {
        ...registroParaEnvio,
        codigoUsuarioCreacion: usuarioLogueado.codigoUsuario,
        fechaCreacion: new Date().toISOString()
      };

      this._suscriptoresService.crearSuscriptor(dataCreate as any).subscribe({
        next: (resp: any) => {
          if (resp.ok) {
            this._suscriptoresService.crearCarpetaSuscriptor(dataCreate.codigoSuscriptor!).subscribe();
            this._swalAlertService.getAlertSuccess(this.translate.instant('PLATAFORMA.INSERTAR'));
            this.router.navigate(['/suscriptor/suscriptores']);
          }
        },
        error: (err) => {
          // Imprime esto en consola para ver el error real del backend
          console.error('Error detallado:', err.error);
          this._swalAlertService.getAlertError('Error: ' + (err.error?.error || 'Error interno'));
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
