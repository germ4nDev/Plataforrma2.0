import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Location, LocationStrategy } from '@angular/common';
import { DataTablesModule, DataTableDirective } from 'angular-datatables';
import { PTLUsuarioModel } from 'src/app/theme/shared/_helpers/models/PTLUsuario.model';
import { BreadcrumbComponent } from 'src/app/theme/shared/components/breadcrumb/breadcrumb.component';
import { PTLUsuarioModelService } from 'src/app/theme/shared/service/ptlusuarios.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { Subject } from 'rxjs';
import { Subscription, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { GradientConfig } from 'src/app/app-config';
import Swal from 'sweetalert2';
import { AppModule } from "../../app.module";

@Component({
    selector: 'app-usuarios',
    standalone: true,
    imports: [CommonModule, DataTablesModule, SharedModule, BreadcrumbComponent, AppModule],
    templateUrl: './usuarios.component.html',
    styleUrl: './usuarios.component.scss'
})
export class UsuariosComponent implements OnInit, AfterViewInit {
    [x: string]: unknown;
    @ViewChild(DataTableDirective, { static: false })
    datatableElement!: DataTableDirective;
    loginSub?: Subscription;
    loading = false;
    error = '';
    isNavigation = false;
    dtColumnSearchingOptions: DataTables.Settings = {};
    dtTrigger: Subject<any> = new Subject<any>();
    usuarios: PTLUsuarioModel[] = [];
    usuariosSearch: PTLUsuarioModel[] = [];

    gradientConfig;
    navCollapsed: boolean;
    navCollapsedMob: boolean;
    windowWidth: number;

    @Output() NavMobCollapse = new EventEmitter();

    constructor(private router: Router,
        private usuariosService: PTLUsuarioModelService,
        private BreadCrumb: BreadcrumbComponent
    ) {
        this.windowWidth = window.innerWidth;
        this.navCollapsed = this.windowWidth >= 992 ? GradientConfig.isCollapse_menu : false;
        this.navCollapsedMob = false;
        this.gradientConfig = GradientConfig;
        this.windowWidth = window.innerWidth;
        this.navCollapsedMob = false;
    }

    ngOnInit() {
        if (this.windowWidth < 992) {
            GradientConfig.layout = 'vertical';
            setTimeout(() => {
                document.querySelector('.pcoded-navbar')?.classList.add('menupos-static');
                (document.querySelector('#nav-ps-gradient-able') as HTMLElement).style.maxHeight = '100%'; // 100%
            }, 500);
        }
        this.dtColumnSearchingOptions = {
            responsive: true,
            columns: [
                { title: 'Foto', data: 'fotoUsuario' },
                { title: 'Identificación', data: 'identificacionUsuario' },
                { title: 'Nombre', data: 'nombreUsuario' },
                { title: 'Username', data: 'descripcionUsuario' },
                { title: 'Estado', data: 'estadoUsuario' },
                { title: 'Opciones', data: 'opciones' },
            ]
        };

        this.consultarUsuarios();
    }

    // public method
    navMobCollapse() {
        if (this.windowWidth < 992) {
            this.NavMobCollapse.emit();
        }
    }

    // public method
    navMobClick() {
        if (this.windowWidth < 992) {
            if (this.navCollapsedMob && !document.querySelector('app-navigation.pcoded-navbar')?.classList.contains('mob-open')) {
                this.navCollapsedMob = !this.navCollapsedMob;
                setTimeout(() => {
                    this.navCollapsedMob = !this.navCollapsedMob;
                }, 100);
            } else {
                this.navCollapsedMob = !this.navCollapsedMob;
            }
        }
    }

    consultarUsuarios() {
        this.loginSub = this.usuariosService.getUsuarios().pipe(
            tap((resp: any) => {
                this.loading = false;
                if (!resp?.ok) {
                    Swal.fire({
                        title: resp?.msg || 'Error',
                        text: 'No hay usuarios registrados en nuestro sistema.',
                        icon: 'error',
                        showCloseButton: true
                    });
                    return;
                }

                console.log('Todos los usuarios', resp.usuarios);
                this.usuarios = resp.usuarios;
                this.usuariosSearch = this.usuarios;
                this.dtTrigger.next(null);
            }),
            catchError((err) => {
                this.loading = false;
                this.error = err;
                console.log('error de sistema', err);

                // Swal.fire('Error', err?.msg || 'Ha ocurrido un error inesperado', 'error');
                return of(null); // Devuelve un observable vacío para evitar que se rompa la cadena
            })
        ).subscribe(); // 👈 ¡Esto es esencial!
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
        const value = valor;
        this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
            if (columna == 6) {
                if (value.toLowerCase() == '' || value.toLowerCase() == undefined) {
                    this.usuariosSearch = this.usuarios;
                } else {
                    if (value.toLowerCase() == 'activo') {
                        this.usuariosSearch = this.usuariosSearch.filter(x => x.estadoUsuario = true);
                    } else if (value.toLowerCase() == 'inactivo') {
                        this.usuariosSearch = this.usuariosSearch.filter(x => x.estadoUsuario = false);
                    }
                }
            } else {
                this.usuariosSearch = this.usuarios;
                dtInstance.column(columna).search(valor).draw();
            }
        });
    }

    getEstado(estado: boolean): string {
        return estado ? 'Activo' : 'Inactivo';
    }

    ngOnDestroy(): void {
        this.dtTrigger.unsubscribe(); // <--- Destruye el trigger para evitar memory leaks
        this.loginSub?.unsubscribe(); // <--- Destruye el trigger para evitar memory leaks
    }

    OnNuevoUsuarioClick() {
        this.router.navigate(['/usuarios/gestion-usuario']);
    }

    OnEditarUsuarioClick(id: number) {
        this.router.navigate(['/usuarios/new-usuario'], { queryParams: { usuarioId: id } });
    }

    OnEliminarUsuarioClick(id: number, nombre: string) {
        Swal.fire({
            title: '¿Estás seguro de eliminar?',
            text: `¡estas apunto de eliminar el usuario "${nombre}".!`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                this.usuariosService.eliminarUsuarios(id).subscribe({
                    next: (resp: any) => {
                        Swal.fire('Eliminado', resp.mensaje, 'success');
                        this.usuarios = this.usuarios.filter(s => s.usuarioId !== id);
                    },
                    error: (err: any) => {
                        Swal.fire('Error', 'No se pudo eliminar el usuario.', 'error');
                        console.error('Error eliminando', err);
                    }
                });
            }
        });
    }
}
