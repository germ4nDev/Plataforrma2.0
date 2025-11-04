/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/use-lifecycle-interface */
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription, tap, catchError, of, Observable } from 'rxjs';
import { PTLAplicacionModel } from 'src/app/theme/shared/_helpers/models/PTLAplicacion.model';
import {
  PtlAplicacionesService,
  NavigationService,
  LocalStorageService,
  PtlmodulosApService,
  PtlSuitesAPService,
  PTLEstadosService,
  UploadFilesService,
  SwalAlertService
} from 'src/app/theme/shared/service';
import { PTLTicketsService } from 'src/app/theme/shared/service/ptltickets.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NavBarComponent } from 'src/app/theme/layout/admin/nav-bar/nav-bar.component';
import { NavContentComponent } from 'src/app/theme/layout/admin/navigation/nav-content/nav-content.component';
import { NavigationItem } from 'src/app/theme/layout/admin/navigation/navigation';
import { PTLTicketAPModel } from 'src/app/theme/shared/_helpers/models/PTLTicketAP.model';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { v4 as uuidv4 } from 'uuid';
import Swal from 'sweetalert2';
import { TextEditorComponent } from 'src/app/theme/shared/components/text-editor/text-editor.component';
import { PTLModuloAP } from 'src/app/theme/shared/_helpers/models/PTLModuloAP.model';
import { PTLSuiteAPModel } from 'src/app/theme/shared/_helpers/models/PTLSuiteAP.model';
import { PtlusuariosScService } from '../../../../theme/shared/service/ptlusuarios-sc.service';
import { PTLUsuariosService } from '../../../../theme/shared/service/ptlusuarios.service';
import { PTLUsuarioModel } from 'src/app/theme/shared/_helpers/models/PTLUsuario.model';
import { PTLEstadoModel } from 'src/app/theme/shared/_helpers/models/PTLEstado.model';

@Component({
  selector: 'app-gestion-ticket',
  standalone: true,
  imports: [CommonModule, SharedModule, NavBarComponent, NavContentComponent, TextEditorComponent],
  templateUrl: './gestion-ticket.component.html',
  styleUrl: './gestion-ticket.component.scss'
})
export class GestionTicketComponent {
  @Output() toggleSidebar = new EventEmitter<void>();
  FormRegistro: PTLTicketAPModel = new PTLTicketAPModel();
  menuItems!: Observable<NavigationItem[]>;
  registrosSub?: Subscription;
  form: undefined;

  estadosTicketSub?: Subscription;
  estadosTicket: PTLEstadoModel[] = [];
  usuariosSub?: Subscription;
  usuarios: PTLUsuarioModel[] = [];
  aplicacionesSub?: Subscription;
  aplicaciones: PTLAplicacionModel[] = [];
  suitesSub?: Subscription;
  modulosSub?: Subscription;
  suites: PTLSuiteAPModel[] = [];
  modulos: PTLModuloAP[] = [];
  codigoTicket = uuidv4();

  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;
  userPhotoUrl: string = '';
  fileName: string | null = null;
  selectedFileUrl: string | null = null;

  isSubmit: boolean = false;
  modoEdicion: boolean = false;
  codeRegistro = uuidv4();
  tipoEditorTexto = 'basica';
  lockScreenSubscription: Subscription | undefined;
  isLocked: boolean = false;
  lockMessage: string = '';

  prioridades = [
    { prioridad: 'Mejora', color: '#2738F5' },
    { prioridad: 'Baja', color: '#009900' },
    { prioridad: 'Media', color: '#e6e600' },
    { prioridad: 'Alta', color: '#ff9933' },
    { prioridad: 'Urgente', color: '#ff0000' }
  ];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private translate: TranslateService,
    private _navigationService: NavigationService,
    private _modulosService: PtlmodulosApService,
    private _suitesService: PtlSuitesAPService,
    private _localStorageService: LocalStorageService,
    private _usuariosService: PTLUsuariosService,
    private _usuariosScService: PtlusuariosScService,
    private _aplicacionesScService: PtlAplicacionesService,
    private _registrosService: PTLTicketsService,
    private _estadosTicketService: PTLEstadosService,
    private _uploadService: UploadFilesService,
    private _swalService: SwalAlertService
  ) {
    this.isSubmit = false;
    this.route.queryParams.subscribe((params) => {
      const registroId = params['regId'];
      if (registroId != 'nuevo') {
        // console.log('me llena el Id', registroId);
        this.modoEdicion = true;
        this._registrosService.getRegistroById(registroId).subscribe({
          next: (resp: any) => {
            console.log('resp', resp);
            this.FormRegistro = resp.ticket;
            this.selectedFileUrl = this._uploadService.getFilePath('tickets', resp.ticket.capturaTicket);
            this.FormRegistro.fecha = this.setFechaRiesgo(new Date(resp.ticket.fechaAsogmacion) || new Date().toISOString());
            console.log('datos del FormRegistro', this.FormRegistro);
          },
          error: () => {
            Swal.fire('Error', 'No se pudo obtener el ticket', 'error');
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
    this.consultarEstadosTicket();
    this.consultarAplicaciones();
    this.consultarSuites();
    this.consultarModulos();
    this.consultarUsuairos();
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
      console.log('modo edicion', this.modoEdicion);
      this.FormRegistro.codigoAplicacion = '';
      this.FormRegistro.codigoSuite = '';
      this.FormRegistro.codigoModulo = '';
      this.FormRegistro.codigoUsuarioAsignado = '';
      this.FormRegistro.estadoTicket = '';
      this.FormRegistro.prioridad = '';
      this.FormRegistro.codigoTicket = uuidv4();
      this.selectedFileUrl = this._uploadService.getFilePath('tickets', 'no-foto.png');
      this.FormRegistro.fecha = this.setFechaRiesgo(new Date());
      console.log('FormRegistro', this.FormRegistro);
    }
  }

  setFechaRiesgo(fecha: Date) {
    const year = fecha.getUTCFullYear();
    const month = fecha.getUTCMonth() + 1;
    const day = fecha.getUTCDate();
    const dateStruct: NgbDateStruct = {
      year: year,
      month: month,
      day: day
    };
    return dateStruct;
  }

  consultarAplicaciones() {
    this.aplicacionesSub = this._aplicacionesScService
      .getAplicaciones()
      .pipe(
        tap((resp: any) => {
          if (resp.ok) {
            console.log('todos los aplicaciones', resp.aplicaciones);
            this.aplicaciones = resp.aplicaciones;
            console.log('Todos las aplicaciones padre', this.aplicaciones);
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

  consultarModulos(codSuite?: string) {
    this.modulosSub = this._modulosService
      .getRegistros()
      .pipe(
        tap((resp: any) => {
          if (resp.ok) {
            console.log('todos los modulos', resp.modulos);
            if (codSuite) {
              const modulosSuite = resp.modulos.filter((x: { codigoSuite: string }) => x.codigoSuite == codSuite);
              this.modulos = modulosSuite.filter((x: { hijos: boolean }) => x.hijos == true);
            } else {
              this.modulos = resp.modulos.filter((x: { hijos: boolean }) => x.hijos == true);
            }
            console.log('Todos las modulos padre', this.modulos);
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

  consultarUsuairos() {
    this.modulosSub = this._usuariosService
      .getUsuarios()
      .pipe(
        tap((resp: any) => {
          if (resp.ok) {
            console.log('todos los usuarios', resp.usuarios);
            this.usuarios = resp.usuarios;
            console.log('Todos las usuarios padre', this.usuarios);
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

  consultarEstadosTicket() {
    this.estadosTicketSub = this._estadosTicketService
      .getRegistros()
      .pipe(
        tap((resp: any) => {
          if (resp.ok) {
            console.log('todos los estados', resp.estados);
            this.estadosTicket = resp.estados;
            console.log('Todos las estados padre', this.estadosTicket);
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
    console.log('Código de aplicación seleccionado:', value);
    console.log('data aplicación seleccionado:', app);
    this.FormRegistro.codigoAplicacion = app.codigoAplicacion;
  }

  onSuiteChangeClick(event: any) {
    const value = event.target.value;
    const sui = this.suites.filter((x) => x.codigoSuite == value)[0];
    console.log('Código de suite seleccionado:', value);
    console.log('data suite seleccionado:', sui);
    this.FormRegistro.codigoSuite = sui.codigoSuite;
  }

  onModuloChangeClick(event: any) {
    const value = event.target.value;
    const mod = this.modulos.filter((x) => x.codigoModulo == value)[0];
    console.log('Código de modulo seleccionado:', value);
    console.log('data modulo seleccionado:', mod);
    this.FormRegistro.codigoModulo = mod.codigoModulo;
  }

  onPrioridadChangeClick(event: any) {
    const value = event.target.value;
    const prioridad = this.prioridades.filter((x) => x.prioridad == value)[0];
    console.log('Código de prioridad seleccionado:', value);
    console.log('data prioridad seleccionado:', prioridad);
    this.FormRegistro.prioridad = value;
    this.FormRegistro.colorPrioridad = prioridad.color;
  }

  onDateChange(): void {
    console.log('Fecha NgbDateStruct seleccionada:', this.FormRegistro.fecha);
  }

  actualizarDescripcionVersion(nuevoContenido: string): void {
    this.FormRegistro.descripcionTicket = nuevoContenido;
    console.log('Descripción de versión actualizada:', this.FormRegistro.descripcionTicket);
    // if (this.validationForm && this.isSubmit) {
    // }
  }

  actualizarDefinicinVersion(nuevoContenido: string): void {
    this.FormRegistro.definicionRequerimiento = nuevoContenido;
    console.log('Definicion de requerimiento actualizada:', this.FormRegistro.definicionRequerimiento);
    // if (this.validationForm && this.isSubmit) {
    // }
  }

  onFileSelectedClick(event: any) {
    const file: File = event.target.files[0];
    const objUpload = {
      suscriptor: '0',
      aplicacion: this._localStorageService.getAplicaicionLocalStorage().nombreAplicacion,
      tipo: 'tickets'
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
          this.userPhotoUrl = path.nombreArchivo;
        },
        error: () => {
          this._swalService.getAlertError(this.translate.instant('PLATAFORMA.UPLOADPHOTOERROR'));
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
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    console.log('CurrentUser', currentUser);
    this.FormRegistro.codigoUsuarioSender = currentUser.usuario?.usuarioId;
    const registroData = form.value as PTLTicketAPModel;
    if (this.modoEdicion) {
      // console.log('1.0 modificar usuario', this.FormRegistro);
      registroData.codigoUsuarioCreacion = this.FormRegistro.codigoUsuarioCreacion;
      registroData.fechaCreacion = this.FormRegistro.fechaCreacion;
      registroData.codigoUsuarioModificacion = this._localStorageService.getUsuarioLocalStorage().codigoUsuario;
      registroData.fechaModificacion = new Date().toISOString();
      this._registrosService.putModificarRegistro(registroData).subscribe({
        next: (resp: any) => {
          if (resp.ok) {
            Swal.fire('', this.translate.instant('PLATAFORMA.MODIFICAR'), 'success');
            this.router.navigate(['/help-desk/tickets/']);
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
      registroData.codigoTicket = uuidv4();
      registroData.codigoUsuarioCreacion = this._localStorageService.getUsuarioLocalStorage().codigoUsuario;
      registroData.fechaCreacion = new Date().toISOString();
      registroData.codigoUsuarioModificacion = '';
      registroData.fechaModificacion = '';
      console.log('insertar registro', registroData);
      this._registrosService.postCrearRegistro(registroData).subscribe({
        next: (resp: any) => {
          if (resp.ok) {
            Swal.fire('', this.translate.instant('PLATAFORMA.INSERTAR'), 'success');
            form.resetForm();
            this.isSubmit = false;
            this.router.navigate(['/help-desk/tickets/']);
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
    this.router.navigate(['/tickets/tickets/']);
  }

  toggleNav(): void {
    this.toggleSidebar.emit();
  }
}
