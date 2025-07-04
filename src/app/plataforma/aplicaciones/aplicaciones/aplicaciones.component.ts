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
import { PtlaplicacionesService } from 'src/app/theme/shared/service/ptlaplicaciones.service';
import { Subject } from 'rxjs';
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

    dtColumnSearchingOptions: DataTables.Settings = {};
    dtTrigger: Subject<any> = new Subject<any>();
    aplicaciones: PTLAplicacionModel[]=[];
    //#endregion VARIABLES

    constructor(
        private router: Router,
        private aplicacionesService: PtlaplicacionesService,
        private translate: TranslateService,
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
            console.log('traduccion de aplicaciones', this.translate.instant('APLICACIONES.CODE') );
        this.dtColumnSearchingOptions = {
            responsive: true,
            columns: [
                { title: this.translate.instant('APLICACIONES.CODE'), data: 'codigoAplicacion' },
                { title: this.translate.instant('APLICACIONES.NAME'), data: 'nombreAplicacion' },
                { title: this.translate.instant('APLICACIONES.DESCRIPTION'), data: 'descripcionAplicacion' },
                { title: this.translate.instant('APLICACIONES.STATUS'), data: 'estadoAplicacion' },
                { title: this.translate.instant('PLATAFORMA.OPTIONS'), data: 'opciones' },
            ]
        };
        this.consultarAplicaciones();
    }

    ngOnDestroy(): void {
        this.dtTrigger.unsubscribe(); // <--- Destruye el trigger para evitar memory leaks
    }

    consultarAplicaciones() {
        // this.aplicacionesService.getAplicaciones().subscribe((apps: any) => {
        //     console.log('Todos las aplicaciones', apps);
        //     apps.aplicaciones.forEach((app:any) => {
        //         app.nomEstado = app.estadoAplicacion == true ? 'Activa' : 'Inactiva';
        //     });
        //     this.aplicaciones = apps.aplicaciones;
        //     this.dtTrigger.next(null);// <--- Dispara la actualización de la tabla
        // });
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
            title: this.translate.instant('APLICACIONES.ELIMINARTITULO'),
            text: this.translate.instant('APLICACIONES.ELIMINARTEXTO') + `"${nombre}".!`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: this.translate.instant('PLATAFORMA.DELETE'),
            cancelButtonText: this.translate.instant('PLATAFORMA.CANCEL')
        }).then((result: any) => {
            if (result.isConfirmed) {
                this.aplicacionesService.borrarAplicacion(id).subscribe({
                    next: (resp: any) => {
                        Swal.fire(this.translate.instant('APLICACIONES.ELIMINAREXITOSA'), resp.mensaje, 'success');
                        this.aplicaciones = this.aplicaciones.filter(s => s.aplicacionId !== id);
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
