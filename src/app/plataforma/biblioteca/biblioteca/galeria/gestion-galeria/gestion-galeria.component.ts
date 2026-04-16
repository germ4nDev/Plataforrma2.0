/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { GradientConfig } from 'src/app/app-config';
import { TextEditorComponent } from 'src/app/theme/shared/components/text-editor/text-editor.component';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { LocalStorageService, PtllogActividadesService, SwalAlertService, UploadFilesService } from 'src/app/theme/shared/service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NavigationItem } from 'src/app/theme/shared/_helpers/models/Navigation.model';
import { PTLLogActividadAPModel } from 'src/app/theme/shared/_helpers/models/PTLlogActividadAP.model';
import { PTLGaleria } from 'src/app/theme/shared/_helpers/models/PTLGaleria.model';
import { PtlGaleriaService } from 'src/app/theme/shared/service/ptlgaleria.service';
import { PtlTiposGaleriaService } from 'src/app/theme/shared/service/ptltiposgaleria.service';
import { PtlFormatosGaleriaService } from 'src/app/theme/shared/service/ptlformatosgaleria.service';
import { NavigationService } from 'src/app/theme/shared/service/navigation.service';
import { NavBarComponent } from 'src/app/theme/layout/admin/nav-bar/nav-bar.component';
import { NavContentComponent } from 'src/app/theme/layout/admin/navigation/nav-content/nav-content.component';
import { Observable, Subscription } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-gestion-galeria',
  standalone: true,
  imports: [CommonModule, FormsModule, SharedModule, TranslateModule, NavBarComponent, NavContentComponent, TextEditorComponent],
  templateUrl: './gestion-galeria.component.html',
  styleUrl: './gestion-galeria.component.scss'
})
export class GestionGaleriaComponent implements OnInit {
  @Output() toggleSidebar = new EventEmitter<void>();
  FormRegistro: PTLGaleria = new PTLGaleria();
  logActividad: PTLLogActividadAPModel = new PTLLogActividadAPModel();
  menuItems$!: Observable<NavigationItem[]>;
  gradientConfig: any;
  navCollapsed: boolean = false;
  navCollapsedMob: boolean = false;
  windowWidth: number = 0;

  selectedFile: File | null = null;
  userPhotoUrl: string = '';
  fileName: string | null = null;
  selectedFileUrl: string | null = null;
  selectedFileType: 'image' | 'video' | 'document' | null = null;
  selectedFileName: string = '';

  isSubmit: boolean = false;
  modoEdicion: boolean = false;
  codeGaleria = uuidv4();
  tipoEditorTexto = 'basica';
  lockScreenSubscription: Subscription | undefined;
  isLocked: boolean = false;
  lockMessage: string = '';
  listaTipos: any[] = [];
  listaFormatos: any[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private translate: TranslateService,
    private _navigationService: NavigationService,
    private _localStorageService: LocalStorageService,
    private _logActividadesService: PtllogActividadesService,
    private _galeriaService: PtlGaleriaService,
    private _tiposGaleriaService: PtlTiposGaleriaService,
    private _uploadService: UploadFilesService,
    private _formatosGaleriaService: PtlFormatosGaleriaService,
    private _swalService: SwalAlertService,
    private _translate: TranslateService
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
          this._galeriaService.getGaleriaById(regId).subscribe({
            next: (resp: any) => {
              this.FormRegistro = resp.galeria;
              this.codeGaleria = resp.galeria.codigoGaleria;
            },
            error: () => {
              Swal.fire('Error', 'No se pudo obtener la Galería', 'error');
            }
          });
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

    if (this.modoEdicion == false) {
      this.FormRegistro.codigoGaleria = uuidv4();
      this.FormRegistro.estadoGaleria = true;
    }
    this.cargarListasDesplegables();
  }

  cargarListasDesplegables() {
    this._tiposGaleriaService.cargarTiposGaleria().subscribe({
      next: (resp: any) => {
        this.listaTipos = resp.tiposGaleria || resp;
      },
      error: (err: any) => console.error('Error cargando tipos', err)
    });

    this._formatosGaleriaService.cargarFormatosGaleria().subscribe({
      next: (resp: any) => {
        this.listaFormatos = resp.formatosGaleria || resp;
      },
      error: (err: any) => console.error('Error cargando formatos', err)
    });
  }

  actualizarDescripcionVersion(nuevoContenido: string): void {
    this.FormRegistro.descripcionGaleria = nuevoContenido;
  }

  btnGestionarGaleriaClick(form: any) {
    if (this.modoEdicion) {
      this.FormRegistro.codigoUsuarioModificacion = this._localStorageService.getUsuarioLocalStorage().codigoUsuario;
      this.FormRegistro.fechaModificacion = new Date().toISOString();
      this._galeriaService.actualizarGaleria(this.FormRegistro).subscribe({
        next: (resp: any) => {
          if (resp.ok) {
            const logData = {
              codigoTipoLog: '',
              codigoRespuesta: '201',
              descripcionLog: this.translate.instant('GALERIA.UPDATESUCCSESSFULLY')
            };
            this._logActividadesService.postCrearRegistro(logData).subscribe();
            this._swalService.getAlertSuccess(this.translate.instant('GALERIA.UPDATESUCCSESSFULLY'));
            form.resetForm();
            this.router.navigate(['/biblioteca/galeria']);
          }
        },
        error: (err: any) => {
          console.error(err);
          const logData = { codigoTipoLog: '', codigoRespuesta: '501', descripcionLog: this.translate.instant('GALERIA.UPDATEERROR') };
          this._logActividadesService.postCrearRegistro(logData).subscribe();
          this._swalService.getAlertError('No se pudo actualizar la Galería');
        }
      });
    } else {
      form.galeriaId = 0;
      const registroData = form.value as PTLGaleria;
      registroData.codigoGaleria = this.FormRegistro.codigoGaleria;
      registroData.descripcionGaleria = this.FormRegistro.descripcionGaleria;
      registroData.codigoUsuarioCreacion = this._localStorageService.getUsuarioLocalStorage().codigoUsuario;
      registroData.fechaCreacion = new Date().toISOString();
      registroData.codigoUsuarioModificacion = this._localStorageService.getUsuarioLocalStorage().codigoUsuario;
      registroData.imagenGaleria = this.userPhotoUrl || 'no-imagen.png';
      registroData.fechaModificacion = new Date().toISOString();

      this._galeriaService.crearGaleria(registroData).subscribe({
        next: (resp: any) => {
          if (resp.ok) {
            const logData = {
              codigoTipoLog: '',
              codigoRespuesta: '201',
              descripcionLog: this.translate.instant('GALERIA.CREATESUCCSESSFULLY')
            };
            this._logActividadesService.postCrearRegistro(logData).subscribe();
            this._swalService.getAlertSuccess(this.translate.instant('GALERIA.CREATESUCCSESSFULLY'));
            form.resetForm();
            this.router.navigate(['/biblioteca/galeria']);
          }
        },
        error: (err: any) => {
          console.error(err);
          const logData = { codigoTipoLog: '', codigoRespuesta: '500', descripcionLog: this.translate.instant('GALERIA.CREATEERROR') };
          this._logActividadesService.postCrearRegistro(logData).subscribe();
          this._swalService.getAlertError('No se pudo crear la Galería');
        }
      });
    }
  }

  onFileSelectedClick(event: any) {
    const file: File = event.target.files[0];
    const objUpload = {
      susc: 'plataforma',
      tipo: 'galeria',
      id: '0'
    };

    if (file) {
      this.selectedFileName = file.name;
      if (file.type.startsWith('image/')) {
        this.selectedFileType = 'image';
      } else if (file.type.startsWith('video/')) {
        this.selectedFileType = 'video';
      } else {
        this.selectedFileType = 'document';
      }

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.selectedFileUrl = e.target.result;
      };
      reader.readAsDataURL(file);

      this._uploadService.uploadUserPhoto(file, objUpload).subscribe({
        next: (path: any) => {
          this.FormRegistro.imagenGaleria = path.nombreArchivo;
          this.userPhotoUrl = path.nombreArchivo;
        },
        error: () => {
          this._swalService.getAlertError(this.translate.instant('PLATAFORMA.UPLOADPHOTOERROR'));
        }
      });
    } else {
      this.selectedFileUrl = null;
      this.userPhotoUrl = '';
      this.selectedFileType = null;
      this.selectedFileName = '';
    }
  }

  //   onFileSelectedClick(event: any) {
  //     const file: File = event.target.files[0];
  //     const objUpload = {
  //       susc: 'plataforma',
  //       tipo: 'galeria', // <-- Guardamos en la carpeta de galeria
  //       id: '0'
  //     };

  //     if (file) {
  //       const reader = new FileReader();
  //       reader.onload = (e: any) => {
  //         this.selectedFileUrl = e.target.result;
  //       };
  //       reader.readAsDataURL(file);

  //       this._uploadService.uploadUserPhoto(file, objUpload).subscribe({
  //         next: (path: any) => {
  //           this.FormRegistro.imagenGaleria = path.nombreArchivo;
  //           this.userPhotoUrl = path.nombreArchivo;
  //         },
  //         error: () => {
  //           this._swalService.getAlertError(this.translate.instant('PLATAFORMA.UPLOADPHOTOERROR'));
  //         }
  //       });
  //     } else {
  //       this.selectedFileUrl = null;
  //       this.userPhotoUrl = '';
  //     }
  //   }

  btnRegresarClick() {
    this.router.navigate(['/biblioteca/galeria']);
  }

  toggleNav(): void {
    this.toggleSidebar.emit();
  }
}
