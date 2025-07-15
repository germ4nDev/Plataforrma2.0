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
import { PtlSuitesAPService } from 'src/app/theme/shared/service/ptlsuites-ap.service';
//#endregion IMPORTS

@Component({
  selector: 'app-gestion-roles-usurio',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './gestion-roles-usuario.component.html',
  styleUrl: './gestion-roles-usuario.component.scss'
})
export class GestionRolesUsuarioComponent implements OnInit {
  FormRegistro: PTLUsuarioRoleAP = new PTLUsuarioRoleAP();
  aplicacion: PTLAplicacionModel = new PTLAplicacionModel();
  usuario: PTLUsuarioModel = new PTLUsuarioModel();
  aplicaciones: PTLAplicacionModel[] = [];
  usuarios: PTLUsuarioModel[] = [];
  rolesAplicacion: PTLRoleAPModel[] = [];
  rolesUsuarios: PTLUsuarioRoleAP[] = [];
  registrosSub?: Subscription;
  usuariosSub?: Subscription;
  aplicacionesSub?: Subscription;
  rolesSub?: Subscription;
  rolesUauariosSub?: Subscription;
  suitesSub?: Subscription;
  suites: any[] = [];
  suitesApp: any[] = [];

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
    private suitesService: PtlSuitesAPService,
    private rolesAPService: PTLRolesAPService,
    private translate: TranslateService,
    private languageService: LanguageService,
    private BreadCrumb: BreadcrumbComponent
  ) {
    this.isSubmit = false;
  }

  ngOnInit() {
    this.BreadCrumb.setBreadcrumb();
    this.consultarUsuariosRoles();
    this.consultarUsuarios();
    this.consultarAplicaciones();
    this.consultarUsuariosRoles();
    this.consultarSuites();
    this.route.queryParams.subscribe((params) => {
      const registroId = params['regId'];
      const usuarioId = params['usuId'];
      if (usuarioId) {
        this.FormRegistro.usuarioId = usuarioId;
      }
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

  consultarUsuariosRoles() {
    this.rolesUauariosSub = this.registrosService
      .getRegistros()
      .pipe(
        tap((resp: any) => {
          if (resp.ok) {
            this.rolesUsuarios = resp.usuariosRoles;
            console.log('Todos las rolesUsuarios', this.rolesUsuarios);
            return;
          }
        }),
        catchError((err) => {
          console.log(err);
          return of(null);
        })
      )
      .subscribe();
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
          console.log(err);
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
          console.log(err);
          return of(null);
        })
      )
      .subscribe();
  }

  consultarSuites() {
    this.suitesSub = this.suitesService
      .geSuitesAP()
      .pipe(
        tap((resp: any) => {
          if (resp.ok) {
            this.suites = resp.suites;
            // console.log('Todos las aplicaciones', this.suitesApp);
            return;
          }
        }),
        catchError((err) => {
          console.log('Ha ocurrido un error', err);
          return of(null);
        })
      )
      .subscribe();
  }

  consultarRolesBySuiteId(suiteId: number) {
    this.rolesAplicacion = [];
    this.registrosSub = this.rolesAPService
      .getRegistros()
      .pipe(
        tap((resp: any) => {
          if (resp.ok) {
            const rolesApp = resp.roles.filter((x: { suiteId: number }) => x.suiteId == suiteId);
            console.log('rolesUsuaris', this.rolesUsuarios);
            rolesApp.forEach((role: any) => {
              this.rolesUsuarios.forEach((usuRole: any) => {
                console.log('usuRole', usuRole);
                role.usuarioRoleId = usuRole.usuarioRoleId;
                // TODO verificar todos los roles del usuario para poner el checked
                if (usuRole.roleId == role.roleId) {
                  role.checked = true;
                } else {
                  role.checked = false;
                }
              });
            });
            this.rolesAplicacion = rolesApp;
            this.rolesSeleccionados = rolesApp;
            console.log('Todos las roles final', this.rolesAplicacion);
            console.log('Todos las roles rolesSeleccionados', this.rolesSeleccionados);
          }
        }),
        catchError((err) => {
          console.log(err);
          return of(null);
        })
      )
      .subscribe();
  }

  onAplicacionChangeClick(event: any) {
    const value = event.target.value;
    const app = this.aplicaciones.filter((x) => x.aplicacionId == value)[0];
    this.suitesApp = this.suites.filter((x) => x.aplicacionId == app.aplicacionId);
    this.aplicacion = app;
  }

  onUsuarioChangeClick(event: any) {
    const value = event.target.value;
    const usu = this.usuarios.filter((x) => x.usuarioId == value)[0];
    this.usuario = usu;
  }

  onSuiteChangeClick(event: any) {
    const value = event.target.value;
    const suite = this.suitesApp.filter((x) => x.suiteId == value)[0];
    console.log('Código de suite seleccionado:', suite);
    // console.log('data suite seleccionado:', suite);
    this.consultarRolesBySuiteId(value || 0);
    this.FormRegistro.suiteId = value;
    this.FormRegistro.codigoSuite = value;
  }

  onSeleccionarRegistroChange(evento: any, role: any) {
    const checked = evento.target.checked;
    role.checked = checked;
    console.log('data del role', role);
    console.log('role checked', checked);
    const roleIx = this.rolesSeleccionados.findIndex((x) => x.roleId == role.roleId);
    if (checked) {
      this.rolesSeleccionados.push(role);
    } else {
      const roleSelIx = this.rolesSeleccionados.findIndex((x) => x.roleId == role.roleId);
      console.log('indice del role', roleIx);
      console.log('roles rolesAplicacion', this.rolesAplicacion);
      if (roleIx != -1) {
        this.rolesSeleccionados.splice(roleSelIx, 1);
        console.log('roles seleccionados', this.rolesSeleccionados);
        this.registrosService.deleteEliminarRegistro(role.usuarioRoleId).subscribe({
          next: (resp: any) => {
            if (resp.ok) {
              console.log('role eliminado del usuario', role);
            }
          }
        });
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
            this.router.navigate(['roles/roles-usuarios']);
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
      this.rolesSeleccionados.forEach((role: any) => {
        const newRole: PTLUsuarioRoleAP = {
          usuarioId: Number(this.FormRegistro.usuarioId),
          aplicacionId: this.FormRegistro.aplicacionId,
          suiteId: this.FormRegistro.suiteId,
          roleId: role.roleId,
          estadoUsuarioRole: true
        };
        if (
          !this.rolesUsuarios.some(
            (role) => role.usuarioId === newRole.usuarioId && role.aplicacionId === newRole.aplicacionId && role.roleId === newRole.roleId
          )
        ) {
          console.log('insertar ususario role', newRole);
          this.registrosService.postCrearRegistro(newRole).subscribe({
            next: (resp: any) => {
              if (resp.ok) {
                console.log('El role fue creado para el usuario');
              }
            },
            error: (err: any) => {
              console.error(err);
              console.log('El role no se pudo crear para el usuario');
            }
          });
        } else {
          role.checked = false;
          console.log('El rol ya existe para este usuario');
        }
      });
      this.router.navigate(['roles/roles-usuarios']);
    }
  }

  btnRegresarClick() {
    this.router.navigate(['roles/roles-usuarios']);
  }
}
