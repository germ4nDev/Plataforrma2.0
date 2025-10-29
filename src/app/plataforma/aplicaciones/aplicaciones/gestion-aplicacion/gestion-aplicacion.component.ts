/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { GradientConfig } from 'src/app/app-config';
import { TextEditorComponent } from 'src/app/theme/shared/components/text-editor/text-editor.component';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { PTLAplicacionModel } from '../../../../theme/shared/_helpers/models/PTLAplicacion.model';
import { LocalStorageService, PtlAplicacionesService, SwalAlertService, UploadFilesService } from 'src/app/theme/shared/service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NavigationItem } from 'src/app/theme/shared/_helpers/models/Navigation.model';
import { NavigationService } from 'src/app/theme/shared/service/navigation.service';
import { NavBarComponent } from 'src/app/theme/layout/admin/nav-bar/nav-bar.component';
import { NavContentComponent } from 'src/app/theme/layout/admin/navigation/nav-content/nav-content.component';
import { Observable, Subscription } from 'rxjs';
import { FormDataModel } from 'src/app/theme/shared/_helpers/models/FormData.model';
import { v4 as uuidv4 } from 'uuid';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-gestion-aplicacion',
  standalone: true,
  imports: [CommonModule, SharedModule, TranslateModule, NavBarComponent, NavContentComponent, TextEditorComponent],
  templateUrl: './gestion-aplicacion.component.html',
  styleUrl: './gestion-aplicacion.component.scss'
})
export class GestionAplicacionComponent implements OnInit {
  @Output() toggleSidebar = new EventEmitter<void>();
  FormRegistro: PTLAplicacionModel = new PTLAplicacionModel();
  DataModel: FormDataModel = new FormDataModel();
  menuItems$!: Observable<NavigationItem[]>;
  gradientConfig: any;
  navCollapsed: boolean = false;
  navCollapsedMob: boolean = false;
  windowWidth: number = 0;
  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;
  userPhotoUrl: string = '';
  fileName: string | null = null;
  selectedFileUrl: string | null = null;

  form: undefined;
  isSubmit: boolean = false;
  modoEdicion: boolean = false;
  codeAplicacion = uuidv4();
  tipoEditorTexto = 'basica';
  lockScreenSubscription: Subscription | undefined;
  isLocked: boolean = false;
  lockMessage: string = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private _navigationService: NavigationService,
    private _localStorageService: LocalStorageService,
    private _aplicacionesService: PtlAplicacionesService,
    private _swalService: SwalAlertService,
    private _translate: TranslateService,
    private _uploadService: UploadFilesService
  ) {
    this.isSubmit = false;
    GradientConfig.header_fixed_layout = true;
    this.gradientConfig = GradientConfig;
    this.navCollapsed = this.windowWidth >= 992 ? GradientConfig.isCollapse_menu : false;
    this.navCollapsedMob = false;
    this._navigationService.getNavigationItems();
    this.route.queryParams.subscribe((params) => {
      if (Object.keys(params).length > 0) {
        const regId = params['regId'];
        if (regId !== 'nuevo') {
          this.modoEdicion = true;
          this._aplicacionesService.getAplicacionById(regId).subscribe({
            next: (resp: any) => {
              this.FormRegistro = resp.aplicacion;
              this.codeAplicacion = resp.aplicacion.codigoAplicacion;
              this.selectedFileUrl = this._uploadService.getFilePath('aplicaciones', resp.aplicacion.imagenInicio);
            },
            error: () => {
              Swal.fire('Error', 'No se pudo obtener la Aplicación', 'error');
            }
          });
        } else {
          this.FormRegistro.codigoAplicacion = uuidv4();
          this.modoEdicion = false;
        }
      }
    });
  }

  ngOnInit() {
    this.menuItems$ = this._navigationService.menuItems$;
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
    this.DataModel = this._localStorageService.getDataModelsLocalStorage();
    console.log('datamodel 1', this.DataModel);
  }

  actualizarDescripcionVersion(nuevoContenido: string): void {
    this.FormRegistro.descripcionAplicacion = nuevoContenido;
    console.log('Descripción de versión actualizada:', this.FormRegistro.descripcionAplicacion);
    // if (this.validationForm && this.isSubmit) {
    // }
  }

  onFileSelectedClick(event: any) {
    const file: File = event.target.files[0];
    const objUpload = {
      id: '0',
      tipo: 'aplicaciones'
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
          this.FormRegistro.imagenInicio = path.nombreArchivo;
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

  btnGestionarAplicacionClick(form: any) {
    this.isSubmit = true;
    if (!form.valid) {
      return;
    }
    this.DataModel.data = this.FormRegistro;
    console.log('datamodel', this.DataModel);
    if (this.modoEdicion) {
      this._aplicacionesService.actualizarAplicacion(this.DataModel).subscribe({
        next: (resp: any) => {
          if (resp.ok) {
            this._swalService.getAlertSuccess('la Aplicación se modificó correctamente');
            this.router.navigate(['/aplicaciones/aplicaciones']);
          } else {
            this._swalService.getAlertError('No se pudo actualizar la Aplicación');
          }
        },
        error: (err: any) => {
          console.error(err);
          this._swalService.getAlertError('No se pudo actualizar la Aplicación');
        }
      });
    } else {
      this._aplicacionesService.crearAplicacion(this.DataModel).subscribe({
        next: (resp: any) => {
          if (resp.ok) {
            this._swalService.getAlertSuccess('La Aplicación se insertó correctamente');
            form.resetForm();
            this.isSubmit = false;
            this.router.navigate(['/aplicaciones/aplicaciones']);
          }
        },
        error: (err: any) => {
          console.error(err);
          this._swalService.getAlertError('No se pudo actualizar la Aplicación');
        }
      });
    }
  }

  btnRegresarClick() {
    this.router.navigate(['/aplicaciones/aplicaciones']);
  }

  navMobClick() {
    if (this.windowWidth < 992) {
      if (this.navCollapsedMob && !document.querySelector('app-navigation.pcoded-navbar')?.classList.contains('mob-open')) {
        this.navCollapsedMob = !this.navCollapsedMob;
        setTimeout(() => {
          this.navCollapsedMob = !this.navCollapsedMob;
        }, 100);
      } else {
        this.navCollapsedMob = !this.navCollapsedMob;
      }
    }
  }

  toggleNav(): void {
    this.toggleSidebar.emit();
  }
}
