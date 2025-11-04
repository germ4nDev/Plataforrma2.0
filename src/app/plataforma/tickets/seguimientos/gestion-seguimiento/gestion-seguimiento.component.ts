/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/use-lifecycle-interface */
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription, tap, catchError, of, Observable } from 'rxjs';
import { PTLRequerimientoTKModel } from 'src/app/theme/shared/_helpers/models/PTLRequerimientoTK.model';
import { PTLSeguimientoRQModel } from 'src/app/theme/shared/_helpers/models/PTLSeguimientoRQ.model';
import { PTLEstadosService } from 'src/app/theme/shared/service/ptlestados.service';
import { PTLRequerimientosTkService } from 'src/app/theme/shared/service/ptlrequerimientos-tk.service';
import { PTLSeguimientosRqService } from 'src/app/theme/shared/service/ptlseguimientos-rq.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NavBarComponent } from 'src/app/theme/layout/admin/nav-bar/nav-bar.component';
import { NavContentComponent } from 'src/app/theme/layout/admin/navigation/nav-content/nav-content.component';
import { NavigationItem } from 'src/app/theme/layout/admin/navigation/navigation';
import { v4 as uuidv4 } from 'uuid';
import Swal from 'sweetalert2';
import { LocalStorageService, NavigationService } from 'src/app/theme/shared/service';
import { TextEditorComponent } from 'src/app/theme/shared/components/text-editor/text-editor.component';

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
  registrosSub?: Subscription;
  form: undefined;
  isSubmit: boolean = false;
  modoEdicion: boolean = false;
  codeRegistro = uuidv4();
  tipoEstado: number = 1;
  estadosFiltrados: any[] = [];
  tipoEditorTexto = 'basica';
  lockScreenSubscription: Subscription | undefined;
  isLocked: boolean = false;
  lockMessage: string = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private translate: TranslateService,
    private _navigationService: NavigationService,
    private _localStorageService: LocalStorageService,
    private _registrosService: PTLSeguimientosRqService,
    private _requerimientoService: PTLRequerimientosTkService,
    private _estadosService: PTLEstadosService
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
    this.consultarRequerimientos();
    this.consultarEstado();
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
  }

  consultarEstado() {
    this._estadosService
      .getRegistros()
      .pipe(
        tap((resp: any) => {
          if (resp.ok) {
            this.estadosFiltrados = resp.estados.filter((estado: any) => estado.tipoEstado === this.tipoEstado);
            console.log('Estados filtrados:', this.estadosFiltrados);
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
      this.FormRegistro.estadoRequerimiento = estadoSeleccionado.siglaEstado;
    }
  }

  consultarRequerimientos() {
    this.registrosSub = this._requerimientoService
      .getRegistros()
      .pipe(
        tap((resp: any) => {
          if (resp.ok) {
            console.log('requerimiento', resp);
            this.requerimientos = resp.requerimientos;
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

  onRequerimientochangeClick(event: any) {
    const value = event.target.value;
    const requerimiento = this.requerimientos.filter((x) => x.requerimientoId == value)[0];
    this.FormRegistro.codigoRequerimiento = requerimiento.codigoRequerimiento;
  }

  actualizarDescripcionVersion(nuevoContenido: string): void {
    this.FormRegistro.descripcionSeguimiento = nuevoContenido;
    console.log('Descripción de versión actualizada:', this.FormRegistro.descripcionSeguimiento);
    // if (this.validationForm && this.isSubmit) {
    // }
  }

  btnGestionarRegistroClick(form: any) {
    this.isSubmit = true;
    if (!form.valid) {
      return;
    }

    if (this.modoEdicion) {
      this._registrosService.putModificarRegistro(this.FormRegistro).subscribe({
        // next: (resp: any) => {
        //   if (resp.ok) {
        //     Swal.fire('', 'El registro se modificó correctamente', 'success');
        //     this.router.navigate(['/help-desk/seguimientos/']);
        //   } else {
        //     Swal.fire('Error', resp.message || 'No se pudo actualizar el registro', 'error');
        //   }
        // },
        // error: (err: any) => {
        //   console.error(err);
        //   Swal.fire('Error', 'No se pudo actualizar el registro', 'error');
        // }
        next: (resp: any) => {
          if (resp.ok) {
            this._requerimientoService
              .putModificarEstadoRequerimiento(this.FormRegistro.codigoRequerimiento!, this.FormRegistro.estadoRequerimiento!)
              .subscribe({
                next: () => {
                  Swal.fire('', this.translate.instant('PLATAFORMA.MODIFICAR'), 'success');
                  this.router.navigate(['/help-desk/seguimientos/']);
                },
                error: (err) => {
                  console.error('Error al actualizar requerimiento', err);
                  Swal.fire('Error', this.translate.instant('SEGUIMIENTOS.GESTION.NOMODIFICOREQUERIMIENTO'), 'warning');
                  this.router.navigate(['/help-desk/seguimientos/']);
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
