/* eslint-disable @angular-eslint/use-lifecycle-interface */
/* eslint-disable @typescript-eslint/no-explicit-any */
//#region IMPORTS
import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { Router } from '@angular/router';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { TranslateService } from '@ngx-translate/core';
import { PTLRoleAPModel } from 'src/app/theme/shared/_helpers/models/PTLRoleAP.model';
import { PTLRolesAPService } from 'src/app/theme/shared/service/ptlroles-ap.service';
import { LanguageService } from 'src/app/theme/shared/service/lenguage.service';
import { PtlAplicacionesService } from 'src/app/theme/shared/service/ptlaplicaciones.service';
import { PTLAplicacionModel } from 'src/app/theme/shared/_helpers/models/PTLAplicacion.model';
import { catchError, Observable, Subject, tap } from 'rxjs';
import { PtlSuitesAPService } from 'src/app/theme/shared/service/ptlsuites-ap.service';
import { NavBarComponent } from 'src/app/theme/layout/admin/nav-bar/nav-bar.component';
import { NavContentComponent } from 'src/app/theme/layout/admin/navigation/nav-content/nav-content.component';
import { NavigationItem } from 'src/app/theme/layout/admin/navigation/navigation';
import { NavigationService } from 'src/app/theme/shared/service/navigation.service';
import { DatatableComponent } from 'src/app/theme/shared/components/data-table/data-table.component';
import { of, Subscription } from 'rxjs';
import Swal from 'sweetalert2';
//#endregion IMPORTS

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [CommonModule, DataTablesModule, SharedModule, TranslateModule, NavBarComponent, NavContentComponent, DatatableComponent],
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.scss'
})
export class RolesComponent implements OnInit {
  //#region VARIABLES
  [x: string]: any;
  @ViewChild(DataTableDirective, { static: false })
  dtColumnSearchingOptions: DataTables.Settings = {};
  datatableElement!: DataTableDirective;
  dtTrigger: Subject<any> = new Subject<any>();

  @Output()
  toggleSidebar = new EventEmitter<void>();

  activeTab: 'menu' | 'filters' | 'main' = 'menu';
  menuItems!: Observable<NavigationItem[]>;
  registrosSub?: Subscription;
  suitesSub?: Subscription;
  suites: any[] = [];
  aplicaciones: PTLAplicacionModel[] = [];

  registros: PTLRoleAPModel[] = [];
  registrosFiltrado: PTLRoleAPModel[] = [];
  lang: string = localStorage.getItem('lang') || '';
  tituloPagina: string = '';
  //#endregion VARIABLES

  constructor(
    private router: Router,
    private rolesAPService: PTLRolesAPService,
    private translate: TranslateService,
    private _navigationService: NavigationService,
    private _aplicacionesService: PtlAplicacionesService,
    private _suitesService: PtlSuitesAPService,
    private _languageService: LanguageService
  ) {}

  ngOnInit() {
    this._navigationService.getNavigationItems();
    this.menuItems = this._navigationService.menuItems$;
    this.consultarRegistros();
    this._languageService.currentLang$.subscribe((lang) => {
      this.translate.use(lang);
      this.translate
        .get(['ROLES.NOMBREAPLICACION', 'ROLES.NOMBRESUITE', 'ROLES.NOMBREROLE', 'ROLES.DESCRIPCIONROLE', 'ROLES.ESTADOROLE'])
        .subscribe((translations) => {
          this.tituloPagina = translations['ROLES.TITLE'];
          this.dtColumnSearchingOptions = {
            responsive: true,
            columns: [
              { title: translations['ROLES.NOMBREAPLICACION'], data: 'nombreSuite' },
              { title: translations['ROLES.NOMBRESUITE'], data: 'nombreAplicacion' },
              { title: translations['ROLES.NOMBREROLE'], data: 'nombreRole' },
              { title: translations['ROLES.DESCRIPCIONROL'], data: 'descripcionRole' },
              { title: translations['ROLES.ESTADOROLE'], data: 'estadoRole' },
              { title: translations['PLATAFORMA.OPTIONS'], data: 'opciones' }
            ]
          };
        });
    });
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  consultarAplicaciones() {
    this.registrosSub = this._aplicacionesService
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
            console.log('Todos las suites', this.suites);
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

  consultarRegistros() {
    this.consultarAplicaciones();
    this.consultarSuites();
    this.registrosSub = this.rolesAPService
      .getRegistros()
      .pipe(
        tap((resp: any) => {
          if (resp.ok) {
            resp.roles.forEach((role: any) => {
              const app = this.aplicaciones.filter((x) => x.codigoAplicacion == role.codigoAplicacion)[0];
              console.log('el role', role);
              console.log('las suites', this.suites);
              const sui = this.suites.filter((x) => x.suiteId == role.suiteId)[0];
              console.log('sui', sui);
              role.nombreAplicacion = app.nombreAplicacion;
              role.nombreSuite = sui.nombreSuite;
              role.nomEstado = role.estadoRole == true ? 'Activo' : 'Inactivo';
            });
            this.registros = resp.roles;
            this.registrosFiltrado = resp.roles;
            console.log('Todos las roles', this.registros);
            this.dtTrigger.next(null);
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

  filtrarColumna(columna: number, valor: string) {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.column(columna).search(valor).draw();
    });
  }

  getEstado(estado: boolean): string {
    return estado ? 'Activo' : 'Inactivo';
  }

  OnNuevoRegistroClick() {
    this.router.navigate(['roles/gestion-roles']);
  }

  OnEditarRegistroClick(id: number) {
    this.router.navigate(['roles/gestion-roles'], { queryParams: { regId: id } });
  }

  OnEliminarRegistroClick(id: number) {
    const nombre = this.registrosFiltrado.filter((x) => x.roleId == id)[0];
    Swal.fire({
      title: this.translate.instant('ROLES.ELIMINARTITULO'),
      text: this.translate.instant('ROLES.ELIMINARTEXTO') + `"${nombre.nombreRole}".!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: this.translate.instant('PLATAFORMA.DELETE'),
      cancelButtonText: this.translate.instant('PLATAFORMA.CANCEL')
    }).then((result: any) => {
      if (result.isConfirmed) {
        this.rolesAPService.deleteEliminarRegistro(id).subscribe({
          next: (resp: any) => {
            Swal.fire(this.translate.instant('ROLES.ELIMINAREXITOSA'), resp.mensaje, 'success');
            this.registros = this.registros.filter((s) => s.roleId !== id);
          },
          error: (err: any) => {
            Swal.fire('Error', this.translate.instant('ROLES.ELIMINARERROR'), 'error');
            console.error('Error eliminando', err);
          }
        });
      }
    });
  }

  toggleNav(): void {
    this.toggleSidebar.emit();
  }
}
