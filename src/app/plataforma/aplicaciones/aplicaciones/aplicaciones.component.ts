/* eslint-disable @angular-eslint/use-lifecycle-interface */
/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { Router } from '@angular/router';
import { PTLAplicacion } from 'src/app/theme/shared/_helpers/models/PTLAplicacion.model';
import { PtlaplicacionesService } from 'src/app/theme/shared/service/ptlaplicaciones.service';
import { Subject } from 'rxjs';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

// project import
import { BreadcrumbComponent } from '../../../theme/shared/components/breadcrumb/breadcrumb.component';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-aplicaciones',
    standalone: true,
    imports: [CommonModule, DataTablesModule, SharedModule, BreadcrumbComponent, TranslateModule],
    templateUrl: './aplicaciones.component.html',
    styleUrl: './aplicaciones.component.scss'
})
export class AplicacionesComponent implements OnInit, AfterViewInit {
    [x: string]: any;
    @ViewChild(DataTableDirective, { static: false })
    datatableElement!: DataTableDirective;
    estadoApp: string = '';
    dtColumnSearchingOptions: DataTables.Settings = {};
    dtTrigger: Subject<any> = new Subject<any>();
    aplicaciones: PTLAplicacion[] = [];

    constructor(
        private router: Router,
        private aplicacionesService: PtlaplicacionesService,
        private BreadCrumb: BreadcrumbComponent
    ) { }

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
        this.dtColumnSearchingOptions = {
            responsive: true,
            columns: [
                { title: 'Código', data: 'codigoAplicacion' },
                { title: 'Nombre', data: 'nombreAplicacion' },
                { title: 'Descripción', data: 'descripcionAplicacion' },
                { title: 'Estado', data: 'estadoAplicacion' },
                { title: 'Opciones', data: 'opciones' },
            ]
        };

        this.consultarAplicaciones();
    }

    ngOnDestroy(): void {
        this.dtTrigger.unsubscribe(); // <--- Destruye el trigger para evitar memory leaks
    }

    consultarAplicaciones() {
        this.aplicacionesService.getAplicaciones().subscribe((apps: any) => {
            console.log('Todos las aplicaciones', apps);
            apps.aplicaciones.forEach((app:any) => {
                app.nomEstado = app.estadoAplicacion == true ? 'Activa' : 'Inactiva';
            });
            this.aplicaciones = apps.aplicaciones;
            this.dtTrigger.next(null);// <--- Dispara la actualización de la tabla
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

    OnNuevaAplicaicionClick() {
        this.router.navigate(['/sites/new-site']);
    }

    OnEditarAplicaicionClick(id: number) {
        this.router.navigate(['/sites/new-site'], { queryParams: { AplicaicionId: id } });
    }

    OnEliminarAplicaicionClick(id: number, nombre: string) {
        Swal.fire({
            title: '¿Estás seguro de eliminar?',
            text: `¡estas apunto de eliminar la Aplicación "${nombre}".!`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                this.aplicacionesService.borrarAplicacion(id).subscribe({
                    next: (resp: any) => {
                        Swal.fire('Eliminado', resp.mensaje, 'success');
                        this.aplicaciones = this.aplicaciones.filter(s => s.aplicacionId !== id);
                    },
                    error: (err: any) => {
                        Swal.fire('Error', 'No se pudo eliminar el Aplicaicion.', 'error');
                        console.error('Error eliminando', err);
                    }
                });
            }
        });
    }

}
