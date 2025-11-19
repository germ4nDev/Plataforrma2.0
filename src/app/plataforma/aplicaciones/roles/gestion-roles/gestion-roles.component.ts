/* eslint-disable @typescript-eslint/no-explicit-any */
//#region IMPORTS
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { PTLRoleAPModel } from '../../../../theme/shared/_helpers/models/PTLRoleAP.model';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { PTLRolesAPService } from 'src/app/theme/shared/service/ptlroles-ap.service';
import { PtlAplicacionesService } from 'src/app/theme/shared/service/ptlaplicaciones.service';
import { PTLAplicacionModel } from 'src/app/theme/shared/_helpers/models/PTLAplicacion.model';
import { catchError, Observable, of, Subscription, tap } from 'rxjs';
import { NavBarComponent } from 'src/app/theme/layout/admin/nav-bar/nav-bar.component';
import { NavContentComponent } from 'src/app/theme/layout/admin/navigation/nav-content/nav-content.component';
import { NavigationService } from 'src/app/theme/shared/service/navigation.service';
import { v4 as uuidv4 } from 'uuid';
import { NavigationItem } from 'src/app/theme/shared/_helpers/models/Navigation.model';
import { TextEditorComponent } from 'src/app/theme/shared/components/text-editor/text-editor.component';
import { LocalStorageService, PtllogActividadesService, SwalAlertService } from 'src/app/theme/shared/service';
//#endregion IMPORTS

@Component({
  selector: 'app-gestion-roles',
  standalone: true,
  imports: [CommonModule, SharedModule, TranslateModule, NavBarComponent, NavContentComponent, TextEditorComponent],
  templateUrl: './gestion-roles.component.html',
  styleUrl: './gestion-roles.component.scss'
})
export class GestionRolesComponent implements OnInit {
  @Output() toggleSidebar = new EventEmitter<void>();
  menuItems!: Observable<NavigationItem[]>;
  lockScreenSubscription: Subscription | undefined;
  isLocked: boolean = false;
  lockMessage: string = '';

  FormRegistro: PTLRoleAPModel = new PTLRoleAPModel();
  aplicaciones: PTLAplicacionModel[] = [];
  registrosSub?: Subscription;
  suitesSub?: Subscription;
  suites: any[] = [];
  suitesApp: any[] = [];
  form: undefined;
  isSubmit: boolean = false;
  modoEdicion: boolean = false;
  codeRole = uuidv4();
  tipoEditorTexto = 'basica';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private translate: TranslateService,
    private _logActividadesService: PtllogActividadesService,
    private _navigationService: NavigationService,
    private _registrosService: PTLRolesAPService,
    private _aplicacionesService: PtlAplicacionesService,
    private _localStorageService: LocalStorageService,
    private _swalAlertService: SwalAlertService
  ) {
    this.isSubmit = false;
    this.route.queryParams.subscribe((params) => {
      const registroId = params['regId'];
      if (registroId) {
        console.log('me llena el Id', registroId);
        this.modoEdicion = true;
        this._registrosService.getRegistroById(registroId).subscribe({
          next: (resp: any) => {
            console.log('resp', resp);
            // this.suitesApp = this.suites.filter((x) => x.aplicacionId == resp.role.aplicacionId);
            this.FormRegistro = resp.role;
            console.log('datos del FormRegistro', this.FormRegistro);
          },
          error: (err) => {
            const logData = {
              codigoTipoLog: '',
              codigoRespuesta: '501',
              descripcionLog: this.translate.instant('PLATAFORMA.NOMODIFICO') + err.mensaje
            };
            this._logActividadesService.postCrearRegistro(logData).subscribe(() => console.log('log creado exitosamente'));
            this._swalAlertService.getAlertError(this.translate.instant('PLATAFORMA.NOEXISTE') + err);
          }
        });
      } else {
        // console.log('no llena el Id', registroId);
        this.modoEdicion = false;
        // this.FormRegistro.codigoAplicacion = uuidv4();
      }
    });
  }

  ngOnInit() {
    this._navigationService.getNavigationItems();
    this.menuItems = this._navigationService.menuItems$;
    this.consultarAplicaciones();
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
      // console.log('modo edicion', this.modoEdicion);
      this.FormRegistro.codigoAplicacion = '';
      this.FormRegistro.codigoRole = uuidv4();
      this.FormRegistro.nombreRole = '';
      // console.log('FormRegistro', this.FormRegistro);
    }
  }

  consultarAplicaciones() {
    this.registrosSub = this._aplicacionesService
      .getAplicaciones()
      .pipe(
        tap((resp: any) => {
          if (resp.ok) {
            this.aplicaciones = resp.aplicaciones;
            // console.log('Todos las aplicaciones', this.aplicaciones);
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
    const app = this.aplicaciones.filter((x) => x.codigoAplicacion == value)[0];
    // console.log('Código de aplicación seleccionado:', value);
    // console.log('data aplicación seleccionado:', app);
    // this.FormRegistro.aplicacionId = app.aplicacionId;
    this.FormRegistro.codigoAplicacion = value;
    this.suitesApp = this.suites.filter((x) => x.aplicacionId == app.aplicacionId);
  }

  actualizarDescripcionVersion(nuevoContenido: string): void {
    this.FormRegistro.descripcionRole = nuevoContenido;
    console.log('Descripción de versión actualizada:', this.FormRegistro.descripcionRole);
    // if (this.validationForm && this.isSubmit) {
    // }
  }

  btnGestionarRegistroClick(form: any) {
    this.isSubmit = true;
    if (!form.valid) {
      return;
    }
    const registroData = form.value as PTLRoleAPModel;
    if (this.modoEdicion) {
      // console.log('1.0 modificar usuario', this.FormRegistro);
      registroData.codigoUsuarioModificacion = this._localStorageService.getUsuarioLocalStorage().codigoUsuario;
      registroData.fechaModificacion = new Date().toISOString();
      this._registrosService.putModificarRegistro(registroData).subscribe({
        next: (resp: any) => {
          if (resp.ok) {
            const logData = {
              codigoTipoLog: '',
              codigoRespuesta: '201',
              descripcionLog: this.translate.instant('PLATAFORMA.INSERTAR')
            };
            this._logActividadesService.postCrearRegistro(logData).subscribe(() => console.log('log creado exitosamente'));
            this._swalAlertService.getAlertSuccess(this.translate.instant('PLATAFORMA.INSERTAR'));
            this.router.navigate(['/aplicaciones/roles']);
          } else {
            const logData = {
              codigoTipoLog: '',
              codigoRespuesta: '501',
              descripcionLog: this.translate.instant('PLATAFORMA.NOMODIFICO') + resp.mensaje
            };
            this._logActividadesService.postCrearRegistro(logData).subscribe(() => console.log('log creado exitosamente'));
            this._swalAlertService.getAlertError(this.translate.instant('PLATAFORMA.NOMODIFICO') + this.FormRegistro.nombreRole);
          }
        },
        error: (err: any) => {
          console.error(err);
          const logData = {
            codigoTipoLog: '',
            codigoRespuesta: '501',
            descripcionLog: this.translate.instant('PLATAFORMA.NOMODIFICO') + err.mensaje
          };
          this._logActividadesService.postCrearRegistro(logData).subscribe(() => console.log('log creado exitosamente'));
          this._swalAlertService.getAlertError(this.translate.instant('PLATAFORMA.NOMODIFICO') + err);
        }
      });
    } else {
      console.log('formResgistro', this.FormRegistro);
      registroData.codigoRole = uuidv4();
      registroData.codigoAplicacion = this.FormRegistro.codigoAplicacion;
      registroData.nombreRole = this.FormRegistro.nombreRole;
      registroData.descripcionRole = this.FormRegistro.descripcionRole;
      registroData.estadoRole = this.FormRegistro.estadoRole;
      registroData.fechaCreacion = new Date().toISOString();
      registroData.codigoUsuarioCreacion = this._localStorageService.getUsuarioLocalStorage().codigoUsuario;
      //   registroData.fechaModificacion = new Date().toISOString();
      //   registroData.codigoUsuarioModificacion = this._localStorageService.getUsuarioLocalStorage().codigoUsuario;
      console.log('registroData', registroData);
      this._registrosService.postCrearRegistro(registroData).subscribe({
        next: (resp: any) => {
          if (resp.ok) {
            const logData = {
              codigoTipoLog: '',
              codigoRespuesta: '201',
              descripcionLog: this.translate.instant('PLATAFORMA.MODIFICAR')
            };
            this._logActividadesService.postCrearRegistro(logData).subscribe(() => console.log('log creado exitosamente'));
            this._swalAlertService.getAlertSuccess(this.translate.instant('PLATAFORMA.INSERTAR'));
            form.resetForm();
            this.isSubmit = false;
            this.router.navigate(['/aplicaciones/roles']);
          }
        },
        error: (err: any) => {
          const logData = {
            codigoTipoLog: '',
            codigoRespuesta: '501',
            descripcionLog: this.translate.instant('PLATAFORMA.NOMODIFICO')
          };
          this._logActividadesService.postCrearRegistro(logData).subscribe(() => console.log('log creado error'));
          this._swalAlertService.getAlertError(this.translate.instant('PLATAFORMA.NOMODIFICO') + err);
        }
      });
    }
  }

  btnRegresarClick() {
    this.router.navigate(['/aplicaciones/roles']);
  }

  toggleNav(): void {
    this.toggleSidebar.emit();
  }
}
