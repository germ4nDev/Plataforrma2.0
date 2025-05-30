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

@Component({
  selector: 'app-sites',
  standalone: true,
  imports: [CommonModule, DataTablesModule, SharedModule, BreadcrumbComponent],
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
    private BreadCrumb : BreadcrumbComponent
  ) {}

  ngOnInit() {

    this.dtColumnSearchingOptions = {
        responsive: true,
        columns: [
          { title: 'Nombre', data: 'nombreSitio' },
          { title: 'Descripción', data: 'descripcionSitio' },
          { title: 'URL', data: 'urlSitio' },
          { title: 'Puerto Sitio', data: 'puertoSitio' },
          { title: 'Estado', data: 'estadoSitio' },
          { title: 'Opciones', data: 'opciones' },
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
      title: '¿Estás seguro de eliminar?',
      text: `¡estas apunto de eliminar el sitio "${nombre}".!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.sitiosService.eliminarSitio(id).subscribe({
          next: (resp:any) => {
            Swal.fire('Eliminado', resp.mensaje, 'success');
            this.sitiosAP = this.sitiosAP.filter(s => s.sitioId !== id);
          },
          error: (err:any) => {
            Swal.fire('Error', 'No se pudo eliminar el sitio.', 'error');
            console.error('Error eliminando', err);
          }
        });
      }
    });
  }
}
