//#region IMPORTS
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { Router } from '@angular/router';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { TranslateService } from '@ngx-translate/core';
import { BreadcrumbComponent } from '../../../theme/shared/components/breadcrumb/breadcrumb.component';
import { PTLAplicacionModel } from 'src/app/theme/shared/_helpers/models/PTLAplicacion.model';
import { PtlAplicacionesService } from 'src/app/theme/shared/service/ptlaplicaciones.service';
// import { LanguageService } from 'src/app/theme/shared/service/lenguage.service';
import { catchError, Subject, tap } from 'rxjs';
import { of, Subscription } from 'rxjs';
import Swal from 'sweetalert2';
//#endregion IMPORTS

@Component({
  selector: 'app-aplicaciones',
  standalone: true,
  imports: [CommonModule, DataTablesModule, SharedModule, BreadcrumbComponent, TranslateModule],
  templateUrl: './aplicaciones.component.html',
  styleUrl: './aplicaciones.component.scss'
})
export class AplicacionesComponent implements OnInit, AfterViewInit {
  //#region VARIABLES
  [x: string]: any;
  @ViewChild(DataTableDirective, { static: false })
  datatableElement!: DataTableDirective;
  registrosSub?: Subscription;
  dtColumnSearchingOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  aplicaciones: PTLAplicacionModel[] = [];
  tituloPagina: string = '';
  //#endregion VARIABLES

  constructor(
    private router: Router,
    private aplicacionesService: PtlAplicacionesService,
    private translate: TranslateService,
    // private languageService: LanguageService,
    private BreadCrumb: BreadcrumbComponent
  ) {}

  ngAfterViewInit(): void {
    this.BreadCrumb.setBreadcrumb();
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.columns().every(function () {
        const that = this;
        $('input', this.header()).on('keyup change', function () {
          const valor = $(this).val() as string;
          if (that.search() !== valor) {
            that.search(valor).draw();
          }
        });
      });
    });
  }

  ngOnInit() {
    this.BreadCrumb.setBreadcrumb();
    // Forzamos que ngx-translate lo aplique
    this.translate
      .get(['APLICACIONES.CODE', 'APLICACIONES.NAME', 'APLICACIONES.DESCRIPTION', 'APLICACIONES.STATUS', 'PLATAFORMA.OPTIONS'])
      .subscribe((translations) => {
        this.tituloPagina = translations['APLICACIONES.TITLE'];
        this.dtColumnSearchingOptions = {
          responsive: true,
          columns: [
            { title: translations['APLICACIONES.CODE'], data: 'codigoAplicacion' },
            { title: translations['APLICACIONES.NAME'], data: 'nombreAplicacion' },
            { title: translations['APLICACIONES.DESCRIPTION'], data: 'descripcionAplicacion' },
            { title: translations['APLICACIONES.STATUS'], data: 'estadoAplicacion' },
            { title: translations['PLATAFORMA.OPTIONS'], data: 'opciones' }
          ]
        };
        this.consultarAplicaciones();
        // });
      });
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  consultarAplicaciones() {
    this.registrosSub = this.aplicacionesService
      .getAplicaciones()
      .pipe(
        tap((resp: any) => {
          if (resp.ok) {
            resp.aplicaciones.forEach((app: any) => {
              app.nomEstado = app.estadoAplicacion == true ? 'Activa' : 'Inactiva';
            });
            this.aplicaciones = resp.aplicaciones;
            console.log('Todos las aplicaciones', this.aplicaciones);
            this.dtTrigger.next(null); // <--- Dispara la actualización de la tabla
            return;
          }
        }),
        catchError((err) => {
          return of(null);
        })
      )
      .subscribe();
  }

  filtrarColumna(columna: number, valor: string) {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.column(columna).search(valor).draw();
    });
  }

  getEstado(estado: boolean): string {
    return estado ? 'Activo' : 'Inactivo';
  }

  OnNuevaAplicaicionClick() {
    this.router.navigate(['aplicaciones/gestion-aplicacion']);
  }

  OnEditarAplicaicionClick(id: number) {
    this.router.navigate(['aplicaciones/gestion-aplicacion'], { queryParams: { aplicacionId: id } });
  }

  OnEliminarAplicaicionClick(id: number, nombre: string) {
    Swal.fire({
      title: this.translate.instant('APLICACIONES.ELIMINARTITULO'),
      text: this.translate.instant('APLICACIONES.ELIMINARTEXTO') + `"${nombre}".!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: this.translate.instant('PLATAFORMA.DELETE'),
      cancelButtonText: this.translate.instant('PLATAFORMA.CANCEL')
    }).then((result: any) => {
      if (result.isConfirmed) {
        this.aplicacionesService.eliminarAplicacion(id).subscribe({
          next: (resp: any) => {
            Swal.fire(this.translate.instant('APLICACIONES.ELIMINAREXITOSA'), resp.mensaje, 'success');
            this.aplicaciones = this.aplicaciones.filter((s) => s.aplicacionId !== id);
          },
          error: (err: any) => {
            Swal.fire('Error', this.translate.instant('APLICACIONES.ELIMINARERROR'), 'error');
            console.error('Error eliminando', err);
          }
        });
      }
    });
  }
}
