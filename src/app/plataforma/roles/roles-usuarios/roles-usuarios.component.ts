/* eslint-disable @angular-eslint/use-lifecycle-interface */
//#region IMPORTS
import { AfterViewInit, Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { Router } from '@angular/router';
import { catchError, Subject, map, firstValueFrom, of, Subscription, lastValueFrom } from 'rxjs';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { TranslateService } from '@ngx-translate/core';
import { PTLUsuarioModel } from 'src/app/theme/shared/_helpers/models/PTLUsuario.model';
import { PTLRoleAPModel } from 'src/app/theme/shared/_helpers/models/PTLRoleAP.model';
import { PTLAplicacionModel } from 'src/app/theme/shared/_helpers/models/PTLAplicacion.model';
import { PTLUsuariosService } from 'src/app/theme/shared/service/ptlusuarios.service';
import { PtlusuariosRolesApService } from 'src/app/theme/shared/service/ptlusuarios-roles-ap.service';
import { PtlAplicacionesService } from 'src/app/theme/shared/service/ptlaplicaciones.service';
import { LanguageService } from 'src/app/theme/shared/service/lenguage.service';
import { PtlSuitesAPService } from 'src/app/theme/shared/service/ptlsuites-ap.service';
import { NavBarComponent } from 'src/app/theme/layout/admin/nav-bar/nav-bar.component';
import { NavContentComponent } from 'src/app/theme/layout/admin/navigation/nav-content/nav-content.component';
import { NavigationItem } from 'src/app/theme/layout/admin/navigation/navigation';
import { NavigationService } from 'src/app/theme/shared/service/navigation.service';
import { PTLRolesAPService } from 'src/app/theme/shared/service';
import Swal from 'sweetalert2';
import { DatatableComponent } from 'src/app/theme/shared/components/data-table/data-table.component';
//#endregion IMPORTS

@Component({
  selector: 'app-roles-usuarios',
  standalone: true,
  imports: [CommonModule, DataTablesModule, SharedModule, TranslateModule, NavBarComponent, NavContentComponent, DatatableComponent],
  templateUrl: './roles-usuarios.component.html',
  styleUrl: './roles-usuarios.component.scss'
})
export class RolesUsuariosComponent implements OnInit, AfterViewInit {
  //#region VARIABLES
  [x: string]: any;
  @Output()
  toggleSidebar = new EventEmitter<void>();
  @ViewChild(DataTableDirective, { static: false })
  datatableElement!: DataTableDirective;
  dtColumnSearchingOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  activeTab: 'menu' | 'filters' | 'main' = 'menu';
  menuItems: NavigationItem[] = [];
  rolesSub?: Subscription;
  registrosSub?: Subscription;
  raplicacionesSub?: Subscription;
  usuariosSub?: Subscription;

  role: PTLRoleAPModel = new PTLRoleAPModel();
  usuario: PTLUsuarioModel = new PTLUsuarioModel();
  usuariosRoles: any[] = [];
  registros: any[] = [];
  registrosFiltrado: any[] = [];
  registrosData: any[] = [];
  aplicacion: PTLAplicacionModel = new PTLAplicacionModel();
  lang: string = localStorage.getItem('lang') || '';
  tituloPagina: string = '';
  //#endregion VARIABLES

  constructor(
    private router: Router,
    private rolesAPService: PTLRolesAPService,
    private usuariosService: PTLUsuariosService,
    private navigationService: NavigationService,
    private rolesUsuariosService: PtlusuariosRolesApService,
    private aplicacionesService: PtlAplicacionesService,
    private suitesService: PtlSuitesAPService,
    private translate: TranslateService,
    private languageService: LanguageService
  ) {}

  ngAfterViewInit(): void {
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
    const appCode = localStorage.getItem('aplicacionId') || 'plataforma';
    this.menuItems = this.navigationService.getNavigationItems(appCode);
    this.getOnInitPage();
    this.consultarRegistros();
    this.languageService.currentLang$.subscribe((lang) => {
      this.translate.use(lang);
      this.translate
        .get([
          'ROLESUSUARIOS.FOTO, ROLESUSUARIOS.USUARIO, ROLESUSUARIOS.APLICACIONES, ROLESUSUARIOS.SUITES, ROLESUSUARIOS.ROLES, ROLESUSUARIOS.ESTADOROLE'
        ])
        .subscribe((translations) => {
          this.tituloPagina = translations['ROLESUSUARIOS.TITLE'];
          this.dtColumnSearchingOptions = {
            responsive: true,
            columns: [
              { title: translations['ROLESUSUARIOS.FOTO'], data: 'nombreAplicacion' },
              { title: translations['ROLESUSUARIOS.USUARIO'], data: 'nombreAplicacion' },
              { title: translations['ROLESUSUARIOS.APLICACIONES'], data: 'nombreRole' },
              { title: translations['ROLESUSUARIOS.SUITES'], data: 'nombreRole' },
              { title: translations['ROLESUSUARIOS.ROLES'], data: 'descripcionRole' },
              { title: translations['ROLESUSUARIOS.ESTADOROLE'], data: 'descripcionRole' },
              { title: translations['PLATAFORMA.OPTIONS'], data: 'opciones' }
            ]
          };
        });
    });
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  private async getOnInitPage() {
    return await new Promise((resolve, reject) => {
      try {
        return Promise.all([this.consultarRegistros(), resolve(true)]);
      } catch (error) {
        return reject(false);
      }
    });
  }

  private async consultarRoleById(roleId: number): Promise<any> {
    try {
      const resp = await firstValueFrom(
        this.rolesAPService.getRegistroById(roleId).pipe(
          map((resp: any) => {
            if (resp.ok) return resp.role;
            return null;
          }),
          catchError((err) => {
            console.error('Error al consultar role', err);
            return of(null);
          })
        )
      );
      return resp;
    } catch (error) {
      console.error('Error inesperado', error);
      return null;
    }
  }

  private async consultarAplicacionById(aplicacionId: number) {
    try {
      const resp = await firstValueFrom(
        this.aplicacionesService.getAplicacionById(aplicacionId).pipe(
          map((resp: any) => {
            if (resp.ok) return resp.aplicacion;
            return null;
          }),
          catchError((err) => {
            console.error('Error al consultar aplicacion', err);
            return of(null);
          })
        )
      );
      return resp;
    } catch (error) {
      console.error('Error inesperado', error);
      return null;
    }
  }

  private async consultarSuiteById(suiteId: number) {
    try {
      const resp = await firstValueFrom(
        this.suitesService.getSuiteAPById(suiteId).pipe(
          map((resp: any) => {
            if (resp.ok) return resp.suite;
            return null;
          }),
          catchError((err) => {
            console.error('Error al consultar suite', err);
            return of(null);
          })
        )
      );
      return resp;
    } catch (error) {
      console.error('Error inesperado', error);
      return null;
    }
  }

  private async consultarUsuarioById(usuarioId: number) {
    try {
      const resp = await firstValueFrom(
        this.usuariosService.getUsuarioById(usuarioId).pipe(
          map((resp: any) => {
            if (resp.ok) return resp.usuario;
            return null;
          }),
          catchError((err) => {
            console.error('Error al consultar usuario', err);
            return of(null);
          })
        )
      );
      return resp;
    } catch (error) {
      console.error('Error inesperado', error);
      return null;
    }
  }

  private async consultarRegistros() {
    try {
      const resp: any = await lastValueFrom(this.rolesUsuariosService.getRegistros());
      if (!resp.ok) {
        console.error('Error al consultar registros');
        return;
      }
      this.usuariosRoles = resp.usuariosRoles;
      const registros = resp.usuariosRoles;

      const usuarioIds = [...new Set(registros.map((r: any) => Number(r.usuarioId)))];
      const aplicacionIds = [...new Set(registros.map((r: any) => Number(r.aplicacionId)))];
      const sutesIds = [...new Set(registros.map((r: any) => Number(r.suiteId)))];
      const roleIds = [...new Set(registros.map((r: any) => Number(r.roleId)))];

      const [usuarios, aplicaciones, suites, roles] = await Promise.all([
        Promise.all(usuarioIds.map((id) => this.consultarUsuarioById(Number(id)))),
        Promise.all(aplicacionIds.map((id) => this.consultarAplicacionById(Number(id)))),
        Promise.all(sutesIds.map((id) => this.consultarSuiteById(Number(id)))),
        Promise.all(roleIds.map((id) => this.consultarRoleById(Number(id))))
      ]);

      const usuarioMap = new Map(usuarios.map((u) => [u.usuarioId, { ...u, aplicaciones: [] }]));
      const aplicacionMap = new Map(aplicaciones.map((a) => [a.aplicacionId, a]));
      const suiteMap = new Map(suites.map((s) => [s.suiteId, s]));
      const roleMap = new Map(roles.map((r) => [r.roleId, r]));

      for (const reg of registros) {
        const user = usuarioMap.get(reg.usuarioId);
        const app = aplicacionMap.get(reg.aplicacionId);
        const suite = suiteMap.get(reg.suiteId);
        const role = { ...roleMap.get(reg.roleId) };

        if (!user || !app || !suite || !role) continue;

        role.usuarioRoleId = reg.usuarioRoleId;
        role.estadoUsuarioRole = reg.estadoUsuarioRole;
        role.nomEstado = reg.estadoUsuarioRole ? 'Activo' : 'Inactivo';

        let appRef = user.aplicaciones.find((a: any) => a.aplicacionId === app.aplicacionId);
        if (!appRef) {
          appRef = { ...app, suites: [] };
          user.aplicaciones.push(appRef);
        }

        let suiteRef = appRef.suites.find((s: any) => s.suiteId === suite.suiteId);
        if (!suiteRef) {
          suiteRef = { ...suite, roles: [] };
          appRef.suites.push(suiteRef);
        }

        if (!suiteRef.roles.find((r: any) => r.roleId === role.roleId)) {
          suiteRef.roles.push(role);
        }
      }
    //   this.registros = Array.from(usuarioMap.values());
      this.registrosFiltrado = Array.from(usuarioMap.values());
      this.procesarDatosParaDatatable();
      this.dtTrigger.next(null);
    } catch (error) {
      console.error('Error en consultarRegistros', error);
    }
  }

  procesarDatosParaDatatable(): void {
    this.registrosData = this.registrosFiltrado.map((usuRole: any) => {
      const aplicaciones = usuRole.aplicaciones.map((app: any) => app.nombreAplicacion);
      const suites = usuRole.aplicaciones.flatMap((app: any) => app.suites.map((suite: any) => suite.nombreSuite));
      const roles = usuRole.aplicaciones.flatMap((app: any) =>
        app.suites.flatMap((suite: any) => suite.roles.map((rol: any) => rol))
      );

      return {
        foto: usuRole.foto,
        usuario: usuRole.nombre,
        aplicaciones: aplicaciones,
        suites: suites,
        roles: roles,
        id: usuRole.usuarioId
      };
    });
  }

  getTotalRoles(usuario: any): number {
    return usuario.aplicaciones.reduce((acc: number, app: any) => {
      return acc + app.suites.reduce((a: number, suite: any) => a + suite.roles.length, 0);
    }, 0);
  }

  getTotalRolesAplicacion(app: any): number {
    return app.suites.reduce((acc: number, suite: any) => acc + suite.roles.length, 0);
  }

  filtrarColumna(columna: number, valor: string) {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.column(columna).search(valor).draw();
    });
  }

  getEstado(estado: boolean): string {
    return estado ? 'Activo' : 'Inactivo';
  }

  OnNuevoRegistroClick() {
    this.router.navigate(['roles/gestion-roles-usuario']);
  }

  OnEditarRegistroClick(iRole: number, iApp: number, iSuite: number, iUser: number) {
    const usuRole = this.registros[iUser].aplicaciones[iApp].suites[iSuite].roles[iRole];
    if (usuRole.estadoUsuarioRole == true) {
      usuRole.estadoUsuarioRole = false;
    } else if (usuRole.estadoUsuarioRole == false) {
      usuRole.estadoUsuarioRole = true;
    }
    Swal.fire({
      title:
        usuRole.estadoUsuarioRole == true
          ? this.translate.instant('USUARIOSROLES.ACTIVATETITULO')
          : this.translate.instant('USUARIOSROLES.INACTIVATETITULO'),
      text:
        usuRole.estadoUsuarioRole == true
          ? this.translate.instant('USUARIOSROLES.ACTIVATETEXTO') + `"${usuRole.nombreRole}".!`
          : this.translate.instant('USUARIOSROLES.INACTIVATETEXTO') + `"${usuRole.nombreRole}".!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText:
        usuRole.estadoUsuarioRole == true
          ? this.translate.instant('USUARIOSROLES.ACTIVATE')
          : this.translate.instant('USUARIOSROLES.INACTIVATE'),
      cancelButtonText: this.translate.instant('PLATAFORMA.CANCEL')
    }).then((result: any) => {
      if (result.isConfirmed) {
        this.rolesUsuariosService.putModificarRegistro(usuRole).subscribe({
          next: (resp: any) => {
            this.consultarRegistros();
            Swal.fire(
              usuRole.estadoUsuarioRole == true
                ? this.translate.instant('USUARIOSROLES.ACTIVATEEXITOSA')
                : this.translate.instant('APLICACIONESINACTIVATEEXITOSA'),
              resp.mensaje,
              'success'
            );
          },
          error: (err: any) => {
            Swal.fire(
              'Error',
              usuRole.estadoRole == true
                ? this.translate.instant('USUARIOSROLES.ACTIVAVIONRERROR')
                : this.translate.instant('APLICACIONES.INACTIVACIONERROR'),
              'error'
            );
            console.error('Error eliminando', err);
          }
        });
      }
    });
  }

  OnEditarUsuarioRolesRegistroClick(id: number) {
    this.router.navigate(['roles/gestion-roles-usuario'], { queryParams: { usuId: id } });
  }

  OnEliminarRegistroClick(iRole: number, iApp: number, iSuite: number, iUser: number, nombre: string) {
    Swal.fire({
      title: this.translate.instant('USUARIOS.ELIMINARTITULO'),
      text: this.translate.instant('USUARIOS.ELIMINARTEXTO') + `"${nombre}".!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: this.translate.instant('PLATAFORMA.DELETE'),
      cancelButtonText: this.translate.instant('PLATAFORMA.CANCEL')
    }).then((result: any) => {
      if (result.isConfirmed) {
        const usuRole = this.registros[iUser].aplicaciones[iApp].roles[iRole];
        console.error('Eliminar el registro', usuRole);
        this.rolesUsuariosService.deleteEliminarRegistro(usuRole.usuarioRoleId).subscribe({
          next: (resp: any) => {
            Swal.fire(this.translate.instant('APLICACIONES.ELIMINAREXITOSA'), resp.mensaje, 'success');
            this.consultarRegistros();
          },
          error: (err: any) => {
            Swal.fire('Error', this.translate.instant('APLICACIONES.ELIMINARERROR'), 'error');
            console.error('Error eliminando', err);
          }
        });
      }
    });
  }

  getTooltipRoles(iRole: number, iApp: number, iSuite: number, iUser: number): string {
    const usuRole = this.registros[iUser].aplicaciones[iApp].suites[iSuite].roles[iRole];
    const tooltipEstado =
      usuRole.estadoUsuarioRole == false
        ? this.translate.instant('USUARIOSROLES.ACTIVATETITULO')
        : this.translate.instant('USUARIOSROLES.INACTIVATETITULO');
    return tooltipEstado;
  }

  toggleNav(): void {
    this.toggleSidebar.emit();
  }
}
