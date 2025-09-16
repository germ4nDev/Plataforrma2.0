import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription, tap, catchError, of } from 'rxjs';
import { PTLEstadoModel } from 'src/app/theme/shared/_helpers/models/PTLEstado.model';
import { PTLRequerimientoTKModel } from 'src/app/theme/shared/_helpers/models/PTLRequerimientoTK.model';
import { PTLTicketAPModel } from 'src/app/theme/shared/_helpers/models/PTLTicketAP.model';
import { BreadcrumbComponent } from 'src/app/theme/shared/components/breadcrumb/breadcrumb.component';
import { LanguageService, NavigationService } from 'src/app/theme/shared/service';
import { PTLEstadosService } from 'src/app/theme/shared/service/ptlestados.service';
import { PTLRequerimientosTkService } from 'src/app/theme/shared/service/ptlrequerimientos-tk.service';
import { PTLTicketsService } from 'src/app/theme/shared/service/ptltickets.service';
import { PTLTiposEstadosService } from 'src/app/theme/shared/service/ptltipos-estados.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import Swal from 'sweetalert2';
import { v4 as uuidv4 } from 'uuid';
import { NavBarComponent } from "src/app/theme/layout/admin/nav-bar/nav-bar.component";
import { NavContentComponent } from "src/app/theme/layout/admin/navigation/nav-content/nav-content.component";
import { NavigationItem } from 'src/app/theme/layout/admin/navigation/navigation';

@Component({
  selector: 'tickets-gestion-requerimiento',
  standalone: true,
  imports: [CommonModule, SharedModule, NavBarComponent, NavContentComponent],
  templateUrl: './gestion-requerimiento.component.html',
  styleUrl: './gestion-requerimiento.component.scss'
})
export class GestionRequerimientoComponent {
  @Output() toggleSidebar = new EventEmitter<void>();
  menuItems: NavigationItem[] = [];
  FormRegistro: PTLRequerimientoTKModel = new PTLRequerimientoTKModel();
  ticket: PTLTicketAPModel[] = [];
  registrosSub?: Subscription;
  form: undefined;
  isSubmit: boolean = false;
  modoEdicion: boolean = false;
  codeRegistro = uuidv4();
  tipoEstado: number = 1;
  estadosFiltrados: any[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private navigationService: NavigationService,
    private registrosService: PTLRequerimientosTkService,
    private tickesService: PTLTicketsService,
    private tiposEstados: PTLTiposEstadosService,
    private estados: PTLEstadosService,
    private translate: TranslateService,
    private languageService: LanguageService,
    private BreadCrumb: BreadcrumbComponent
  ) {
    this.isSubmit = false;
  }

  ngOnInit() {
    const appCode = localStorage.getItem('aplicacionId') || 'plataforma';
    this.menuItems = this.navigationService.getNavigationItems(appCode);
    this.consultarTickets();
    this.consultarEstado();
    this.route.queryParams.subscribe((params) => {
      const registroId = params['regId'];
      if (registroId) {
        console.log('me llena el Id', registroId);
        this.modoEdicion = true;
        this.registrosService.getRegistroById(registroId).subscribe({
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
  consultarEstado() {
    this.estados
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
    this.registrosSub = this.tickesService
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
    this.FormRegistro.ticketId = ticket.ticketId;
  }

  btnGestionarRegistroClick(form: any) {
    this.isSubmit = true;
    if (!form.valid) {
      return;
    }

    if (this.modoEdicion) {
      // console.log('1.0 modificar usuario', this.FormRegistro);
      this.registrosService.putModificarRegistro(this.FormRegistro).subscribe({
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
      this.registrosService.postCrearRegistro(this.FormRegistro).subscribe({
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
