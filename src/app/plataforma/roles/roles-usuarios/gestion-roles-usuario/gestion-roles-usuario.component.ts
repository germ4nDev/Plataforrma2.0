//#region IMPORTS
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { catchError, of, Subscription, tap, firstValueFrom } from 'rxjs';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { PTLRoleAPModel } from '../../../../theme/shared/_helpers/models/PTLRoleAP.model';
import { PTLAplicacionModel } from 'src/app/theme/shared/_helpers/models/PTLAplicacion.model';
import { PTLUsuarioRoleAP } from 'src/app/theme/shared/_helpers/models/PTLUsuarioRole.model';
import { PTLUsuarioModel } from 'src/app/theme/shared/_helpers/models/PTLUsuario.model';
import { BreadcrumbComponent } from 'src/app/theme/shared/components/breadcrumb/breadcrumb.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
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
import { NavigationItem } from 'src/app/theme/layout/admin/navigation/navigation';
import { NavigationService } from 'src/app/theme/shared/service/navigation.service';
import { NavBarComponent } from 'src/app/theme/layout/admin/nav-bar/nav-bar.component';
import { NavContentComponent } from 'src/app/theme/layout/admin/navigation/nav-content/nav-content.component';
import { PTLSuiteAPModel } from 'src/app/theme/shared/_helpers/models/PTLSuiteAP.model';
//#endregion IMPORTS

@Component({
  selector: 'app-gestion-roles-usurio',
  standalone: true,
  imports: [CommonModule, SharedModule, TranslateModule, NavBarComponent, NavContentComponent],
  templateUrl: './gestion-roles-usuario.component.html',
  styleUrl: './gestion-roles-usuario.component.scss'
})
export class GestionRolesUsuarioComponent implements OnInit {
  @Output() toggleSidebar = new EventEmitter<void>();
  menuItems: NavigationItem[] = [];
  FormRegistro: PTLUsuarioRoleAP = new PTLUsuarioRoleAP();
  aplicacion: PTLAplicacionModel = new PTLAplicacionModel();
  suite: PTLSuiteAPModel = new PTLSuiteAPModel();
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
  registroId: number = 0;
  usuarioId: number = 0;
  form: undefined;
  isSubmit: boolean = false;
  modoEdicion: boolean = false;
  codeRegistro = uuidv4();
  rolesSeleccionados: PTLUsuarioRoleAP[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private navigationService: NavigationService,
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
    this.route.queryParams.subscribe((params) => {
      this.registroId = params['regId'];
      this.usuarioId = params['usuId'];
      if (this.usuarioId) {
        this.FormRegistro.usuarioId = this.usuarioId;
        this.consultarUsuarioById(this.usuarioId);
      }
      if (this.registroId) {
        console.log('me llena el Id', this.registroId);
        this.modoEdicion = true;
      } else {
        console.log('no llena el Id', this.registroId);
        this.modoEdicion = false;
        // this.FormRegistro.codigoAplicacion = uuidv4();
      }
    });
  }

  ngOnInit() {
    const appCode = localStorage.getItem('aplicacionId') || 'plataforma';
    this.menuItems = this.navigationService.getNavigationItems(appCode);
    this.getOnInitPage();
  }

  private async getOnInitPage() {
    return await new Promise((resolve, reject) => {
      try {
        return Promise.all([
          this.consultarUsuariosRoles(),
          this.consultarUsuarios(),
          this.consultarAplicaciones(),
          this.consultarUsuariosRoles(),
          this.consultarSuites(),
          this.consultarRegistroById(this.registroId),
          resolve(true)
        ]);
      } catch (error) {
        return reject(false);
      }
    });
  }

  private async consultarRegistroById(id: number) {
    try {
      const resp = await firstValueFrom(
        this.registrosService.getRegistroById(id).pipe(
          tap((resp: any) => {
            this.FormRegistro = resp.role;
            console.log('Todos los rolesUsuarios', this.rolesUsuarios);
          }),
          catchError((error) => {
            console.error('Error al obtener usuarios roles:', error);
            return of(null); // devuelve observable para evitar que explote
          })
        )
      );
      return resp?.ok ?? false;
    } catch (error) {
      console.error('Error inesperado en consultarUsuariosRoles:', error);
      return false;
    }
  }

  private async consultarUsuariosRoles(): Promise<boolean> {
    try {
      const resp = await firstValueFrom(
        this.registrosService.getRegistros().pipe(
          tap((resp: any) => {
            if (resp.ok) {
              this.rolesUsuarios = resp.usuariosRoles;
              console.log('Todos los rolesUsuarios', this.rolesUsuarios);
            }
          }),
          catchError((error) => {
            console.error('Error al obtener usuarios roles:', error);
            return of(null); // devuelve observable para evitar que explote
          })
        )
      );
      return resp?.ok ?? false;
    } catch (error) {
      console.error('Error inesperado en consultarUsuariosRoles:', error);
      return false;
    }
  }

  private async consultarUsuarios() {
    try {
      const resp = await firstValueFrom(
        this.usuariosService.getUsuarios().pipe(
          tap((resp: any) => {
            if (resp.ok) {
              this.usuarios = resp.usuarios;
              console.log('Todos las usuarios', this.usuarios);
            }
          }),
          catchError((err) => {
            console.log(err);
            return of(null);
          })
        )
      );
      return resp?.ok ?? false;
    } catch (error) {
      console.error('Error inesperado en consultarUsuariosRoles:', error);
      return false;
    }
  }

  private async consultarUsuarioById(id: number) {
    try {
      const resp = await firstValueFrom(
        this.usuariosService.getUsuarioById(id).pipe(
          tap((resp: any) => {
            if (resp.ok) {
              this.usuario = resp.usuario;
              console.log('Data del usuario', this.usuario);
            }
          }),
          catchError((err) => {
            console.log(err);
            return of(null);
          })
        )
      );
      return resp?.ok ?? false;
    } catch (error) {
      console.error('Error inesperado en consultarUsuariosRoles:', error);
      return false;
    }
  }

  private async consultarAplicaciones() {
    try {
      const resp = await firstValueFrom(
        this.aplicacionesService.getAplicaciones().pipe(
          tap((resp: any) => {
            if (resp.ok) {
              this.aplicaciones = resp.aplicaciones;
              console.log('Todos las aplicaciones', this.aplicaciones);
            }
          }),
          catchError((err) => {
            console.log(err);
            return of(null);
          })
        )
      );
      return resp?.ok ?? false;
    } catch (error) {
      console.error('Error inesperado en consultarUsuariosRoles:', error);
      return false;
    }
  }

  private async consultarSuites() {
    try {
      const resp = await firstValueFrom(
        this.suitesService.geSuitesAP().pipe(
          tap((resp: any) => {
            if (resp.ok) {
              this.suites = resp.suites;
            }
          }),
          catchError((err) => {
            console.log('Ha ocurrido un error', err);
            return of(null);
          })
        )
      );
      return resp?.ok ?? false;
    } catch (error) {
      console.error('Error inesperado en consultarUsuariosRoles:', error);
      return false;
    }
  }

  private async consultarRolesBySuiteId(suiteId: number) {
    try {
      this.rolesAplicacion = [];
      const resp = await firstValueFrom(
        this.rolesAPService.getRegistros().pipe(
          tap((resp: any) => {
            if (resp.ok) {
              const rolesApp = resp.roles.filter((x: { suiteId: number }) => x.suiteId == suiteId);
              console.log('rolesUsuaris', this.rolesUsuarios);
              rolesApp.forEach((role: any) => {
                const usuRole = this.rolesUsuarios.find((ur: any) => ur.roleId === role.roleId);
                if (usuRole) {
                  role.checked = true;
                  role.usuarioRoleId = usuRole.usuarioRoleId;
                  this.rolesSeleccionados.push(role);
                } else {
                  role.checked = false;
                  role.usuarioRoleId = null;
                }
              });
              this.rolesAplicacion = rolesApp;
            }
          }),
          catchError((err) => {
            console.log(err);
            return of(null);
          })
        )
      );
      return resp?.ok ?? false;
    } catch (error) {
      console.error('Error inesperado en consultarUsuariosRoles:', error);
      return false;
    }
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
    console.log('usuario seleccionado', usu);
  }

  onSuiteChangeClick(event: any) {
    const value = event.target.value;
    const suite = this.suitesApp.filter((x) => x.suiteId == value)[0];
    console.log('Código de suite seleccionado:', suite);
    this.suite = suite;
    this.consultarRolesBySuiteId(value || 0);
    this.FormRegistro.suiteId = value;
    this.FormRegistro.codigoSuite = value;
  }

  onSeleccionarRegistroChange(evento: any, role: any) {
    const checked = evento.target.checked;
    role.checked = checked;
    const roleIx = this.rolesSeleccionados.findIndex((x) => x.roleId === role.roleId);
    if (checked) {
      const existe = this.rolesSeleccionados.some((r) => r.roleId === role.roleId);
      if (!existe) {
        this.rolesSeleccionados.push(role);
      }
    } else {
      if (roleIx !== -1) {
        this.rolesSeleccionados.splice(roleIx, 1);
      }
    }
    console.log('Roles seleccionados:', this.rolesSeleccionados);
  }

  onGestionarRegistroClick(form: any) {
    this.isSubmit = true;
    if (!form.valid) {
      return;
    }
    this.registrosService
      .deleteTodosRolesByAppIsSuiteId(this.usuario.usuarioId ?? 0, this.aplicacion.aplicacionId ?? 0, this.suite.suiteId ?? 0)
      .subscribe((elm) => {
        if (this.rolesSeleccionados.length > 0) {
          this.rolesSeleccionados.forEach((role) => {
            const newRole: PTLUsuarioRoleAP = {
              usuarioId: Number(this.FormRegistro.usuarioId),
              aplicacionId: this.FormRegistro.aplicacionId,
              suiteId: this.FormRegistro.suiteId,
              roleId: role.roleId,
              estadoUsuarioRole: true
            };
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
          });
          this.router.navigate(['roles/roles-usuarios']);
        }
      });
  }

  btnRegresarClick() {
    this.router.navigate(['roles/roles-usuarios']);
  }

  toggleNav(): void {
    this.toggleSidebar.emit();
  }
}
