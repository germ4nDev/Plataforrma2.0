import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { NarikCustomValidatorsModule } from '@narik/custom-validators';
import { BreadcrumbComponent } from 'src/app/theme/shared/components/breadcrumb/breadcrumb.component';
import { PTLUsuarioModelService } from 'src/app/theme/shared/service/ptlusuarios.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { PTLUsuarioModel } from 'src/app/theme/shared/_helpers/models/PTLUsuario.model';
import Swal from 'sweetalert2';

//  = new PTLUsuarioModel(0,0,'','', '', '', '', '', false);
@Component({
    selector: 'app-gestion-usuario',
    standalone: true,
    imports: [CommonModule, SharedModule, NarikCustomValidatorsModule],
    templateUrl: './gestion-usuario.component.html',
    styleUrl: './gestion-usuario.component.scss'
})

export class GestionUsuarioComponent {
    FormUsuario!: PTLUsuarioModel;
    form: undefined;
    isSubmit: boolean;
    modoEdicion: boolean = false;

    constructor(private router: Router,
        private route: ActivatedRoute,
        private BreadCrumb: BreadcrumbComponent,
        private usuariosService: PTLUsuarioModelService) {
        this.isSubmit = false;
    }

    //  adjuntarImagen
    selectedFile: File | null = null;

    onFileSelected(event: any): void {
        const file: File = event.target.files[0];
        if (file) {
            const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, '');
            const originalName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
            const extension = file.name.split('.').pop();
            const fileName = `${originalName}_${timestamp}.${extension}`;

            this.selectedFile = new File([file], fileName, { type: file.type });
            this.FormUsuario.fotoUsuario = fileName;
        }
    }
    //  fin adjuntarimagen

    ngOnInit() {
        this.BreadCrumb.setBreadcrumb();
        this.route.queryParams.subscribe(params => {
            const id = params['usuarioId'];
            console.log('me llena el Id', id);

            if (id) {
                this.modoEdicion = true;
                this.usuariosService.getUsuarioById(+id).subscribe({
                    next: (resp: any) => {
                        this.FormUsuario = resp.data;
                    },
                    error: () => {
                        Swal.fire('Error', 'No se pudo obtener el usuario', 'error');
                    }
                });
            }
            else {
                this.modoEdicion = false;
                this.FormUsuario = {
                    usuarioId: 0,
                    identificacionUsuario: 0,
                    nombreUsuario: '',
                    userNameUsuario: '',
                    correoUsuario: '',
                    claveUsuario: '',
                    descripcionUsuario: '',
                    fotoUsuario: '',
                    serviceToken: '',
                    estadoUsuario: true
                };
            }
        });
    }

    btnInsertEditUsuario(form: any) {
        this.isSubmit = true;

        if (!form.valid) {
            return;
        }
        if (this.modoEdicion) {
            this.usuariosService.modificarUsuarios(this.FormUsuario).subscribe({
                next: (resp: any) => {
                    if (resp.ok) {
                        Swal.fire('', 'El sitio se modificó correctamente', 'success');
                        this.router.navigate(['/usuarios/usuarios']);
                    } else {
                        Swal.fire('Error', resp.message || 'No se pudo actualizar el usuario', 'error');
                    }
                },
                error: (err: any) => {
                    console.error(err);
                    Swal.fire('Error', 'No se pudo actualizar el usuario', 'error');
                }
            });
        }
        else {
            this.usuariosService.insertarUsuarios(this.FormUsuario).subscribe({
                next: (resp: any) => {
                    if (resp.ok) {
                        Swal.fire('', 'El usuario se insertó correctamente', 'success');
                        form.resetForm();
                        this.isSubmit = false;
                        this.router.navigate(['/usuarios/usuarios']);
                    }
                },
                error: (err: any) => {
                    console.error(err);
                    Swal.fire('Error', 'No se pudo insertar el usuario', 'error');
                }
            });
        }
    }

    btnRegresarUsuario() {
        this.router.navigate(['/usuarios']);
    }
}
