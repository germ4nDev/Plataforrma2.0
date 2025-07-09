//#region IMPORTS
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { catchError, of, Subscription, tap } from 'rxjs';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { PTLRoleAPModel } from '../../../../theme/shared/_helpers/models/PTLRoleAP.model';
import { PTLAplicacionModel } from 'src/app/theme/shared/_helpers/models/PTLAplicacion.model';
import { PTLUsuarioRoleAP } from 'src/app/theme/shared/_helpers/models/PTLUsuarioRole.model';
import { PTLUsuarioModel } from 'src/app/theme/shared/_helpers/models/PTLUsuario.model';
import { BreadcrumbComponent } from 'src/app/theme/shared/components/breadcrumb/breadcrumb.component';
import { TranslateService } from '@ngx-translate/core';
import { v4 as uuidv4 } from 'uuid';
import Swal from 'sweetalert2';
import {
  PTLRolesAPService,
  LanguageService,
  PtlAplicacionesService,
  PtlusuariosRolesApService,
  PTLUsuariosService
} from 'src/app/theme/shared/service';
//#endregion IMPORTS

@Component({
  selector: 'app-gestion-roles-usurio',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './gestion-roles-usuario.component.html',
  styleUrl: './gestion-roles-usuario.component.scss'
})
export class GestionRolesUsuarioComponent {
  FormRegistro: PTLUsuarioRoleAP = new PTLUsuarioRoleAP();
  aplicacion: PTLAplicacionModel = new PTLAplicacionModel();
  aplicaciones: PTLAplicacionModel[] = [];
  usuarios: PTLUsuarioModel[] = [];
  rolesAplicacion: PTLRoleAPModel[] = [];
  registrosSub?: Subscription;
  usuariosSub?: Subscription;
  aplicacionesSub?: Subscription;
  rolesSub?: Subscription;
  form: undefined;
  isSubmit: boolean = false;
  modoEdicion: boolean = false;
  codeRegistro = uuidv4();
  rolesSeleccionados: PTLUsuarioRoleAP[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private registrosService: PtlusuariosRolesApService,
    private aplicacionesService: PtlAplicacionesService,
    private usuariosService: PTLUsuariosService,
    private rolesAPService: PTLRolesAPService,
    private translate: TranslateService,
    private languageService: LanguageService,
    private BreadCrumb: BreadcrumbComponent
  ) {
    this.isSubmit = false;
  }

  ngOnInit() {
    this.BreadCrumb.setBreadcrumb();
    this.consultarUsuarios();
    this.consultarAplicaciones();
    this.route.queryParams.subscribe((params) => {
      const registroId = params['regId'];
      if (registroId) {
        console.log('me llena el Id', registroId);
        this.modoEdicion = true;
        this.registrosService.getRegistroById(registroId).subscribe({
          next: (resp: any) => {
            console.log('resp', resp);
            this.FormRegistro = resp.role;
          },
          error: () => {
            Swal.fire('Error', 'No se pudo obtener el rol', 'error');
          }
        });
      } else {
        console.log('no llena el Id', registroId);
        this.modoEdicion = false;
        // this.FormRegistro.codigoAplicacion = uuidv4();
      }
    });
  }

  consultarUsuarios() {
    this.usuariosSub = this.usuariosService
      .getUsuarios()
      .pipe(
        tap((resp: any) => {
          if (resp.ok) {
            this.usuarios = resp.usuarios;
            console.log('Todos las usuarios', this.usuarios);
            return;
          }
        }),
        catchError((err) => {
          return of(null);
        })
      )
      .subscribe();
  }

  consultarAplicaciones() {
    this.registrosSub = this.aplicacionesService
      .getAplicaciones()
      .pipe(
        tap((resp: any) => {
          if (resp.ok) {
            this.aplicaciones = resp.aplicaciones;
            console.log('Todos las aplicaciones', this.aplicaciones);
            return;
          }
        }),
        catchError((err) => {
          return of(null);
        })
      )
      .subscribe();
  }

  consultarRolesByAplicacionId(aplicacionId: number) {
    this.rolesAplicacion = [];
    this.registrosSub = this.rolesAPService
      .getRegistros()
      .pipe(
        tap((resp: any) => {
          if (resp.ok) {
            const rolesApp = resp.roles.filter((x: { aplicacionId: number }) => x.aplicacionId == aplicacionId);
            this.rolesAplicacion = rolesApp;
            console.log('Todos las roles', this.rolesAplicacion);
          }
        }),
        catchError((err) => {
          return of(null);
        })
      )
      .subscribe();
  }

  onAplicacionchangeClick(event: any) {
    const value = event.target.value;
    const app = this.aplicaciones.filter((x) => x.aplicacionId == value)[0];
    this.consultarRolesByAplicacionId(app.aplicacionId || 0);
    this.aplicacion = app;
  }

  onSeleccionarRegistroChange(evento: any, role: any) {
    const roleId = evento.target.value;
    const checked = evento.target.checked;
    role.checked = checked;
    if (checked) {
      this.rolesSeleccionados.push(role);
    } else {
      const roleIx = this.rolesSeleccionados.findIndex((x) => x.roleId == role.roleId);
      if (roleIx != -1) {
        this.rolesSeleccionados.splice(roleIx, 1);
      }
    }
    console.log('Roles seleccionados:', this.rolesSeleccionados);
  }

  btnGestionarRegistroClick(form: any) {
    this.isSubmit = true;
    if (!form.valid) {
      return;
    }
    if (this.modoEdicion) {
      console.log('1.0 modificar usuario', this.FormRegistro);
      this.registrosService.putModificarRegistro(this.FormRegistro).subscribe({
        next: (resp: any) => {
          if (resp.ok) {
            Swal.fire('', 'El registro se modificó correctamente', 'success');
            this.router.navigate(['/roles/roles']);
          } else {
            Swal.fire('Error', resp.message || 'No se pudo actualizar el registro', 'error');
          }
        },
        error: (err: any) => {
          console.error(err);
          Swal.fire('Error', 'No se pudo actualizar el registro', 'error');
        }
      });
    } else {
      console.log('formregistro', this.FormRegistro);
      this.registrosService.postCrearRegistro(this.FormRegistro).subscribe({
        next: (resp: any) => {
          if (resp.ok) {
            Swal.fire('', 'El registro se insertó correctamente', 'success');
            form.resetForm();
            this.isSubmit = false;
            this.router.navigate(['/roles/roles']);
          }
        },
        error: (err: any) => {
          console.error(err);
          Swal.fire('Error', 'No se pudo insertar el registro', 'error');
        }
      });
    }
  }

  btnRegresarClick() {
    this.router.navigate(['/roles-usuaris/roles-usurios']);
  }
}
