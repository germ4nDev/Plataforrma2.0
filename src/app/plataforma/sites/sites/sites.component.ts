/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { Router} from '@angular/router';
import { PTLSitiosAP } from 'src/app/theme/shared/_helpers/models/PTLSitioAP.model';
import { PTLSitiosAPService } from 'src/app/theme/shared/service/ptlsitios-ap.service';
import { Subject } from 'rxjs';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

// project import
import { BreadcrumbComponent } from '../../../theme/shared/components/breadcrumb/breadcrumb.component';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-sites',
  standalone: true,
  imports: [CommonModule, DataTablesModule, SharedModule, BreadcrumbComponent,TranslateModule],
  templateUrl: './sites.component.html',
  styleUrl: './sites.component.scss'
})
export class SitesComponent implements OnInit, AfterViewInit {
    [x: string]: any;
    @ViewChild(DataTableDirective, { static: false })
    datatableElement!: DataTableDirective;

    dtColumnSearchingOptions: DataTables.Settings = {};
    dtTrigger: Subject<any> = new Subject<any>();
    sitiosAP: PTLSitiosAP[]=[];

  constructor(
    private router: Router,
    private sitiosService:PTLSitiosAPService,
    private translate: TranslateService,
    private BreadCrumb : BreadcrumbComponent
  ) {}

  ngOnInit() {

    this.dtColumnSearchingOptions = {
        responsive: true,
        columns: [
          { title: this.translate.instant('SITIOS.NAME'), data: 'nombreSitio' },
          { title: this.translate.instant('SITIOS.DESCRIPTION'), data: 'descripcionSitio' },
          { title: this.translate.instant('SITIOS.URL'), data: 'urlSitio' },
          { title: this.translate.instant('SITIOS.SITESPORT'), data: 'puertoSitio' },
          { title: this.translate.instant('SITIOS.STATUS'), data: 'estadoSitio' },
          { title: this.translate.instant('SITIOS.OPTIONS'), data: 'opciones' },
        ]
      };

      this.consultarSitios();
  }

  consultarSitios () {
    this.sitiosService.getSitios().subscribe((sitios:any) => {
        console.log('Todos los sitios', sitios.resp.data);
        this.sitiosAP = sitios.resp.data;
        this.dtTrigger.next(null);// <--- Dispara la actualización de la tabla
    });
  }

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

  filtrarColumna(columna: number, valor: string) {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.column(columna).search(valor).draw();
    });
  }

  getEstado(estado: boolean): string {
    return estado ? 'Activo' : 'Inactivo';
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe(); // <--- Destruye el trigger para evitar memory leaks
  }
  nuevoSitio() {
    this.router.navigate(['/sites/new-site']);
  }

  editarSitio(id: number) {
    this.router.navigate(['/sites/new-site'], { queryParams: { sitioId: id } });
  }

  eliminarSitio(id: number, nombre: string) {
    Swal.fire({
        title: this.translate.instant('SITIOS.ELIMINARTITULO'),
        text: this.translate.instant('SITIOS.ELIMINARTEXTO') + `"${nombre}".!`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: this.translate.instant('PLATAFORMA.DELETE'),
        cancelButtonText: this.translate.instant('PLATAFORMA.CANCEL')
    }).then((result) => {
      if (result.isConfirmed) {
        this.sitiosService.eliminarSitio(id).subscribe({
          next: (resp:any) => {
            Swal.fire(this.translate.instant('SITIOS.ELIMINAREXITOSA'), resp.mensaje, 'success');
            this.sitiosAP = this.sitiosAP.filter(s => s.sitioId !== id);
          },
          error: (err:any) => {
            Swal.fire('Error', this.translate.instant('SITIOS.ELIMINARERROR'), 'error');
            console.error('Error eliminando', err);
          }
        });
      }
    });
  }
}
