/* eslint-disable @angular-eslint/use-lifecycle-interface */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { ActivatedRoute, Router } from '@angular/router';
import { PtlAplicacionesService } from 'src/app/theme/shared/service/ptlaplicaciones.service';
import { catchError, Observable, of, Subscription, tap } from 'rxjs';
import { PTLAplicacionModel } from 'src/app/theme/shared/_helpers/models/PTLAplicacion.model';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { GradientConfig } from 'src/app/app-config';
import { NavBarComponent } from 'src/app/theme/layout/admin/nav-bar/nav-bar.component';
import { NavContentComponent } from 'src/app/theme/layout/admin/navigation/nav-content/nav-content.component';
import { NavigationItem } from 'src/app/theme/layout/admin/navigation/navigation';
import { LayoutInitializerService } from 'src/app/theme/shared/service/layout-initializer.service';
import { NavigationService } from 'src/app/theme/shared/service/navigation.service';
import { PtlversionesApService } from 'src/app/theme/shared/service/ptlversiones-ap.service';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { v4 as uuidv4 } from 'uuid';
import Swal from 'sweetalert2';
import { TextEditorComponent } from 'src/app/theme/shared/components/text-editor/text-editor.component';
import { NgForm } from '@angular/forms';

// Definición de la interfaz del modelo de formulario
interface RegistroForm {
  codigoAplicacion: string;
  fecha: NgbDateStruct | null;
  fechaVersion: Date;
  codigoVersion: string;
  nombreVersion: string;
  descripcionVersion: string;
  estadoVersion: boolean;
}

@Component({
  selector: 'app-gestion-version',
  standalone: true,
  imports: [CommonModule, SharedModule, TranslateModule, NavBarComponent, NavContentComponent, TextEditorComponent],
  templateUrl: './gestion-version.component.html',
  styleUrl: './gestion-version.component.scss'
})
export class GestionVersionComponent implements OnInit {

  @ViewChild('validationForm') validationForm!: NgForm;
  @Output() toggleSidebar = new EventEmitter<void>();

  public FormRegistro: RegistroForm = {
    codigoAplicacion: '',
    fecha: null,
    fechaVersion: new Date(),
    codigoVersion: '0.0.0.0',
    nombreVersion: '',
    descripcionVersion: '',
    estadoVersion: true
  };

  tipoEditorTexto = 'basica';
  menuItems$!: Observable<NavigationItem[]>;
  gradientConfig: any;
  navCollapsed: boolean = false;
  navCollapsedMob: boolean = false;
  windowWidth: number = 0;
  registroId: number = 0;
  isSubmit: boolean = false; // Inicialización explícita
  modoEdicion: boolean = false;
  aplicacionesSub?: Subscription;
  aplicaciones: PTLAplicacionModel[] = [];
  codigosuite = uuidv4();

  // constructor
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private translate: TranslateService,
    private _registrosService: PtlversionesApService,
    private _aplicacionesService: PtlAplicacionesService,
    private _layoutInitializer: LayoutInitializerService,
    private _navigationService: NavigationService
  ) {
    this.isSubmit = false;
    GradientConfig.header_fixed_layout = true;
    this.gradientConfig = GradientConfig;
    this.navCollapsed = this.windowWidth >= 992 ? GradientConfig.isCollapse_menu : false;
    this.navCollapsedMob = false;

    this.route.queryParams.subscribe((params) => {
      this.registroId = params['regId'];
      if (this.registroId) {
        this.modoEdicion = true;
        this._registrosService.getRegistroById(this.registroId).subscribe({
          next: (resp: any) => {
            const version = resp.version;
            console.log('version', resp.version);

            const fechaVersion = new Date(version.fechaVersion);
            const year = fechaVersion.getUTCFullYear();
            const month = fechaVersion.getUTCMonth() + 1;
            const day = fechaVersion.getUTCDate();
            const dateStruct: NgbDateStruct = {
              year: year,
              month: month,
              day: day
            };

            this.FormRegistro = { ...version };
            this.FormRegistro.fecha = dateStruct;
            this.FormRegistro.descripcionVersion = version.descripcionVersion || '';
            console.log('formRegisto', this.FormRegistro);
          },
          error: () => {
            Swal.fire('Error', 'No se pudo obtener la suite por, ', 'error');
          }
        });
      } else {
        this.FormRegistro.codigoVersion = '0.0.0.0';
        this.modoEdicion = false;
      }
    });
  }

  ngOnInit() {
    this._navigationService.getNavigationItems();
    this.menuItems$ = this._navigationService.menuItems$;
    this.consultarAplicaciones();
    this._layoutInitializer.applyLayout();
  }

  actualizarDescripcionVersion(nuevoContenido: string): void {
    this.FormRegistro.descripcionVersion = nuevoContenido;
    console.log('Descripción de versión actualizada:', this.FormRegistro.descripcionVersion);
    // if (this.validationForm && this.isSubmit) {
    // }
  }

  consultarAplicaciones() {
    this.aplicacionesSub = this._aplicacionesService
      .getAplicaciones()
      .pipe(
        tap((resp: any) => {
          if (resp.ok) {
            this.aplicaciones = resp.aplicaciones;
            console.log('Todos las aplicaciones', this.aplicaciones);
            return;
          }
        }),
        catchError((err) => {
          console.log('Ha ocurrido un error', err);
          return of(null);
        })
      )
      .subscribe();
  }

  onAplicacionchangeClick(event: any) {
    const value = event.target.value;
    const app = this.aplicaciones.find((x) => x.codigoAplicacion == value);
    if (app) {
      this.FormRegistro.codigoAplicacion = app.codigoAplicacion || '';
    }
  }

  onDateChange(): void {
    console.log('Fecha NgbDateStruct seleccionada:', this.FormRegistro.fecha);
  }

  btnGestionarRegistroClick(form: NgForm) { // Tipado a NgForm
    this.isSubmit = true;
    const descripcionValida = this.FormRegistro.descripcionVersion && this.FormRegistro.descripcionVersion.trim() !== '';
    if (!descripcionValida) {
      Swal.fire('Atención', this.translate.instant('VERSIONES.GESTION.REQUERIDODESCRIPCION'), 'warning');
      return;
    }
    if (!form.valid) {
      return;
    }

    if (this.FormRegistro.fecha) {
      const { year, month, day } = this.FormRegistro.fecha;
      const fecha = new Date(year, month - 1, day);
      this.FormRegistro.fechaVersion = fecha;
    }

    if (this.modoEdicion) {
      this._registrosService.putModificarRegistro(this.FormRegistro).subscribe({
        next: (resp: any) => {
          if (resp.ok) {
            Swal.fire('', this.translate.instant('PLATAFORMA.MODIFICAR'), 'success');
            this.router.navigate(['/aplicaciones/versiones']);
          } else {
            Swal.fire('Error', resp.message || this.translate.instant('PLATAFORMA.NOMODIFICO'), 'error');
          }
        },
        error: (err: any) => {
          console.error(err);
          Swal.fire('Error', this.translate.instant('PLATAFORMA.NOMODIFICO'), 'error');
        }
      });
    } else {
      this._registrosService.postCrearRegistro(this.FormRegistro).subscribe({
        next: (resp: any) => {
          if (resp.ok) {
            Swal.fire('', this.translate.instant('PLATAFORMA.INSERTAR'), 'success');
            form.resetForm();
            this.isSubmit = false;
            this.router.navigate(['/aplicaciones/versiones']);
          }
        },
        error: (err: any) => {
          console.error(err);
          Swal.fire('Error', this.translate.instant('PLATAFORMA.NOINSERTO'), 'error');
        }
      });
    }
  }

  btnRegresarClick() {
    this.router.navigate(['/aplicaciones/versiones']);
  }

  toggleNav(): void {
    this.toggleSidebar.emit();
  }
}
