/* eslint-disable @angular-eslint/use-lifecycle-interface */
/* eslint-disable @typescript-eslint/no-explicit-any */
//#region IMPORTS
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTablesModule } from 'angular-datatables';
import { Router } from '@angular/router';
import { GradientConfig } from 'src/app/app-config';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { TranslateService } from '@ngx-translate/core';
import { PTLUsuarioModel } from 'src/app/theme/shared/_helpers/models/PTLUsuario.model';
import { PTLUsuariosService } from 'src/app/theme/shared/service/ptlusuarios.service';
import { LanguageService } from 'src/app/theme/shared/service/lenguage.service';
import { BehaviorSubject, catchError, combineLatest, map, Observable, startWith, switchMap } from 'rxjs';
import { NavBarComponent } from 'src/app/theme/layout/admin/nav-bar/nav-bar.component';
import { NavContentComponent } from 'src/app/theme/layout/admin/navigation/nav-content/nav-content.component';
import { NavigationService } from 'src/app/theme/shared/service/navigation.service';
import { DatatableComponent } from 'src/app/theme/shared/components/data-table/data-table.component';
import { of, Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { SwalAlertService } from '../../../theme/shared/service/swal-alert.service';
import { ColumnMetadata } from 'src/app/theme/shared/_helpers/models/ColumnMetadata.model';
import { NavigationItem } from 'src/app/theme/shared/_helpers/models/Navigation.model';
import { BaseSessionModel } from 'src/app/theme/shared/_helpers/models/BaseSession.model';
import { PTLLogActividadAPModel } from 'src/app/theme/shared/_helpers/models/PTLlogActividadAP.model';
//#endregion IMPORTS

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, DataTablesModule, SharedModule, TranslateModule, NavBarComponent, NavContentComponent, DatatableComponent],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.scss'
})
export class UsuariosComponent implements OnInit {
  //#region VARIABLES
  @Output() toggleSidebar = new EventEmitter<void>();
  DataModel: BaseSessionModel = new BaseSessionModel();
  DataLogActividad: PTLLogActividadAPModel = new PTLLogActividadAPModel();
  moduloTituloExcel: string = '';
  hasFiltersSlot: boolean = false;
  gradientConfig;
  lang = localStorage.getItem('lang');
  menuItems$!: Observable<NavigationItem[]>;
  activeTab: 'menu' | 'filters' | 'main' = 'menu';
  tituloPagina: string = '';

  subscriptions = new Subscription();
  filtroIdentificacionSubject = new BehaviorSubject<string>('');
  filtroNombreSubject = new BehaviorSubject<string>('');
  filtroCorreoSubject = new BehaviorSubject<string>('');
  filtroUsernameSubject = new BehaviorSubject<string>('');
  filtroDescripcionSubject = new BehaviorSubject<string>('');
  filtroEstadoSubject = new BehaviorSubject<string>('todos');

  registrosTransformados$: Observable<PTLUsuarioModel[]> = of([]);
  registrosFiltrado$: Observable<PTLUsuarioModel[]> = of([]);
  usuairos: PTLUsuarioModel[] = [];
  registros: PTLUsuarioModel[] = [];
  //#endregion VARIABLES

  constructor(
    private router: Router,
    private translate: TranslateService,
    private _navigationService: NavigationService,
    private _swalService: SwalAlertService,
    private _usuariosService: PTLUsuariosService,
    private _languageService: LanguageService
  ) {
    this.gradientConfig = GradientConfig;
  }

  ngOnInit() {
    this._navigationService.getNavigationItems();
    this.menuItems$ = this._navigationService.menuItems$;
    this.hasFiltersSlot = true;
    this.consultarRegistros();
    setTimeout(() => {
      this.setupRegistrosStream();
    }, 100);
    this.subscriptions.add(
      this._usuariosService.cargarRegistros().subscribe(
        () => console.log('Usuarios cargados y guardados en el servicio'),
        (err) => console.error('Error al cargar usuarios:', err)
      )
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  columnasUsuarios: ColumnMetadata[] = [
    {
      name: 'fotoUsuario',
      header: 'USUARIOS.FOTO',
      type: 'avatar', // 👈 ¡CLAVE! Esto le dice al datatable que renderice la imagen.
      isSortable: false
    },
    {
      name: 'identificacionUsuario',
      header: 'USUARIOS.IDENTIFICACION',
      type: 'text'
    },
    {
      name: 'nombreUsuario',
      header: 'USUARIOS.NAME',
      type: 'text'
    },
    {
      name: 'correoUsuario',
      header: 'USUARIOS.CORREO',
      type: 'text'
    },
    {
      name: 'userNameUsuario',
      header: 'USUARIOS.USERNAME',
      type: 'text'
    },
    {
      name: 'nomEstado',
      header: 'USUARIOS.STATUS',
      type: 'text'
    }
    // Si tuvieras una columna de precio, usarías:
    // { name: 'costo', header: 'USUARIOS.COSTO', type: 'number' }
  ];

  columnasDetailRegistros: ColumnMetadata[] = [
    {
      name: 'descripcionUsuario',
      header: 'USUARIOS.DESCRIPTION',
      type: 'text'
    }
  ];

  consultarRegistros() {
    this.subscriptions.add(
      this._usuariosService.getUsuarios().subscribe((resp: any) => {
        if (resp.ok) {
          this.usuairos = resp.usuarios;
          console.log('Todos las usuarios', this.usuairos);
          return;
        }
      })
    );
  }

  setupRegistrosStream(): void {
    this.registrosTransformados$ = this._usuariosService.usuarios$.pipe(
      switchMap((users: PTLUsuarioModel[]) => {
        console.log('================== usuarios 1', users);
        if (!users) return of([]);
        this.usuairos = users;
        const transformedApps = users.map((user: any) => {
          user.nomEstado = user.estadoAplicacion ? 'Activo' : 'Inactivo';
          return user as PTLUsuarioModel;
        });
        this.registros = transformedApps;
        return of(transformedApps);
      }),
      catchError((err) => {
        console.error('Error en el stream de aplicaciones:', err);
        return of([]);
      })
    );

    this.registrosFiltrado$ = combineLatest([
      this.registrosTransformados$.pipe(startWith([])), // Usa la fuente de datos transformada
      this.filtroIdentificacionSubject,
      this.filtroNombreSubject,
      this.filtroCorreoSubject,
      this.filtroUsernameSubject,
      this.filtroDescripcionSubject,
      this.filtroEstadoSubject
    ]).pipe(
      map(([users, identificacion, nombre, correo, username, descripcion, estado]) => {
        console.log('================== roles 2', users);
        let filteredRegistros = users;
        if (identificacion) {
          filteredRegistros = filteredRegistros.filter((app) =>
            (app.identificacionUsuario?.toString() || '').toLowerCase().includes(identificacion)
          );
        }
        if (nombre) {
          filteredRegistros = filteredRegistros.filter((reg) => (reg.nombreUsuario?.toString() || '').toLowerCase().includes(nombre));
        }
        if (correo) {
          filteredRegistros = filteredRegistros.filter((reg) => (reg.correoUsuario?.toString() || '').toLowerCase().includes(correo));
        }
        if (username) {
          filteredRegistros = filteredRegistros.filter((reg) => (reg.userNameUsuario?.toString() || '').toLowerCase().includes(username));
        }
        if (estado !== 'todos') {
          const estadoBoolean = estado === 'true';
          filteredRegistros = filteredRegistros.filter((reg) => reg.estadoUsuario === estadoBoolean);
        }
        if (descripcion) {
          const textoFiltro = descripcion.toLowerCase();
          filteredRegistros = filteredRegistros.filter((reg) => (reg.descripcionUsuario || '').toLowerCase().includes(textoFiltro));
        }
        return filteredRegistros;
      })
    );
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

  OnEliminarRegistroClick(id: any) {
    const usuario = this.usuairos.filter((x) => x.codigoUsuario == id.id)[0];
    Swal.fire({
      title: this.translate.instant('USUARIOS.ELIMINARTITULO'),
      text: `this.translate.instant('USUARIOS.ELIMINARTEXTO') + "${usuario.nombreUsuario}".`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: this.translate.instant('PLATAFORMA.DELETE'),
      cancelButtonText: this.translate.instant('PLATAFORMA.CANCEL')
    }).then((result: any) => {
      if (result.isConfirmed) {
        this._usuariosService.eliminarUsuairo(id).subscribe({
          next: (resp: any) => {
            this._swalService.getAlertSuccess(this.translate.instant('USUARIOS.ELIMINAREXITOSA') + ', ' + resp.mensaje);
            this.registros = this.registros.filter((s) => s.usuarioId !== id);
          },
          error: (err: any) => {
            this._swalService.getAlertError(this.translate.instant('USUARIOS.ELIMINARERROR') + ', ' + err);
            console.error('Error eliminando', err);
          }
        });
      }
    });
  }

  onFiltroIdentificacionChangeClick(evento: any) {
    const value = evento.target.value;
    this.filtroIdentificacionSubject.next(value);
  }

  onFiltroNombreChangeClick(evento: any) {
    const value = evento.target.value;
    this.filtroNombreSubject.next(value);
  }

  onFiltroCorreoChangeClick(evento: any) {
    const value = evento.target.value;
    this.filtroCorreoSubject.next(value);
  }

  onFiltroUsernameChangeClick(evento: any) {
    const value = evento.target.value;
    this.filtroUsernameSubject.next(value);
  }

  onFiltroDescripcionChangeClick(evento: any) {
    const value = evento.target.value;
    this.filtroDescripcionSubject.next(value);
  }

  onFiltroEstadoChangeClick(evento: any) {
    const value = evento.target.value;
    this.filtroEstadoSubject.next(value);
  }

  toggleNav(): void {
    this.toggleSidebar.emit();
  }
}
