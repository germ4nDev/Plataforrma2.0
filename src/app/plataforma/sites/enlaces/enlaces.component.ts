import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { Subject } from 'rxjs';
import Swal from 'sweetalert2';

import { BreadcrumbComponent } from '../../../theme/shared/components/breadcrumb/breadcrumb.component';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { PTLEnlaceST } from 'src/app/theme/shared/_helpers/models/PTLEnlacesST.model';
import { PTLEnlacesSTService } from 'src/app/theme/shared/service/ptlenlaces-st.service';

@Component({
  selector: 'app-enlaces',
  standalone: true,
  imports: [CommonModule, DataTablesModule, SharedModule, BreadcrumbComponent],
  templateUrl: './enlaces.component.html',
  styleUrls: ['./enlaces.component.css']
})
export class EnlacesComponent implements OnInit, AfterViewInit  {
    [x: string]: any;
    @ViewChild(DataTableDirective, { static: false })
    datatableElement!: DataTableDirective;

dtColumnSearchingOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  enlaceST: PTLEnlaceST[]=[];

  constructor(private router: Router,
      private BreadCrumb : BreadcrumbComponent,
      private enlacesService : PTLEnlacesSTService) {}

  ngOnInit() {

    this.dtColumnSearchingOptions = {
        responsive: true,
        columns: [
          { title: 'Nombre', data: 'nombreEnlace' },
          { title: 'Descripción', data: 'descripcionEnlace' },
          { title: 'Ruta', data: 'rutaEnlace' },
          { title: 'Estado', data: 'estadoEnlace' },
          { title: 'Opciones', data: 'opciones' },
        ]
      };

      this.consultarEnlaces();
  }
  consultarEnlaces () {
    this.enlacesService.getEnlaces().subscribe((enlace:any) => {
        console.log('Todos los enlaces', enlace.resp.data);
        this.enlaceST = enlace.resp.data;
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
  nuevoEnlace() {
    this.router.navigate(['/sites/new-enlace']);
  }

  editarEnlace(id: number) {
    this.router.navigate(['/sites/new-enlace'],
         { queryParams: { enlaceId: id } });
  }

  eliminarEnlace(id: number, nombre: string) {
    Swal.fire({
      title: '¿Estás seguro de eliminar?',
      text: `¡estas apunto de eliminar el enlace "${nombre}".!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.enlacesService.eliminarEnlace(id).subscribe({
          next: (resp:any) => {
            Swal.fire('Eliminado', resp.mensaje, 'success');
            this.enlaceST = this.enlaceST.filter(s => s.enlaceId !== id);
          },
          error: (err:any) => {
            Swal.fire('Error', 'No se pudo eliminar el enlace.', 'error');
            console.error('Error eliminando', err);
          }
        });
      }
    });
  }
}
