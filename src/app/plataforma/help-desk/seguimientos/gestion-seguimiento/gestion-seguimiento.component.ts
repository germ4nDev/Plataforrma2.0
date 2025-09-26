import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription, tap, catchError, of } from 'rxjs';
import { PTLRequerimientoTKModel } from 'src/app/theme/shared/_helpers/models/PTLRequerimientoTK.model';
import { PTLSeguimientoRQModel } from 'src/app/theme/shared/_helpers/models/PTLSeguimientoRQ.model';
import { BreadcrumbComponent } from 'src/app/theme/shared/components/breadcrumb/breadcrumb.component';
import { LanguageService, NavigationService } from 'src/app/theme/shared/service';
import { PTLEstadosService } from 'src/app/theme/shared/service/ptlestados.service';
import { PTLRequerimientosTkService } from 'src/app/theme/shared/service/ptlrequerimientos-tk.service';
import { PTLSeguimientosRqService } from 'src/app/theme/shared/service/ptlseguimientos-rq.service';
import { PTLTiposEstadosService } from 'src/app/theme/shared/service/ptltipos-estados.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import Swal from 'sweetalert2';
import { v4 as uuidv4 } from 'uuid';
import { NavBarComponent } from "src/app/theme/layout/admin/nav-bar/nav-bar.component";
import { NavContentComponent } from "src/app/theme/layout/admin/navigation/nav-content/nav-content.component";
import { NavigationItem } from 'src/app/theme/layout/admin/navigation/navigation';


@Component({
  selector: 'app-gestion-seguimiento',
  standalone: true,
  imports: [CommonModule, SharedModule, NavBarComponent, NavContentComponent],
  templateUrl: './gestion-seguimiento.component.html',
  styleUrl: './gestion-seguimiento.component.scss'
})
export class GestionSeguimientoComponent {
  @Output() toggleSidebar = new EventEmitter<void>();
  menuItems: NavigationItem[] = [];
  FormRegistro: PTLSeguimientoRQModel = new PTLSeguimientoRQModel();
  requerimientos: PTLRequerimientoTKModel[] = [];
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
    private registrosService: PTLSeguimientosRqService,
    private requerimientoService: PTLRequerimientosTkService,
    private tiposEstados: PTLTiposEstadosService,
    private estadosService: PTLEstadosService,
    private translate: TranslateService
  ) {
    this.isSubmit = false;
  }

  ngOnInit() {
    // this.BreadCrumb.setBreadcrumb();
    const appCode = localStorage.getItem('aplicacionId') || 'plataforma';
    this.menuItems = this.navigationService.getNavigationItems(appCode);
    this.consultarRequerimientos();
    this.consultarEstado();
    this.route.queryParams.subscribe((params) => {
      const registroId = params['regId'];
      if (registroId) {
        // console.log('me llena el Id', registroId);
        this.modoEdicion = true;
        this.registrosService.getRegistroById(registroId).subscribe({
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

  consultarEstado() {
    this.estadosService
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
    this.registrosSub = this.requerimientoService
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
    this.FormRegistro.requerimientoId = requerimiento.requerimientoId;
  }

  btnGestionarRegistroClick(form: any) {
    this.isSubmit = true;
    if (!form.valid) {
      return;
    }

    if (this.modoEdicion) {
      this.registrosService.putModificarRegistro(this.FormRegistro).subscribe({
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
            this.requerimientoService
              .putModificarEstadoRequerimiento(this.FormRegistro.requerimientoId!, this.FormRegistro.estadoRequerimiento!)
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
      this.registrosService.postCrearRegistro(this.FormRegistro).subscribe({
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
