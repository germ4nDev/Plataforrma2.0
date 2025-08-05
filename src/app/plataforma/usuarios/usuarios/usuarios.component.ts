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
import { PTLUsuarioModel } from 'src/app/theme/shared/_helpers/models/PTLUsuario.model';
import { PTLUsuariosService } from 'src/app/theme/shared/service/ptlusuarios.service';
import { LanguageService } from 'src/app/theme/shared/service/lenguage.service';
import { catchError, Subject, tap } from 'rxjs';
import { of, Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { NavBarComponent } from 'src/app/theme/layout/admin/nav-bar/nav-bar.component';
import { NavContentComponent } from 'src/app/theme/layout/admin/navigation/nav-content/nav-content.component';
import { NavigationItem } from 'src/app/theme/layout/admin/navigation/navigation';
import { NavigationService } from 'src/app/theme/shared/service/navigation.service';
import { DatatableComponent } from 'src/app/theme/shared/components/data-table/data-table.component';
//#endregion IMPORTS

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, DataTablesModule, SharedModule, TranslateModule, NavBarComponent, NavContentComponent, DatatableComponent],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.scss'
})
export class UsuariosComponent implements OnInit, AfterViewInit {
  //#region VARIABLES
  [x: string]: any;
  @ViewChild(DataTableDirective, { static: false })
  datatableElement!: DataTableDirective;
  @Output() toggleSidebar = new EventEmitter<void>();
  registrosSub?: Subscription;
  activeTab: 'menu' | 'filters' | 'main' = 'menu';
  menuItems: NavigationItem[] = [];

  dtColumnSearchingOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  registros: PTLUsuarioModel[] = [];
  registrosFiltrado: PTLUsuarioModel[] = [];
  lang: string = localStorage.getItem('lang') || '';
  tituloPagina: string = '';
  //#endregion VARIABLES

  constructor(
    private router: Router,
    private navigationService: NavigationService,
    private usuariosService: PTLUsuariosService,
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
    const appCode = localStorage.getItem('aplicacionId') || 'plataforma';
    this.menuItems = this.navigationService.getNavigationItems(appCode);
    console.log('elementos menu componente', this.menuItems);
    this.languageService.currentLang$.subscribe((lang) => {
      this.translate.use(lang);
      this.translate
        .get([
          'USUARIOS.IDENTIFICACION',
          'USUARIOS.NAME',
          'USUARIOS.CORREO',
          'USUARIOS.USERNAME',
          'USUARIOS.DESCRIPCION',
          'USUARIOS.FOTO',
          'USUARIOS.ESTADO'
        ])
        .subscribe((translations) => {
          this.tituloPagina = translations['USUARIOS.TITLE'];
          this.dtColumnSearchingOptions = {
            responsive: true,
            columns: [
              { title: translations['USUARIOS.FOTO'], data: 'fotoUsuario' },
              { title: translations['USUARIOS.IDENTIFICACION'], data: 'identificacionUsuario' },
              { title: translations['USUARIOS.NAME'], data: 'nombreUsuario' },
              { title: translations['USUARIOS.CORREO'], data: 'correoUsuario' },
              { title: translations['USUARIOS.USERNAME'], data: 'userNameUsuario' },
              { title: translations['USUARIOS.STATUS'], data: 'estadoAplicacion' },
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

  consultarRegistros() {
    this.registrosSub = this.usuariosService
      .getUsuarios()
      .pipe(
        tap((resp: any) => {
          if (resp.ok) {
            resp.usuarios.forEach((regs: any) => {
              regs.nomEstado = regs.estadoUsuario == true ? 'Activo' : 'Inactivo';
            });
            this.registros = resp.usuarios;
            this.registrosFiltrado = resp.usuarios;
            console.log('Todos las usuarios', this.registros);
            this.dtTrigger.next(null); // <--- Dispara la actualización de la tabla
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
    this.router.navigate(['usuarios/gestion-usuario']);
  }

  OnEditarRegistroClick(id: number) {
    this.router.navigate(['usuarios/gestion-usuario'], { queryParams: { regId: id } });
  }

  OnEliminarRegistroClick(id: number) {
    const nombre = this.registrosFiltrado.filter((x) => x.usuarioId == id)[0];
    Swal.fire({
      title: this.translate.instant('USUARIOS.ELIMINARTITULO'),
      text: `this.translate.instant('USUARIOS.ELIMINARTEXTO') + "${nombre.nombreUsuario}".`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: this.translate.instant('PLATAFORMA.DELETE'),
      cancelButtonText: this.translate.instant('PLATAFORMA.CANCEL')
    }).then((result: any) => {
      if (result.isConfirmed) {
        this.usuariosService.eliminarUsuairo(id).subscribe({
          next: (resp: any) => {
            Swal.fire(this.translate.instant('USUARIOS.ELIMINAREXITOSA'), resp.mensaje, 'success');
            this.registros = this.registros.filter((s) => s.usuarioId !== id);
          },
          error: (err: any) => {
            Swal.fire('Error', this.translate.instant('USUARIOS.ELIMINARERROR'), 'error');
            console.error('Error eliminando', err);
          }
        });
      }
    });
  }

  onFiltroIdentificacionChangeClick(evento: any) {
    console.log('filtrar el nombre ', evento.target.value);
    const textoFiltro = evento.target.value;
    if (!textoFiltro) {
      this.registrosFiltrado = [...this.registros];
    } else {
      this.registrosFiltrado = this.registrosFiltrado.filter((usuario) => String(usuario.identificacionUsuario || 0).includes(textoFiltro));
    }
  }

  onFiltroNombreChangeClick(evento: any) {
    console.log('filtrar el nombre ', evento.target.value);
    const textoFiltro = evento.target.value.toLowerCase();
    if (!textoFiltro) {
      this.registrosFiltrado = [...this.registros];
    } else {
      this.registrosFiltrado = this.registrosFiltrado.filter((usuario) =>
        (usuario.nombreUsuario || '').toLowerCase().includes(textoFiltro)
      );
    }
  }

  onFiltroCorreoChangeClick(evento: any) {
    console.log('filtrar el correo ', evento.target.value);
    const textoFiltro = evento.target.value.toLowerCase();
    if (!textoFiltro) {
      this.registrosFiltrado = [...this.registros];
    } else {
      this.registrosFiltrado = this.registrosFiltrado.filter((usuario) =>
        (usuario.correoUsuario || '').toLowerCase().includes(textoFiltro)
      );
    }
  }

  onFiltroUsernameChangeClick(evento: any) {
    console.log('filtrar el username ', evento.target.value);
    const textoFiltro = evento.target.value.toLowerCase();
    if (!textoFiltro) {
      this.registrosFiltrado = [...this.registros];
    } else {
      this.registrosFiltrado = this.registrosFiltrado.filter((usuario) =>
        (usuario.userNameUsuario || '').toLowerCase().includes(textoFiltro)
      );
    }
  }

  onFiltroDescripcionChangeClick(evento: any) {
    console.log('filtrar el descripcion ', evento.target.value);
    const textoFiltro = evento.target.value.toLowerCase();
    if (!textoFiltro) {
      this.registrosFiltrado = [...this.registros];
    } else {
      this.registrosFiltrado = this.registrosFiltrado.filter((usuario) =>
        (usuario.descripcionUsuario || '').toLowerCase().includes(textoFiltro)
      );
    }
  }

  onFiltroEstadoChangeClick(evento: any) {
    console.log('filtrar el estado ', evento.target.value);
    if (evento.target.value == 'todos') {
      this.registrosFiltrado = [...this.registros];
    } else {
      const estado = evento.target.value == 'true' ? true : false;
      console.log('Usuarios', this.registrosFiltrado);
      this.registrosFiltrado = this.registros.filter((x) => (x.estadoUsuario = estado));
    }
  }

  toggleNav(): void {
    this.toggleSidebar.emit();
  }
}
