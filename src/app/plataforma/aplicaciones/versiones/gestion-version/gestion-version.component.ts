// /* eslint-disable @angular-eslint/use-lifecycle-interface */
// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { Component, EventEmitter, OnInit, Output } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { SharedModule } from 'src/app/theme/shared/shared.module';
// import { ActivatedRoute, Router } from '@angular/router';
// import { PtlAplicacionesService } from 'src/app/theme/shared/service/ptlaplicaciones.service';
// import { catchError, of, Subscription, tap } from 'rxjs';
// import { PTLAplicacionModel } from 'src/app/theme/shared/_helpers/models/PTLAplicacion.model';
// import { TranslateModule, TranslateService } from '@ngx-translate/core';
// import { GradientConfig } from 'src/app/app-config';
// import { NavBarComponent } from 'src/app/theme/layout/admin/nav-bar/nav-bar.component';
// import { NavContentComponent } from 'src/app/theme/layout/admin/navigation/nav-content/nav-content.component';
// import { NavigationItem } from 'src/app/theme/layout/admin/navigation/navigation';
// import { LayoutInitializerService } from 'src/app/theme/shared/service/layout-initializer.service';
// import { NavigationService } from 'src/app/theme/shared/service/navigation.service';
// import { PtlversionesApService } from 'src/app/theme/shared/service/ptlversiones-ap.service';
// import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
// import { v4 as uuidv4 } from 'uuid';
// import Swal from 'sweetalert2';
// import { TextEditorComponent } from "src/app/theme/shared/components/text-editor/text-editor.component";
// // import { PTLVersionAP } from 'src/app/theme/shared/_helpers/models/PTLVersionAP.model';

// interface RegistroForm {
//     codigoAplicacion: string;
//     fecha: NgbDateStruct | null;
//     fechaVersion: Date;
//     codigoVersion: string;
//     nombreVersion: string;
//     descripcionVersion: string;
//     estadoVersion: boolean;
// }

// @Component({
//   selector: 'app-gestion-version',
//   standalone: true,
//   imports: [CommonModule, SharedModule, TranslateModule, NavBarComponent, NavContentComponent, TextEditorComponent],
//   templateUrl: './gestion-version.component.html',
//   styleUrl: './gestion-version.component.scss'
// })
// export class GestionVersionComponent implements OnInit {
//   // private props
//   @Output() toggleSidebar = new EventEmitter<void>();
//     // FormRegistro: PTLVersionAP = new PTLVersionAP();
//   public FormRegistro: RegistroForm = {
//     codigoAplicacion: '',
//     fecha: null,
//     fechaVersion: new Date(),
//     codigoVersion: '0.0.0.0',
//     nombreVersion: '',
//     descripcionVersion: '',
//     estadoVersion: true
//   };
//   tipoEditorDescripcion = 'basica';
//   menuItems: NavigationItem[] = [];
//   gradientConfig: any;
//   navCollapsed: boolean = false;
//   navCollapsedMob: boolean = false;
//   windowWidth: number = 0;
//   registroId: number = 0;
//   form: undefined;
//   isSubmit: boolean;
//   modoEdicion: boolean = false;
//   aplicacionesSub?: Subscription;
//   aplicaciones: PTLAplicacionModel[] = [];
//   codigosuite = uuidv4();

//   // constructor
//   constructor(
//     private router: Router,
//     private route: ActivatedRoute,
//     private translate: TranslateService,
//     private _registrosService: PtlversionesApService,
//     private _aplicacionesService: PtlAplicacionesService,
//     private _layoutInitializer: LayoutInitializerService,
//     private _navigationService: NavigationService
//   ) {
//     this.isSubmit = false;
//     GradientConfig.header_fixed_layout = true;
//     this.gradientConfig = GradientConfig;
//     this.navCollapsed = this.windowWidth >= 992 ? GradientConfig.isCollapse_menu : false;
//     this.navCollapsedMob = false;
//     this.route.queryParams.subscribe((params) => {
//       this.registroId = params['regId'];
//       if (this.registroId) {
//         this.modoEdicion = true;
//         this._registrosService.getRegistroById(this.registroId).subscribe({
//           next: (resp: any) => {
//             const version = resp.version;
//             console.log('version', resp.version);
//             const fechaVersion = new Date(version.fechaVersion);
//             console.log('fechaVeersion', fechaVersion);
//             const year = fechaVersion.getUTCFullYear();
//             const month = fechaVersion.getUTCMonth() + 1;
//             const day = fechaVersion.getUTCDate();
//             const dateStruct: NgbDateStruct = {
//                 year: year,
//                 month: month,
//                 day: day
//             };
//             this.FormRegistro = version;
//             this.FormRegistro.fecha = dateStruct;
//             console.log('formRegisto', this.FormRegistro);
//           },
//           error: () => {
//             Swal.fire('Error', 'No se pudo obtener la suite por, ', 'error');
//           }
//         });
//       } else {
//         this.FormRegistro.codigoVersion =  '0.0.0.0';
//         this.modoEdicion = false;
//       }
//     });
//   }

//   ngOnInit() {
//     this.menuItems = this._navigationService.getNavigationItems();
//     this.consultarAplicaciones();
//     this._layoutInitializer.applyLayout();
//   }

//   consultarAplicaciones() {
//     this.aplicacionesSub = this._aplicacionesService
//       .getAplicaciones()
//       .pipe(
//         tap((resp: any) => {
//           if (resp.ok) {
//             this.aplicaciones = resp.aplicaciones;
//             console.log('Todos las aplicaciones', this.aplicaciones);
//             return;
//           }
//         }),
//         catchError((err) => {
//           console.log('Ha ocurrido un error', err);
//           return of(null);
//         })
//       )
//       .subscribe();
//   }

//   onAplicacionchangeClick(event: any) {
//     const value = event.target.value;
//     const app = this.aplicaciones.filter((x) => x.codigoAplicacion == value)[0];
//     this.FormRegistro.codigoAplicacion = app.codigoAplicacion || '';
//   }

//   onDateChange(): void {
//     console.log('Fecha seleccionada:', this.FormRegistro.fechaVersion);
//   }

//   btnGestionarRegistroClick(form: any) {
//     this.isSubmit = true;
//     if (!form.valid) {
//       return;
//     }
//     if (this.FormRegistro.fecha != null) {
//         const fecha = new Date(this.FormRegistro.fecha.year + '-' + this.FormRegistro.fecha.month + '-' + this.FormRegistro.fecha.day);
//         this.FormRegistro.fechaVersion = fecha;
//     }

//     // const fecha = new Date(this.FormRegistro.fechaVersion);
//     if (this.modoEdicion) {
//         // this.FormRegistro.fechaVersion = fecha;
//       this._registrosService.putModificarRegistro(this.FormRegistro).subscribe({
//         next: (resp: any) => {
//           if (resp.ok) {
//             Swal.fire('', this.translate.instant('PLATAFORMA.MODIFICAR'), 'success');
//             this.router.navigate(['/aplicaciones/versiones']);
//           } else {
//             Swal.fire('Error', resp.message || this.translate.instant('PLATAFORMA.NOMODIFICO'), 'error');
//           }
//         },
//         error: (err: any) => {
//           console.error(err);
//           Swal.fire('Error', this.translate.instant('PLATAFORMA.NOMODIFICO'), 'error');
//         }
//       });
//     } else {
//       this._registrosService.postCrearRegistro(this.FormRegistro).subscribe({
//         next: (resp: any) => {
//           if (resp.ok) {
//             Swal.fire('', this.translate.instant('PLATAFORMA.INSERTAR'), 'success');
//             form.resetForm();
//             this.isSubmit = false;
//             this.router.navigate(['/aplicaciones/versiones']);
//           }
//         },
//         error: (err: any) => {
//           console.error(err);
//           Swal.fire('Error', this.translate.instant('PLATAFORMA.NOINSERTO'), 'error');
//         }
//       });
//     }
//   }

//   btnRegresarClick() {
//     this.router.navigate(['/aplicaciones/versiones']);
//   }

//   toggleNav(): void {
//     this.toggleSidebar.emit();
//   }

// }

/* eslint-disable @angular-eslint/use-lifecycle-interface */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { ActivatedRoute, Router } from '@angular/router';
import { PtlAplicacionesService } from 'src/app/theme/shared/service/ptlaplicaciones.service';
import { catchError, of, Subscription, tap } from 'rxjs';
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

  tipoEditorDescripcion = 'completa';
  menuItems: NavigationItem[] = [];
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

    // Lógica de carga de datos al inicializar la ruta
    this.route.queryParams.subscribe((params) => {
      this.registroId = params['regId'];
      if (this.registroId) {
        this.modoEdicion = true;
        this._registrosService.getRegistroById(this.registroId).subscribe({
          next: (resp: any) => {
            const version = resp.version;
            console.log('version', resp.version);

            // Reconstrucción de NgbDateStruct
            const fechaVersion = new Date(version.fechaVersion);
            const year = fechaVersion.getUTCFullYear();
            const month = fechaVersion.getUTCMonth() + 1;
            const day = fechaVersion.getUTCDate();
            const dateStruct: NgbDateStruct = {
              year: year,
              month: month,
              day: day
            };

            // Copiar todas las propiedades y asignar la fecha estructurada
            this.FormRegistro = { ...version };
            this.FormRegistro.fecha = dateStruct;

            // Asegurar que descripcionVersion sea string (importante para el editor)
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
    this.menuItems = this._navigationService.getNavigationItems();
    this.consultarAplicaciones();
    this._layoutInitializer.applyLayout();
  }

  /**
   * Manejador de evento cuando el contenido del editor de texto cambia.
   * Asigna el nuevo contenido HTML a la propiedad del modelo (Output del hijo),
   * utilizando el nombre de función esperado en el template HTML.
   * @param nuevoContenido El contenido HTML actualizado del editor.
   */
  actualizarDescripcionVersion(nuevoContenido: string): void {
    // Asignación explícita del valor del Output al modelo del componente padre.
    // Nota: El two-way binding ya lo hace, pero se mantiene para lógica explícita o debugging.
    this.FormRegistro.descripcionVersion = nuevoContenido;
    console.log('Descripción de versión actualizada:', this.FormRegistro.descripcionVersion);

    // 2. Ejecutar validación personalizada o lógica de negocio
    if (this.validationForm && this.isSubmit) {
       // Si el submit falló antes, puedes revalidar o manejar el estado aquí
    }
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
    // Buscamos la aplicación solo para lógica adicional o logs.
    const app = this.aplicaciones.find((x) => x.codigoAplicacion == value);
    if (app) {
      // Nota: Si el HTML usa [(ngModel)] en el <select>, esta línea es redundante,
      // pero se mantiene para lógica de negocio si es necesario
      this.FormRegistro.codigoAplicacion = app.codigoAplicacion || '';
    }
  }

  onDateChange(): void {
    // Hook de cambio de fecha. El modelo FormRegistro.fecha ya está actualizado.
    console.log('Fecha NgbDateStruct seleccionada:', this.FormRegistro.fecha);
  }

  btnGestionarRegistroClick(form: NgForm) { // Tipado a NgForm
    this.isSubmit = true;

    // --- VALIDACIÓN MANUAL PARA EL EDITOR (se mantiene) ---
    // Esta es necesaria porque el editor de texto no se integra con NgModel de forma nativa
    const descripcionValida = this.FormRegistro.descripcionVersion && this.FormRegistro.descripcionVersion.trim() !== '';
    if (!descripcionValida) {
      Swal.fire('Atención', this.translate.instant('VERSIONES.GESTION.REQUERIDODESCRIPCION'), 'warning');
      return;
    }
    // ------------------------------------------------

    if (!form.valid) {
      // Si hay otros errores de formulario (input, select), detenemos el proceso
      return;
    }

    // Convertir NgbDateStruct a Date antes de enviar
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
