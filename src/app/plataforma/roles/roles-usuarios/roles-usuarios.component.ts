//#region IMPORTS
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { Router } from '@angular/router';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { TranslateService } from '@ngx-translate/core';
import { BreadcrumbComponent } from '../../../theme/shared/components/breadcrumb/breadcrumb.component';
import { PTLUsuarioModel } from 'src/app/theme/shared/_helpers/models/PTLUsuario.model';
import { PTLAplicacionModel } from 'src/app/theme/shared/_helpers/models/PTLAplicacion.model';
import { PTLUsuarioRoleAP } from 'src/app/theme/shared/_helpers/models/PTLUsuarioRole.model';
import { PTLUsuariosService } from 'src/app/theme/shared/service/ptlusuarios.service';
import { PtlusuariosRolesApService } from 'src/app/theme/shared/service/ptlusuarios-roles-ap.service';
import { PtlAplicacionesService } from 'src/app/theme/shared/service/ptlaplicaciones.service';
import { LanguageService } from 'src/app/theme/shared/service/lenguage.service';
import { catchError, Subject, tap } from 'rxjs';
import { of, Subscription } from 'rxjs';
import Swal from 'sweetalert2';
//#endregion IMPORTS

@Component({
  selector: 'app-roles-usuarios',
  standalone: true,
  imports: [CommonModule, DataTablesModule, SharedModule, BreadcrumbComponent, TranslateModule],
  templateUrl: './roles-usuarios.component.html',
  styleUrl: './roles-usuarios.component.scss'
})
export class RolesUsuariosComponent implements OnInit, AfterViewInit {
  //#region VARIABLES
  [x: string]: any;
  @ViewChild(DataTableDirective, { static: false })
  datatableElement!: DataTableDirective;
  registrosSub?: Subscription;
  raplicacionesSub?: Subscription;
  usuariosSub?: Subscription;

  dtColumnSearchingOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  usuarios: PTLUsuarioModel[] = [];
  registros: PTLUsuarioModel[] = [];
  aplicaciones: PTLAplicacionModel[] = [];
  lang: string = localStorage.getItem('lang') || '';
  tituloPagina: string = '';
  //#endregion VARIABLES

  constructor(
    private router: Router,
    private usuariosService: PTLUsuariosService,
    private rolesUsuariosService: PtlusuariosRolesApService,
    private aplicacionesService: PtlAplicacionesService,
    private translate: TranslateService,
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
    this.languageService.currentLang$.subscribe((lang) => {
      this.translate.use(lang);
      this.translate
        .get(['USUARIOS.IDENTIFICACION', 'USUARIOS.NAME', 'USUARIOS.APLICACIONES', 'USUARIOS.ROLES', 'USUARIOS.FOTO'])
        .subscribe((translations) => {
          this.tituloPagina = translations['USUARIOS.TITLE'];
          this.dtColumnSearchingOptions = {
            responsive: true,
            columns: [
              { title: translations['USUARIOS.FOTO'], data: 'fotoUsuario' },
              { title: translations['USUARIOS.IDENTIFICACION'], data: 'identificacionUsuario' },
              { title: translations['USUARIOS.NAME'], data: 'nombreUsuario' },
              { title: translations['USUARIOS.APLICACIONES'], data: 'correoUsuario' },
              { title: translations['USUARIOS.ROLES'], data: 'userNameUsuario' },
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
    this.raplicacionesSub = this.aplicacionesService
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

  consultarUsuarios() {
    this.usuariosSub = this.usuariosService
      .getUsuarios()
      .pipe(
        tap((resp: any) => {
          if (resp.ok) {
            resp.usuarios.forEach((regs: any) => {
              regs.nomEstado = regs.estadoUsuario == true ? 'Activo' : 'Inactivo';
            });
            this.usuarios = resp.usuarios;
            console.log('Todos las usuarios', this.registros);
            this.dtTrigger.next(null); // <--- Dispara la actualización de la tabla
            return;
          }
        }),
        catchError((err) => {
          return of(null);
        })
      )
      .subscribe();
  }

  consultarRegistros() {
    this.registrosSub = this.rolesUsuariosService
      .getRegistros()
      .pipe(
        tap((resp: any) => {
          if (resp.ok) {
            resp.usuariosRoles.forEach((regs: any) => {
              regs.nomEstado = regs.estadoUsuario == true ? 'Activo' : 'Inactivo';
              const usuario = this.usuarios.filter(x => x.usuarioId == resp.usuarioId);
            });
            this.registros = resp.usuariosRoles;
            console.log('Todos las usuarios', this.registros);
            this.dtTrigger.next(null); // <--- Dispara la actualización de la tabla
            return;
          }
        }),
        catchError((err) => {
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
    this.router.navigate(['usuarios/gestion-usuario']);
  }

  OnEditarRegistroClick(id: number) {
    this.router.navigate(['usuarios/gestion-usuario'], { queryParams: { regId: id } });
  }

  OnEliminarRegistroClick(id: number, nombre: string) {
    Swal.fire({
      title: this.translate.instant('USUARIOS.ELIMINARTITULO'),
      text: this.translate.instant('USUARIOS.ELIMINARTEXTO') + `"${nombre}".!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: this.translate.instant('PLATAFORMA.DELETE'),
      cancelButtonText: this.translate.instant('PLATAFORMA.CANCEL')
    }).then((result: any) => {
      if (result.isConfirmed) {
        this.usuariosService.eliminarUsuairo(id).subscribe({
          next: (resp: any) => {
            Swal.fire(this.translate.instant('APLICACIONES.ELIMINAREXITOSA'), resp.mensaje, 'success');
            this.registros = this.registros.filter((s) => s.usuarioId !== id);
          },
          error: (err: any) => {
            Swal.fire('Error', this.translate.instant('APLICACIONES.ELIMINARERROR'), 'error');
            console.error('Error eliminando', err);
          }
        });
      }
    });
  }
}
