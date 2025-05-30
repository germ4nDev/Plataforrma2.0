import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DataTablesModule, DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { PTLContenidosEL } from 'src/app/theme/shared/_helpers/models/PTLContenidosEL.model';
import { BreadcrumbComponent } from 'src/app/theme/shared/components/breadcrumb/breadcrumb.component';
import { PTLContenidosELService } from 'src/app/theme/shared/service/ptlcontenidos-el.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-contenidos',
  standalone: true,
  imports: [CommonModule, DataTablesModule, SharedModule, BreadcrumbComponent],
  templateUrl: './contenidos.component.html',
  styleUrls: ['./contenidos.component.css']
})
export class ContenidosComponent implements OnInit, AfterViewInit {
    [x: string]: any;
    @ViewChild(DataTableDirective, { static: false })
    datatableElement!: DataTableDirective;

dtColumnSearchingOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  contenidoEL: PTLContenidosEL[]=[];

  constructor(private router: Router,
      private BreadCrumb : BreadcrumbComponent,
      private contenidoService : PTLContenidosELService
    ) {}

  ngOnInit() {

    this.dtColumnSearchingOptions = {
        responsive: true,
        columns: [
          { title: 'Nombre', data: 'nombreContenido' },
          { title: 'Descripción', data: 'descripcionContenido' },
          { title: 'Contenido', data: 'contenido' },
          { title: 'Estado', data: 'estadoContenido' },
          { title: 'Opciones', data: 'opciones' },
        ]
      };

      this.consultarContenido();
  }
  consultarContenido () {
    this.contenidoService.getContenido().subscribe((contenido:any) => {
        console.log('Todos los contenido', contenido.resp.data);
        this.contenidoEL = contenido.resp.data;
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
  nuevoContenido() {
    this.router.navigate(['/sites/new-contenido']);
  }

  editarContenido(id: number) {
    this.router.navigate(['/sites/new-contenido'], { queryParams: { contenidoId: id } });
  }

  eliminarContenido(id: number, nombre: string) {
    Swal.fire({
      title: '¿Estás seguro de eliminar?',
      text: `¡estas apunto de eliminar el contenido "${nombre}".!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.contenidoService.eliminarContenido(id).subscribe({
          next: (resp:any) => {
            Swal.fire('Eliminado', resp.mensaje, 'success');
            this.contenidoEL = this.contenidoEL.filter(s => s.contenidoId !== id);
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

