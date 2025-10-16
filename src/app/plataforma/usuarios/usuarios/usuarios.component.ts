/* eslint-disable @angular-eslint/use-lifecycle-interface */
/* eslint-disable @typescript-eslint/no-explicit-any */
//#region IMPORTS
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTablesModule } from 'angular-datatables';
import { Router } from '@angular/router';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { TranslateService } from '@ngx-translate/core';
import { PTLUsuarioModel } from 'src/app/theme/shared/_helpers/models/PTLUsuario.model';
import { PTLUsuariosService } from 'src/app/theme/shared/service/ptlusuarios.service';
import { LanguageService } from 'src/app/theme/shared/service/lenguage.service';
import { catchError, Observable, tap } from 'rxjs';
import { NavBarComponent } from 'src/app/theme/layout/admin/nav-bar/nav-bar.component';
import { NavContentComponent } from 'src/app/theme/layout/admin/navigation/nav-content/nav-content.component';
import { NavigationItem } from 'src/app/theme/layout/admin/navigation/navigation';
import { NavigationService } from 'src/app/theme/shared/service/navigation.service';
import { DatatableComponent } from 'src/app/theme/shared/components/data-table/data-table.component';
import { of, Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { SwalAlertService } from '../../../theme/shared/service/swal-alert.service';
import { ColumnMetadata } from 'src/app/theme/shared/_helpers/models/ColumnMetadata.model';
import { environment } from 'src/environments/environment';

const base_url = environment.apiUrl;
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
  registrosSub?: Subscription;
  activeTab: 'menu' | 'filters' | 'main' = 'menu';
  menuItems!: Observable<NavigationItem[]>;
  registros: PTLUsuarioModel[] = [];
  registrosFiltrado: PTLUsuarioModel[] = [];
  lang: string = localStorage.getItem('lang') || '';
  tituloPagina: string = '';
  //#endregion VARIABLES

  constructor(
    private router: Router,
    private translate: TranslateService,
    private _navigationService: NavigationService,
    private _swalService: SwalAlertService,
    private _usuariosService: PTLUsuariosService,
    private _languageService: LanguageService
  ) {}

  ngOnInit() {
    this._navigationService.getNavigationItems();
    this.menuItems = this._navigationService.menuItems$;
    console.log('elementos menu componente', this.menuItems);
    this.consultarRegistros();
  }

  ngOnDestroy(): void {
    console.log('entrando a componente usuarios');
  }

  consultarRegistros() {
    this.registrosSub = this._usuariosService
      .getUsuarios()
      .pipe(
        tap((resp: any) => {
          if (resp.ok) {
            resp.usuarios.forEach((user: any) => {
              user.nomEstado = user.estadoUsuario == true ? 'Activo' : 'Inactivo';
              user.fotoUsuario = `${base_url}/upload/usuarios/${user.fotoUsuario}`;
            });
            this.registros = resp.usuarios;
            this.registrosFiltrado = resp.usuarios;
            console.log('Todos las usuarios', this.registros);
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

// export interface ColumnMetadata {
//   name: string;
//   header: string;
//   type: 'number' | 'text' | 'date' | 'avatar' | 'image' | 'unknown';
//   isSortable?: boolean;
// }
