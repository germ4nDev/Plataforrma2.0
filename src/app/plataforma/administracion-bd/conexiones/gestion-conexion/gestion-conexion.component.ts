/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/use-lifecycle-interface */
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subscription, tap, catchError, of } from 'rxjs';
import { PTLAplicacionModel } from 'src/app/theme/shared/_helpers/models/PTLAplicacion.model';
import { PTLConexionBDModel } from 'src/app/theme/shared/_helpers/models/PTLConexionBD.model';
import { PTLPaquetesSCModel } from 'src/app/theme/shared/_helpers/models/PTLPaquetesSC.model';
import { PTLSuscriptorModel } from 'src/app/theme/shared/_helpers/models/PTLSuscriptor.model';
import { PtlAplicacionesService } from 'src/app/theme/shared/service';
import { PTLConexionesBDSTService } from 'src/app/theme/shared/service/ptlconexiones-bd-st.service';
import { PTLPaquetesSCService } from 'src/app/theme/shared/service/ptlpaquetes-sc.service';
import { PTLSuscriptoresService } from 'src/app/theme/shared/service/ptlsuscriptores.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { GradientConfig } from 'src/app/app-config';
import { NavBarComponent } from 'src/app/theme/layout/admin/nav-bar/nav-bar.component';
import { NavContentComponent } from 'src/app/theme/layout/admin/navigation/nav-content/nav-content.component';
import { NavigationItem } from 'src/app/theme/layout/admin/navigation/navigation';
import { LayoutInitializerService } from 'src/app/theme/shared/service/layout-initializer.service';
import { NavigationService } from 'src/app/theme/shared/service/navigation.service';
import { TextEditorComponent } from 'src/app/theme/shared/components/text-editor/text-editor.component';
import Swal from 'sweetalert2';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-gestion-conexion',
  standalone: true,
  imports: [CommonModule, SharedModule, TranslateModule, NavBarComponent, NavContentComponent, TextEditorComponent],
  templateUrl: './gestion-conexion.component.html',
  styleUrl: './gestion-conexion.component.scss'
})
export class GestionConexionComponent {
  @Output() toggleSidebar = new EventEmitter<void>();
  FormRegistro: PTLConexionBDModel = new PTLConexionBDModel();
  menuItems: NavigationItem[] = [];
  gradientConfig: any;
  navCollapsed: boolean = false;
  navCollapsedMob: boolean = false;
  windowWidth: number = 0;

  aplicaciones: PTLAplicacionModel[] = [];
  suscriptores: PTLSuscriptorModel[] = [];
  paquetes: PTLPaquetesSCModel[] = [];
  registrosSub?: Subscription;
  form: undefined;
  isSubmit: boolean = false;
  modoEdicion: boolean = false;
  codeRegistro = uuidv4();
  tipoEditorTexto = 'basica';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private translate: TranslateService,
    private _registrosService: PTLConexionesBDSTService,
    private _aplicacionesService: PtlAplicacionesService,
    private _suscriptoresService: PTLSuscriptoresService,
    private _paquetesService: PTLPaquetesSCService,
    private _layoutInitializer: LayoutInitializerService,
    private _navigationService: NavigationService
  ) {
    this.isSubmit = false;
    GradientConfig.header_fixed_layout = true
    this.gradientConfig = GradientConfig;
    this.navCollapsed = this.windowWidth >= 992 ? GradientConfig.isCollapse_menu : false;
    this.navCollapsedMob = false;
  }

  ngOnInit() {
    this.consultarAplicaciones();
    this.consultarSuscriptores();
    this.consultarPaquetes();
    this._layoutInitializer.applyLayout();
    this.menuItems = this._navigationService.getNavigationItems();
    this.route.queryParams.subscribe((params) => {
      const registroId = params['regId'];
      if (registroId) {
        console.log('me llena el Id', registroId);
        this.modoEdicion = true;
        this._registrosService.getRegistroById(registroId).subscribe({
          next: (resp: any) => {
            console.log('resp', resp);
            const app = this.aplicaciones.filter(x => x.aplicacionId == resp.aplicacionId)[0];
            const susc = this.suscriptores.filter(x => x.suscriptorId == resp.suscriptorId)[0];
            resp.nombreAplicacion = app.nombreAplicacion;
            resp.nombreSuscriptor = susc.nombreSuscriptor;
            // resp.nombrePaquete = paque.nombrePaquetes;
            this.FormRegistro = resp.paquetes;
            console.log('datos del FormRegistro', this.FormRegistro);
          },
          error: () => {
            Swal.fire('Error', 'No se pudo obtener el rol', 'error');
          }
        });
      } else {
        // console.log('no llena el Id', registroId);
        this.modoEdicion = false;
        // this.FormRegistro.aplicacionId = uuidv4();
      }
    });
  }

  consultarAplicaciones() {
    this.registrosSub = this._aplicacionesService
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

  consultarSuscriptores() {
    this.registrosSub = this._suscriptoresService
      .getSuscriptores()
      .pipe(
        tap((resp: any) => {
          if (resp.ok) {
            this.suscriptores = resp.suscriptores;
            console.log('Todos las suscriptores', this.suscriptores);
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

    consultarPaquetes() {
    this.registrosSub = this._paquetesService
      .getRegistros()
      .pipe(
        tap((resp: any) => {
          if (resp.ok) {
            this.paquetes = resp.paquetes;
            // console.log('Todos las paquetes', this.paquetes);
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
    const app = this.aplicaciones.filter((x) => x.aplicacionId == value)[0];
    this.FormRegistro.aplicacionId = app.aplicacionId;
    this.FormRegistro.aplicacionId = value;
  }

  onSuscriptorChangeClick(event: any) {
    const value = event.target.value;
    const suscriptor = this.suscriptores.filter((x) => x.suscriptorId == value)[0];
    // console.log('Código de suscriptor seleccionado:', value);
    // console.log('data suscriptor seleccionado:', suscriptor);
    this.FormRegistro.suscriptorId = suscriptor.suscriptorId;
    this.FormRegistro.suscriptorId = value;
  }

   onPaqueteChangeClick(event: any) {
    const value = event.target.value;
    const paquete = this.paquetes.filter((x) => x.suscriptorPaqueteId == value)[0];
    // console.log('Código de paquete seleccionado:', value);
    // console.log('data paquete seleccionado:', paquete);
    this.FormRegistro.paqueteId = paquete.suscriptorPaqueteId;
    this.FormRegistro.paqueteId = value;
  }

  actualizarDescripcionVersion(nuevoContenido: string): void {
    this.FormRegistro.descripcionConexion = nuevoContenido;
    console.log('Descripción de versión actualizada:', this.FormRegistro.descripcionConexion);
    // if (this.validationForm && this.isSubmit) {
    // }
  }

  btnGestionarRegistroClick(form: any) {
    this.isSubmit = true;
    if (!form.valid) {
      return;
    }
    if (this.modoEdicion) {
      // console.log('1.0 modificar usuario', this.FormRegistro);
      this._registrosService.putModificarRegistro(this.FormRegistro).subscribe({
        next: (resp: any) => {
          if (resp.ok) {
            Swal.fire('', this.translate.instant('PLATAFORMA.MODIFICAR'), 'success');
            this.router.navigate(['/administracion-bd/conexiones']);
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
      // console.log('formregistro', this.FormRegistro);
      this._registrosService.postCrearRegistro(this.FormRegistro).subscribe({
        next: (resp: any) => {
          if (resp.ok) {
            Swal.fire('', this.translate.instant('PLATAFORMA.INSERTAR'), 'success');
            form.resetForm();
            this.isSubmit = false;
            this.router.navigate(['/administracion-bd/conexiones']);
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
    this.router.navigate(['/administracion-bd/conexiones']);
  }

   toggleNav(): void {
    this.toggleSidebar.emit();
  }
}
