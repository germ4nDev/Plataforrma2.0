/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/use-lifecycle-interface */
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription, tap, catchError, of, Observable } from 'rxjs';
import { PTLRequerimientoTKModel } from 'src/app/theme/shared/_helpers/models/PTLRequerimientoTK.model';
import { PTLSeguimientoRQModel } from 'src/app/theme/shared/_helpers/models/PTLSeguimientoTK.model';
import { PTLEstadosService } from 'src/app/theme/shared/service/ptlestados.service';
import { PTLRequerimientosTkService } from 'src/app/theme/shared/service/ptlrequerimientos-tk.service';
import { PTLSeguimientosRqService } from 'src/app/theme/shared/service/ptlseguimientos-rq.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NavBarComponent } from 'src/app/theme/layout/admin/nav-bar/nav-bar.component';
import { NavContentComponent } from 'src/app/theme/layout/admin/navigation/nav-content/nav-content.component';
import { NavigationItem } from 'src/app/theme/layout/admin/navigation/navigation';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { v4 as uuidv4 } from 'uuid';
import Swal from 'sweetalert2';
import {
  LocalStorageService,
  NavigationService,
  PtllogActividadesService,
  PTLTicketsService,
  SwalAlertService,
  UploadFilesService
} from 'src/app/theme/shared/service';
import { TextEditorComponent } from 'src/app/theme/shared/components/text-editor/text-editor.component';
import { PTLTicketAPModel } from 'src/app/theme/shared/_helpers/models/PTLTicketAP.model';
import { PTLEstadoModel } from 'src/app/theme/shared/_helpers/models/PTLEstado.model';

@Component({
  selector: 'app-gestion-seguimiento',
  standalone: true,
  imports: [CommonModule, SharedModule, NavBarComponent, NavContentComponent, TextEditorComponent],
  templateUrl: './gestion-seguimiento.component.html',
  styleUrl: './gestion-seguimiento.component.scss'
})
export class GestionSeguimientoComponent {
  @Output() toggleSidebar = new EventEmitter<void>();
  menuItems!: Observable<NavigationItem[]>;
  FormRegistro: PTLSeguimientoRQModel = new PTLSeguimientoRQModel();
  requerimientos: PTLRequerimientoTKModel[] = [];
  ticketsSub?: Subscription;
  tickets: PTLTicketAPModel[] = [];
  estadosSub?: Subscription;
  estados: PTLEstadoModel[] = [];
  registrosSub?: Subscription;
  form: undefined;

  isSubmit: boolean = false;
  modoEdicion: boolean = false;
  codigoSeguimiento = uuidv4();
  tipoEstado: number = 1;
  estadosFiltrados: any[] = [];
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
    private _navigationService: NavigationService,
    private _localStorageService: LocalStorageService,
    private _registrosService: PTLSeguimientosRqService,
    private _requerimientoService: PTLRequerimientosTkService,
    private _ticketsService: PTLTicketsService,
    private _uploadService: UploadFilesService,
    private _estadosService: PTLEstadosService,
    private _logActividadesService: PtllogActividadesService,
    private _swalAlertService: SwalAlertService
  ) {
    this.isSubmit = false;
    this.route.queryParams.subscribe((params) => {
      const registroId = params['regId'];
      if (registroId) {
        // console.log('me llena el Id', registroId);
        this.modoEdicion = true;
        this._registrosService.getRegistroById(registroId).subscribe({
          next: (resp: any) => {
            console.log('resp', resp);
            this.FormRegistro = resp.seguimiento;
            const fechaString = this.FormRegistro.fechaSeguimiento;
            if (fechaString) {
              const fechaAsig = new Date(fechaString);
              this.FormRegistro.fecha = this.setFechaRiesgo(fechaAsig);
            }
            // console.log('datos del FormRegistro', this.FormRegistro);
          },
          error: () => {
            Swal.fire('Error', 'No se pudo obtener el seguimiento', 'error');
          }
        });
      } else {
        // console.log('no llena el Id', registroId);
        this.modoEdicion = false;
      }
    });
  }

  ngOnInit() {
    this._navigationService.getNavigationItems();
    this.menuItems = this._navigationService.menuItems$;
    this.consultarTickets();
    this.consultarEstados();
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
      this.FormRegistro.estadoSeguimiento = '';
      this.selectedFileUrl = this._uploadService.getFilePath('seguimientos', 'no-foto.png');
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

  consultarTickets() {
    this.ticketsSub = this._ticketsService
      .getRegistros()
      .pipe(
        tap((resp: any) => {
          if (resp.ok) {
            this.tickets = resp.tickets;
            console.log('Estados:', this.tickets);
          }
        }),
        catchError((err) => {
          console.error('Error al consultar tickets:', err);
          return of(null);
        })
      )
      .subscribe();
  }

  consultarEstados() {
    this.estadosSub = this._estadosService
      .getRegistros()
      .pipe(
        tap((resp: any) => {
          if (resp.ok) {
            this.estados = resp.estados;
            console.log('Estados:', this.estados);
          }
        }),
        catchError((err) => {
          console.error('Error al consultar estados:', err);
          return of(null);
        })
      )
      .subscribe();
  }

  onEstadoChangeClick(event: any) {
    const value = event.target.value;
    const estadoSeleccionado = this.estadosFiltrados.find((x) => x.siglaEstado == value);
    if (estadoSeleccionado) {
      this.FormRegistro.estadoSeguimiento = estadoSeleccionado.siglaEstado;
    }
  }

  onRequerimientochangeClick(event: any) {
    const value = event.target.value;
    const requerimiento = this.requerimientos.filter((x) => x.requerimientoId == value)[0];
    this.FormRegistro.codigoSeguimiento = requerimiento.codigoRequerimiento;
  }

  actualizarDescripcionVersion(nuevoContenido: string): void {
    this.FormRegistro.descripcionSeguimiento = nuevoContenido;
    console.log('Descripción de versión actualizada:', this.FormRegistro.descripcionSeguimiento);
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
      this.FormRegistro.capturaSeguimiento = '';
      reader.readAsDataURL(file);
      this._uploadService.uploadUserPhoto(file, objUpload).subscribe({
        next: (path: any) => {
          console.log('resultado', path);
          this.userPhotoUrl = path.nombreArchivo;
          this.FormRegistro.capturaSeguimiento = path.nombreArchivo;
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
    const registroData = form.value as PTLSeguimientoRQModel;
    if (registroData.fecha) {
      const { year, month, day } = registroData.fecha;
      const fecha = new Date(year, month - 1, day).toISOString();
      registroData.fechaSeguimiento = fecha;
    }
    if (this.modoEdicion) {
      registroData.capturaSeguimiento = this.FormRegistro.capturaSeguimiento;
      registroData.codigoUsuarioModificacion = this._localStorageService.getUsuarioLocalStorage().codigoUsuario;
      registroData.fechaModificacion = new Date().toISOString();

      this._registrosService.putModificarRegistro(registroData).subscribe({
        next: (resp: any) => {
          if (resp.ok) {
            const ticket = this.tickets.filter((x) => x.codigoTicket == registroData.codigoTicket)[0];
            ticket.estadoTicket = registroData.estadoSeguimiento;
            this._ticketsService.putModificarRegistro(ticket).subscribe({
              next: () => {
                const logData = {
                  codigoTipoLog: '',
                  codigoRespuesta: '201',
                  descripcionLog: this.translate.instant('PLATAFORMA.MODIFICAR')
                };
                this._logActividadesService.postCrearRegistro(logData).subscribe(() => console.log('log creado exitosamente'));
                this._swalAlertService.getAlertSuccess(this.translate.instant('PLATAFORMA.MODIFICAR'));

                Swal.fire('', this.translate.instant('PLATAFORMA.MODIFICAR'), 'success');
                this.router.navigate(['/tickets/seguimientos/']);
              },
              error: (err) => {
                console.error('Error al actualizar requerimiento', err);
                Swal.fire('Error', this.translate.instant('SEGUIMIENTOS.GESTION.NOMODIFICOREQUERIMIENTO'), 'warning');
                this.router.navigate(['/tickets/seguimientos/']);
              }
            });
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
      //   console.log('formregistro', this.FormRegistro);
      this._registrosService.postCrearRegistro(this.FormRegistro).subscribe({
        next: (resp: any) => {
          if (resp.ok) {
            Swal.fire('', this.translate.instant('PLATAFORMA.INSERTAR'), 'success');
            form.resetForm();
            this.isSubmit = false;
            this.router.navigate(['/help-desk/seguimientos/']);
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
    this.router.navigate(['/help-desk/seguimientos/']);
  }
  toggleNav(): void {
    this.toggleSidebar.emit();
  }
}
