/* eslint-disable @angular-eslint/use-lifecycle-interface */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription, tap, catchError, of, Observable } from 'rxjs';
import { PTLRequerimientoTKModel } from 'src/app/theme/shared/_helpers/models/PTLRequerimientoTK.model';
import { PTLTicketAPModel } from 'src/app/theme/shared/_helpers/models/PTLTicketAP.model';
import { PTLEstadosService } from 'src/app/theme/shared/service/ptlestados.service';
import { PTLRequerimientosTkService } from 'src/app/theme/shared/service/ptlrequerimientos-tk.service';
import { PTLTicketsService } from 'src/app/theme/shared/service/ptltickets.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NavBarComponent } from 'src/app/theme/layout/admin/nav-bar/nav-bar.component';
import { NavContentComponent } from 'src/app/theme/layout/admin/navigation/nav-content/nav-content.component';
import { NavigationItem } from 'src/app/theme/layout/admin/navigation/navigation';
import { LocalStorageService, NavigationService } from 'src/app/theme/shared/service';
import { TextEditorComponent } from 'src/app/theme/shared/components/text-editor/text-editor.component';
import Swal from 'sweetalert2';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-gestion-requerimiento',
  standalone: true,
  imports: [CommonModule, SharedModule, NavBarComponent, NavContentComponent, TextEditorComponent],
  templateUrl: './gestion-requerimiento.component.html',
  styleUrl: './gestion-requerimiento.component.scss'
})
export class GestionRequerimientoComponent {
  @Output() toggleSidebar = new EventEmitter<void>();
  menuItems!: Observable<NavigationItem[]>;
  FormRegistro: PTLRequerimientoTKModel = new PTLRequerimientoTKModel();
  ticket: PTLTicketAPModel[] = [];
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
    private _registrosService: PTLRequerimientosTkService,
    private _tickesService: PTLTicketsService,
    private _estadosService: PTLEstadosService
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
            this.FormRegistro = resp.requerimiento;
            console.log('datos del FormRegistro', this.FormRegistro);
          },
          error: () => {
            Swal.fire('Error', 'No se pudo obtener el requerimiento', 'error');
          }
        });
      } else {
        // console.log('no llena el Id', registroId);
        this.modoEdicion = false;
        this.FormRegistro = {
          ...this.FormRegistro,
          estadoRequerimiento: 'PE'
        };
        // this.FormRegistro.requerimientoId = uuidv4();
      }
    });
  }

  ngOnInit() {
    this._navigationService.getNavigationItems();
    this.menuItems = this._navigationService.menuItems$;
    this.consultarTickets();
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
    if (!this.modoEdicion) {
      console.log('modo edicion', this.modoEdicion);
    //   this.FormRegistro.codigoAplicacion = '';
    //   this.FormRegistro.codigoSuite = '';
      this.FormRegistro.estadoRequerimiento = 'PE';
    //   this.FormRegistro.codigoModulo = uuidv4();
      // this.FormRegistro.codigoModulo = uuidv4();
      console.log('FormRegistro', this.FormRegistro);
    }
  }

  consultarEstado() {
    this._estadosService
      .getRegistros()
      .pipe(
        tap((resp: any) => {
          if (resp.ok) {
            // ✅ Usar comparación con doble igual (o triple)
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
    const estadoSeleccionado = this.estadosFiltrados.find((x) => x.estadoId == value);
    if (estadoSeleccionado) {
      this.FormRegistro.estadoRequerimiento = estadoSeleccionado.siglaEstado;
    }
  }

  consultarTickets() {
    this.registrosSub = this._tickesService
      .getRegistros()
      .pipe(
        tap((resp: any) => {
          if (resp.ok) {
            this.ticket = resp.tickets;
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

  onTicketchangeClick(event: any) {
    const value = event.target.value;
    const ticket = this.ticket.filter((x) => x.ticketId == value)[0];
    this.FormRegistro.codigoTicket = ticket.codigoTicket;
  }

  actualizarDescripcionVersion(nuevoContenido: string): void {
    this.FormRegistro.descripcionRequerimiento = nuevoContenido;
    console.log('Descripción de versión actualizada:', this.FormRegistro.descripcionRequerimiento);
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
            this.router.navigate(['/help-desk/requerimientos/']);
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
            this.router.navigate(['/help-desk/requerimientos/']);
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
    this.router.navigate(['/help-desk/requerimientos/']);
  }

  toggleNav(): void {
    this.toggleSidebar.emit();
  }
}
