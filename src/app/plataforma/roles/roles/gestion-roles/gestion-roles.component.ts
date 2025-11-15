/* eslint-disable @typescript-eslint/no-explicit-any */
//#region IMPORTS
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { PTLRoleAPModel } from '../../../../theme/shared/_helpers/models/PTLRoleAP.model';
import { TranslateModule } from '@ngx-translate/core';
import { PTLRolesAPService } from 'src/app/theme/shared/service/ptlroles-ap.service';
import { PtlAplicacionesService } from 'src/app/theme/shared/service/ptlaplicaciones.service';
import { PTLAplicacionModel } from 'src/app/theme/shared/_helpers/models/PTLAplicacion.model';
import { catchError, Observable, of, Subscription, tap } from 'rxjs';
import { PtlSuitesAPService } from 'src/app/theme/shared/service/ptlsuites-ap.service';
import { NavBarComponent } from 'src/app/theme/layout/admin/nav-bar/nav-bar.component';
import { NavContentComponent } from 'src/app/theme/layout/admin/navigation/nav-content/nav-content.component';
import { NavigationService } from 'src/app/theme/shared/service/navigation.service';
import { v4 as uuidv4 } from 'uuid';
import Swal from 'sweetalert2';
import { NavigationItem } from 'src/app/theme/shared/_helpers/models/Navigation.model';
//#endregion IMPORTS

@Component({
  selector: 'app-gestion-roles',
  standalone: true,
  imports: [CommonModule, SharedModule, TranslateModule, NavBarComponent, NavContentComponent],
  templateUrl: './gestion-roles.component.html',
  styleUrl: './gestion-roles.component.scss'
})
export class GestionRolesComponent implements OnInit {
  @Output() toggleSidebar = new EventEmitter<void>();
  menuItems!: Observable<NavigationItem[]>;
  FormRegistro: PTLRoleAPModel = new PTLRoleAPModel();
  aplicaciones: PTLAplicacionModel[] = [];
  registrosSub?: Subscription;
  suitesSub?: Subscription;
  suites: any[] = [];
  suitesApp: any[] = [];
  form: undefined;
  isSubmit: boolean = false;
  modoEdicion: boolean = false;
  codeRegistro = uuidv4();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private _navigationService: NavigationService,
    private _registrosService: PTLRolesAPService,
    private _aplicacionesService: PtlAplicacionesService,
    private _suitesService: PtlSuitesAPService
  ) {
    this.isSubmit = false;
  }

  ngOnInit() {
    this._navigationService.getNavigationItems();
    this.menuItems = this._navigationService.menuItems$;
    this.consultarAplicaciones();
    this.consultarSuites();
    this.route.queryParams.subscribe((params) => {
      const registroId = params['regId'];
      if (registroId) {
        // console.log('me llena el Id', registroId);
        this.modoEdicion = true;
        this._registrosService.getRegistroById(registroId).subscribe({
          next: (resp: any) => {
            console.log('resp', resp);
            this.suitesApp = this.suites.filter((x) => x.aplicacionId == resp.role.aplicacionId);
            this.FormRegistro = resp.role;
            console.log('datos del FormRegistro', this.FormRegistro);
          },
          error: () => {
            Swal.fire('Error', 'No se pudo obtener el rol', 'error');
          }
        });
      } else {
        // console.log('no llena el Id', registroId);
        this.modoEdicion = false;
        // this.FormRegistro.codigoAplicacion = uuidv4();
      }
    });
  }

  consultarAplicaciones() {
    this.registrosSub = this._aplicacionesService
      .getAplicaciones()
      .pipe(
        tap((resp: any) => {
          if (resp.ok) {
            this.aplicaciones = resp.aplicaciones;
            // console.log('Todos las aplicaciones', this.aplicaciones);
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

  consultarSuites() {
    this.suitesSub = this._suitesService
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

  onAplicacionchangeClick(event: any) {
    const value = event.target.value;
    const app = this.aplicaciones.filter((x) => x.codigoAplicacion == value)[0];
    // console.log('Código de aplicación seleccionado:', value);
    // console.log('data aplicación seleccionado:', app);
    this.FormRegistro.aplicacionId = app.aplicacionId;
    this.FormRegistro.codigoAplicacion = value;
    this.suitesApp = this.suites.filter((x) => x.aplicacionId == app.aplicacionId);
  }

  onSuiteChangeClick(event: any) {
    const value = event.target.value;
    const suite = this.suites.filter((x) => x.suiteId == value)[0];
    // console.log('Código de suite seleccionado:', value);
    // console.log('data suite seleccionado:', suite);
    this.FormRegistro.suiteId = suite.suiteId;
    this.FormRegistro.codigoSuite = value;
  }

  btnGestionarRegistroClick(form: any) {
    this.isSubmit = true;
    if (!form.valid) {
      return;
    }
    if (this.modoEdicion) {
      // console.log('1.0 modificar usuario', this.FormRegistro);
      this._registrosService.putModificarRegistro(this.FormRegistro).subscribe({
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
      // console.log('formregistro', this.FormRegistro);
      this._registrosService.postCrearRegistro(this.FormRegistro).subscribe({
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
    this.router.navigate(['/roles/roles']);
  }

  toggleNav(): void {
    this.toggleSidebar.emit();
  }
}
