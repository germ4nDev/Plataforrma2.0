/* eslint-disable @angular-eslint/use-lifecycle-interface */
/* eslint-disable @typescript-eslint/no-explicit-any */
//#region IMPORTS
import { AfterViewInit, Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { Router } from '@angular/router';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { TranslateService } from '@ngx-translate/core';
import { BreadcrumbComponent } from '../../../theme/shared/components/breadcrumb/breadcrumb.component';
import { PTLRoleAPModel } from 'src/app/theme/shared/_helpers/models/PTLRoleAP.model';
import { PTLRolesAPService } from 'src/app/theme/shared/service/ptlroles-ap.service';
import { LanguageService } from 'src/app/theme/shared/service/lenguage.service';
import { PtlAplicacionesService } from 'src/app/theme/shared/service/ptlaplicaciones.service';
import { PTLAplicacionModel } from 'src/app/theme/shared/_helpers/models/PTLAplicacion.model';
import { catchError, Subject, tap } from 'rxjs';
import { of, Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { PtlSuitesAPService } from 'src/app/theme/shared/service/ptlsuites-ap.service';
import { NavBarComponent } from 'src/app/theme/layout/admin/nav-bar/nav-bar.component';
import { NavContentComponent } from 'src/app/theme/layout/admin/navigation/nav-content/nav-content.component';
import { NavigationItem } from 'src/app/theme/layout/admin/navigation/navigation';
import { NavigationService } from 'src/app/theme/shared/service/navigation.service';
//#endregion IMPORTS

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [CommonModule, DataTablesModule, SharedModule, TranslateModule, NavBarComponent, NavContentComponent],
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.scss'
})
export class RolesComponent implements OnInit, AfterViewInit {
  //#region VARIABLES
  [x: string]: any;
  @ViewChild(DataTableDirective, { static: false })
@Output() toggleSidebar = new EventEmitter<void>();
  datatableElement!: DataTableDirective;
  registrosSub?: Subscription;
  suitesSub?: Subscription;
  suites: any[] = [];
    activeTab: 'menu' | 'filters' | 'main' = 'menu';
  aplicaciones: PTLAplicacionModel[] = [];
  menuItems: NavigationItem[] = [];

  dtColumnSearchingOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  registros: PTLRoleAPModel[] = [];
  lang: string = localStorage.getItem('lang') || '';
  tituloPagina: string = '';
  //#endregion VARIABLES

  constructor(
    private router: Router,
    private rolesAPService: PTLRolesAPService,
    private translate: TranslateService,
    private navigationService: NavigationService,
    private aplicacionesService: PtlAplicacionesService,
    private suitesService: PtlSuitesAPService,
    private languageService: LanguageService,
    private BreadCrumb: BreadcrumbComponent
  ) {}

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
        const appCode = localStorage.getItem('aplicacionId') || 'plataforma';
    this.menuItems = this.navigationService.getNavigationItems(appCode);
    this.languageService.currentLang$.subscribe((lang) => {
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
          this.consultarRegistros();
        });
    });
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
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
          console.log('Ha ocurrido un error', err);
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

  OnEliminarRegistroClick(id: number, nombre: string) {
    Swal.fire({
      title: this.translate.instant('ROLES.ELIMINARTITULO'),
      text: this.translate.instant('ROLES.ELIMINARTEXTO') + `"${nombre}".!`,
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
