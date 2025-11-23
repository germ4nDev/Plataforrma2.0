/* eslint-disable @typescript-eslint/no-explicit-any */
// angular import
import { Component, OnDestroy, OnInit } from '@angular/core';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { RouterModule } from '@angular/router';
import { Router, ActivatedRoute } from '@angular/router';

// bootstrap import
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

// third party
import { ColorPickerModule } from 'ngx-color-picker';
import { PtlAplicacionesService, PTLRolesAPService, PtlusuariosRolesApService, PtlusuariosScService, UtilidadesService } from 'src/app/theme/shared/service';
import { Subscription } from 'rxjs';
import { PTLAplicacionModel } from 'src/app/theme/shared/_helpers/models/PTLAplicacion.model';
import { LocalStorageService } from 'src/app/theme/shared/service/local-storage.service';
import { LanguageSelectorComponent } from 'src/app/theme/shared/components/language-selector/language-selector.component';
import { environment } from 'src/environments/environment';
import { FullScreenSliderComponent } from 'src/app/theme/shared/components/fullscreen-slider/fullscreen-slider.component';
import { PTLUsuarioSCModel } from 'src/app/theme/shared/_helpers/models/PTLUsuarioSC.model';
import { PTLRoleAPModel } from 'src/app/theme/shared/_helpers/models/PTLRoleAP.model';
import { PTLUsuarioRoleAP } from 'src/app/theme/shared/_helpers/models/PTLUsuarioRole.model';

const base_url = environment.apiUrl;

@Component({
  selector: 'app-inicio-aplicaciones',
  standalone: true,
  imports: [NgbDropdownModule, RouterModule, ColorPickerModule, SharedModule, LanguageSelectorComponent, FullScreenSliderComponent],
  templateUrl: './inicio-aplicaciones.component.html',
  styleUrl: './inicio-aplicaciones.component.scss'
})
export class InicioAplicacionesComponent implements OnInit, OnDestroy {
  public appCode: string = '';
  aplicacionesSub?: Subscription;
  aplicaciones: PTLAplicacionModel[] = [];
  suscriptor: string = '';
  subscriptions = new Subscription();
  roles: PTLRoleAPModel[] = [];
  usuariosRoles: PTLUsuarioRoleAP[] = [];
  usuariosSC: PTLUsuarioSCModel[] = [];
  usuarioSC: PTLUsuarioSCModel = {} as PTLUsuarioSCModel;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private _aplicacionesService: PtlAplicacionesService,
    private _localStorageService: LocalStorageService,
    private _usuariosSCService: PtlusuariosScService,
    private _rolesService: PTLRolesAPService,
    private _utilidadesService: UtilidadesService,
    private _usuarioRolesService: PtlusuariosRolesApService
  ) {
    this.suscriptor = this._localStorageService.getSuscriptorPlataformaLocalStorage();
    console.log('no hay suscriptor suscriptor');
  }

  ngOnInit(): void {
    console.log('ingresa a la plataforma');
    setTimeout(() => {
      this.consultarAplicaciones();
    }, 500);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  consultarAplicaciones() {
    this.subscriptions.add(
      this._aplicacionesService.getAplicaciones().subscribe((resp: any) => {
        if (resp.ok) {
          resp.aplicaciones.forEach((app: any) => {
            // app.imagenInicio = this._uploadService.getFilePath('aplicaciones', app.imagenInicio);
            app.imagenInicio = `${base_url}/upload/${this.suscriptor}/aplicaciones/${app.imagenInicio}`;
          });
          this.aplicaciones = resp.aplicaciones;
          this.consultarUusuariosSC();
          console.log('Todos las aplicaciones', this.aplicaciones);
          return;
        }
      })
    );
  }

  consultarUusuariosSC() {
    const user = this._localStorageService.getUsuarioLocalStorage();
    console.log('&&&&&&&& usuariosSC');
    this.subscriptions.add(
      this._usuariosSCService._usuariosSC$.subscribe({
        next: (usuariosSC: PTLUsuarioSCModel[]) => {
          this.usuarioSC = usuariosSC.filter((x) => x.codigoUsuario == user?.codigoUsuario)[0];
          console.log('usuarioSC:', this.usuarioSC);
          this.consultarRoles();
        },
        error: (err) => {
          console.error('Error al cargar los roles de usuariosSC:', err);
          this.usuarioSC = {} as PTLUsuarioSCModel;
        }
      })
    );
  }

  consultarRoles() {
    console.log('acaaaaaaaaa');
    this.subscriptions.add(
      this._rolesService.roles$.subscribe({
        next: (roles: PTLRoleAPModel[]) => {
          console.log('Roles de usuario cargados con éxito:', roles.length);
          this.roles = roles;
          this.consultarUsuariosRoles();
          console.log('Roles de usuario:', roles);
        },
        error: (err) => {
          console.error('Error al cargar los roles de usuario:', err);
          this.roles = [];
        }
      })
    );
  }

  consultarUsuariosRoles() {
    console.log('acaaaaaaaaa');
    this.subscriptions.add(
      this._usuarioRolesService._usuariosRoles$.subscribe({
        next: (userRoles: PTLUsuarioRoleAP[]) => {
          console.log('usuarios roles cargados con éxito:', userRoles.length);
          this.usuariosRoles = userRoles;
          console.log('usuarios roles:', userRoles);
        },
        error: (err) => {
          console.error('Error al cargar los roles de usuario:', err);
          this.usuariosRoles = [];
        }
      })
    );
  }

  ingresarPlataforma(app: PTLAplicacionModel) {
    //TODO Validar las aplicaciones y los roles
    const current = this._localStorageService.getCurrentUserLocalStorage();
    const rolesAplicacion = this.roles.filter((x) => x.codigoAplicacion == app.codigoAplicacion);
    const rolesUsuarioSC: PTLUsuarioRoleAP[] = this.usuariosRoles.filter((x) => x.codigoUsuarioSC == this.usuarioSC?.codigoUsuarioSC);
    const rolesUsuarioAplicacion = this._utilidadesService.getRelacional(rolesAplicacion, rolesUsuarioSC, 'codigoRole');
    console.log('Roles en comun', rolesUsuarioAplicacion);
    if (rolesUsuarioAplicacion.length > 0) {
      current.roles = [];
      rolesUsuarioAplicacion.forEach((role) => {
        const roleData = this.roles.filter((x) => x.codigoRole === role.codigoRole)[0];
        if (roleData) {
          const existe = current.roles?.filter((x: { codigoRole: string | undefined }) => x.codigoRole === roleData.codigoRole);
          if (existe?.length === 0) {
            current.roles?.push(roleData);
          }
        }
      });
    }
    console.log('New CurrentUser', current);
    this._localStorageService.setAplicacionLocalStorage(app);
    this._localStorageService.setCurrentUserLocalStorage(current);
    this.router.navigate(['/starter/inicio-suites']);
  }
}
