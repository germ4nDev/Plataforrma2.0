/* eslint-disable @angular-eslint/use-lifecycle-interface */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NarikCustomValidatorsModule } from '@narik/custom-validators';
import { PTLSuscriptorModel } from 'src/app/theme/shared/_helpers/models/PTLSuscriptor.model';
import { PTLSuscriptoresService } from 'src/app/theme/shared/service/ptlsuscriptores.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NavBarComponent } from 'src/app/theme/layout/admin/nav-bar/nav-bar.component';
import { NavContentComponent } from 'src/app/theme/layout/admin/navigation/nav-content/nav-content.component';
import { NavigationItem } from 'src/app/theme/layout/admin/navigation/navigation';
import { NavigationService } from 'src/app/theme/shared/service/navigation.service';
import { v4 as uuidv4 } from 'uuid';
import Swal from 'sweetalert2';
import { TextEditorComponent } from 'src/app/theme/shared/components/text-editor/text-editor.component';
import { Observable, Subscription } from 'rxjs';
import { LocalStorageService, PtllogActividadesService, SwalAlertService, UploadFilesService } from 'src/app/theme/shared/service';
import { TranslateService } from '@ngx-translate/core';

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

  // constructor
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private translate: TranslateService,
    private _suscriptoresService: PTLSuscriptoresService,
    private _navigationService: NavigationService,
    private _localStorageService: LocalStorageService,
    private _uploadService: UploadFilesService,
    private _logActividadesService: PtllogActividadesService,
    private _swalAlertService: SwalAlertService
  ) {
    this.isSubmit = false;
    this.route.queryParams.subscribe((params) => {
      const id = params['regId'];
      console.log('me llena el Id', id);
      if (id != 'nuevo') {
        this.modoEdicion = true;
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

      //   this.FormRegistro.codigoAplicacion = '';
      //   this.FormRegistro.codigoSuite = '';
      //   this.FormRegistro.codigoModulo = '';
      //   this.FormRegistro.codigoUsuarioAsignado = '';
      //   this.FormRegistro.codigoClase = '';
      //   this.FormRegistro.estadoTicket = '';
      //   this.FormRegistro.prioridad = '';
      //   this.FormRegistro.capturaTicket = 'no-imagen.png';
      //   this.FormRegistro.codigoTicket = uuidv4();
      //   this.selectedFileUrl = this._uploadService.getFilePath('tickets', 'no-foto.png');
      //   this.FormRegistro.fecha = this.setFechaRiesgo(new Date());
      // console.log('FormRegistro', this.FormRegistro);
    }
  }

  actualizarDescripcionSuscriptor(nuevoContenido: string): void {
    this.FormRegistro.descripcionSuscriptor = nuevoContenido;
    console.log('Descripción de versión actualizada:', this.FormRegistro.descripcionSuscriptor);
    // if (this.validationForm && this.isSubmit) {
    // }
  }

  onFileSelectedClick(event: any) {
    const file: File = event.target.files[0];
    const objUpload = {
      susc: this.FormRegistro.codigoSuscriptor,
      tipo: 'tickets'
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
    if (this.modoEdicion) {
      this._suscriptoresService.actualizarSuscriptor(this.FormRegistro).subscribe({
        next: (resp: any) => {
          if (resp.ok) {
            Swal.fire('', 'El suscriptor se modificó correctamente', 'success');
            this.router.navigate(['/suscriptor/suscriptores']);
          } else {
            Swal.fire('Error', resp.message || 'No se pudo actualizar el suscriptor', 'error');
          }
        },
        error: (err: any) => {
          console.error(err);
          Swal.fire('Error', 'No se pudo actualizar el suscriptor', 'error');
        }
      });
    } else {
        console.log('FormRegistro', this.FormRegistro);
      this._suscriptoresService.crearSuscriptor(this.FormRegistro).subscribe({
        next: (resp: any) => {
          if (resp.ok) {
            Swal.fire('', 'El suscriptor se insertó correctamente', 'success');
            form.resetForm();
            this.isSubmit = false;
            this.router.navigate(['/suscriptor/suscriptores']);
          }
        },
        error: (err: any) => {
          console.error(err);
          Swal.fire('Error', 'No se pudo insertar el suscriptor', 'error');
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
