/* eslint-disable @angular-eslint/use-lifecycle-interface */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
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
import { v4 as uuidv4 } from 'uuid';
import { PtlSuitesAPService } from 'src/app/theme/shared/service/ptlsuites-ap.service';
import { PTLSuiteAPModel } from 'src/app/theme/shared/_helpers/models/PTLSuiteAP.model';
import { PtlmodulosApService } from 'src/app/theme/shared/service/ptlmodulos-ap.service';
import { PTLModuloAP } from 'src/app/theme/shared/_helpers/models/PTLModuloAP.model';
import { TextEditorComponent } from 'src/app/theme/shared/components/text-editor/text-editor.component';
import { SwalAlertService } from 'src/app/theme/shared/service';

@Component({
  selector: 'app-gestion-modulo',
  standalone: true,
  imports: [CommonModule, SharedModule, TranslateModule, NavBarComponent, NavContentComponent, TextEditorComponent],
  templateUrl: './gestion-modulo.component.html',
  styleUrl: './gestion-modulo.component.scss'
})
export class GestionModuloComponent implements OnInit {
  // private props
  @Output() toggleSidebar = new EventEmitter<void>();
  FormRegistro: PTLModuloAP = new PTLModuloAP();
  menuItems$!: Observable<NavigationItem[]>;
  gradientConfig: any;
  navCollapsed: boolean = false;
  navCollapsedMob: boolean = false;
  windowWidth: number = 0;
  form: undefined;
  isSubmit: boolean;
  moduloId: number = 9;
  modoEdicion: boolean = false;
  aplicacionesSub?: Subscription;
  aplicaciones: PTLAplicacionModel[] = [];
  suitesSub?: Subscription;
  modulosSub?: Subscription;
  suites: PTLSuiteAPModel[] = [];
  modulosPadre: PTLModuloAP[] = [];
  codigoModulo = uuidv4();
  tipoEditorTexto = 'basica';

  // constructor
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private translate: TranslateService,
    private _registrosService: PtlmodulosApService,
    private _aplicacionesService: PtlAplicacionesService,
    private _suitesService: PtlSuitesAPService,
    private _layoutInitializer: LayoutInitializerService,
    private _swalAlertService: SwalAlertService,
    private _navigationService: NavigationService
  ) {
    this.isSubmit = false;
    GradientConfig.header_fixed_layout = true;
    this.gradientConfig = GradientConfig;
    this.navCollapsed = this.windowWidth >= 992 ? GradientConfig.isCollapse_menu : false;
    this.navCollapsedMob = false;
    this.route.queryParams.subscribe((params) => {
      this.moduloId = params['regId'];
      if (this.moduloId) {
        this.modoEdicion = true;
        this._registrosService.getRegistroById(this.moduloId).subscribe({
          next: (resp: any) => {
            this.FormRegistro = resp.modulo;
            console.log('formRegistro modulo', this.FormRegistro);
            this.consultarSuites(this.FormRegistro.codigoAplicacion);
            this.consultarMLodulos(this.FormRegistro.codigoSuite);
          },
          error: () => {
            this._swalAlertService.getAlertError('No se pudo obtener el modulo.')
          }
        });
      } else {
        this.FormRegistro.codigoModulo = uuidv4();
        this.modoEdicion = false;
      }
    });
  }

  ngOnInit() {
    this._navigationService.getNavigationItems();
    this.menuItems$ = this._navigationService.menuItems$;
    this.consultarAplicaciones();
    this.consultarSuites();
    this.consultarMLodulos();
    this._layoutInitializer.applyLayout();
  }

  consultarAplicaciones() {
    this.aplicacionesSub = this._aplicacionesService
      .getAplicaciones()
      .pipe(
        tap((resp: any) => {
          if (resp.ok) {
            this.aplicaciones = resp.aplicaciones;
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

  consultarSuites(codapp?: string) {
    this.suitesSub = this._suitesService
      .geSuitesAP()
      .pipe(
        tap((resp: any) => {
          if (resp.ok) {
            if (codapp) {
              this.suites = resp.suites.filter((x: { codigoAplicacion: string }) => x.codigoAplicacion == codapp);
            } else {
              this.suites = resp.suites;
            }
            console.log('Todos las suites', this.suites);
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

  onAplicacionChangeClick(event: any) {
    const value = event.target.value;
    const app = this.aplicaciones.filter((x) => x.codigoAplicacion == value)[0];
    this.FormRegistro.codigoAplicacion = app.codigoAplicacion || '';
    this.consultarSuites(app.codigoAplicacion);
  }

  consultarMLodulos(codSuite?: string) {
    this.modulosSub = this._registrosService
      .getRegistros()
      .pipe(
        tap((resp: any) => {
          if (resp.ok) {
            console.log('todos los modulos', resp.modulos);
            if (codSuite) {
              const modulosSuite = resp.modulos.filter((x: { codigoSuite: string }) => x.codigoSuite == codSuite);
              this.modulosPadre = modulosSuite.filter((x: { hijos: boolean }) => x.hijos == true);
            } else {
              this.modulosPadre = resp.modulos.filter((x: { hijos: boolean }) => x.hijos == true);
            }
            console.log('Todos las modulos padre', this.modulosPadre);
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

  onSuiteChangeClick(event: any) {
    const value = event.target.value;
    const suite = this.suites.filter((x) => x.codigoSuite == value)[0];
    this.FormRegistro.codigoSuite = suite.codigoSuite || '';
    this.consultarMLodulos(this.FormRegistro.codigoSuite);
  }

  onCodigoPadreChangeClick(event: any) {
    const value = event.target.value;
    this.FormRegistro.codigoPadre = value || '';
  }

  actualizarDescripcionVersion(nuevoContenido: string): void {
    this.FormRegistro.descripcionModulo = nuevoContenido;
    console.log('Descripción de versión actualizada:', this.FormRegistro.descripcionModulo);
    // if (this.validationForm && this.isSubmit) {
    // }
  }

  btnGestionarRegistroClick(form: any) {
    this.isSubmit = true;
    if (!form.valid) {
      return;
    }
    if (this.modoEdicion) {
      this._registrosService.putModificarRegistro(this.FormRegistro, this.moduloId).subscribe({
        next: (resp: any) => {
          if (resp.ok) {
            this._swalAlertService.getAlertSuccess(this.translate.instant('PLATAFORMA.MODIFICAR'));
            this.router.navigate(['/aplicaciones/modulos']);
          } else {
            this._swalAlertService.getAlertError(resp.message || this.translate.instant('PLATAFORMA.NOMODIFICO'));
          }
        },
        error: (err: any) => {
          console.error(err);
          this._swalAlertService.getAlertError(this.translate.instant('PLATAFORMA.NOMODIFICO'));
        }
      });
    } else {
      console.log('insertar formRegistro', this.FormRegistro);
      this._registrosService.postCrearRegistro(this.FormRegistro).subscribe({
        next: (resp: any) => {
            console.log('reesp', resp);

          if (resp.ok) {
            this._swalAlertService.getAlertSuccess(this.translate.instant('PLATAFORMA.INSERTAR'));
            form.resetForm();
            this.isSubmit = false;
            this.router.navigate(['/aplicaciones/modulos']);
          }
        },
        error: (err: any) => {
          console.error(err);
          this._swalAlertService.getAlertError( this.translate.instant('PLATAFORMA.NOINSERTO') + ', ' + err);
        }
      });
    }
  }

  btnRegresarClick() {
    this.router.navigate(['/aplicaciones/modulos']);
  }

  toggleNav(): void {
    this.toggleSidebar.emit();
  }
}
