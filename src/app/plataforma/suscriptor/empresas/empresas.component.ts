/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DataTablesModule } from 'angular-datatables';
import { Subscription, tap, catchError, of, Observable } from 'rxjs';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { DatatableComponent } from 'src/app/theme/shared/components/data-table/data-table.component';
import { NavContentComponent } from 'src/app/theme/layout/admin/navigation/nav-content/nav-content.component';
import { NavBarComponent } from 'src/app/theme/layout/admin/nav-bar/nav-bar.component';
import { GradientConfig } from 'src/app/app-config';
import { ColumnMetadata } from 'src/app/theme/shared/_helpers/models/ColumnMetadata.model';
import { PTLUsuarioModel } from 'src/app/theme/shared/_helpers/models/PTLUsuario.model';
import {
  NavigationService,
  PtllogActividadesService,
  SwalAlertService,
  LocalStorageService,
  PTLSuscriptoresService,
  PtlEmpresasScService
} from 'src/app/theme/shared/service';
import { environment } from 'src/environments/environment';

const base_url = environment.apiUrl;
import Swal from 'sweetalert2';
import { NavigationItem } from 'src/app/theme/shared/_helpers/models/Navigation.model';
import { PTLEmpresaSCModel } from 'src/app/theme/shared/_helpers/models/PTLEmpresaSC.model';
import { PTLSuscriptorModel } from '../../../theme/shared/_helpers/models/PTLSuscriptor.model';

@Component({
  selector: 'app-empresas',
  standalone: true,
  imports: [CommonModule, DataTablesModule, SharedModule, TranslateModule, DatatableComponent, NavContentComponent, NavBarComponent],
  templateUrl: './empresas.component.html',
  styleUrl: './empresas.component.scss'
})
export class EmpresasComponent implements OnInit {
  @Output() toggleSidebar = new EventEmitter<void>();

  //#region VARIABLES
  registros: PTLEmpresaSCModel[] = [];
  registrosFiltrado: PTLEmpresaSCModel[] = [];
  lang: string = localStorage.getItem('lang') || '';
  registrosSub?: Subscription;
  usuariosSub?: Subscription;
  suscriptoresSub?: Subscription;
  suscriptores: PTLSuscriptorModel[] = [];
  usuarios: PTLUsuarioModel[] = [];
  tituloPagina: string = '';
  //#endregion VARIABLES
  gradientConfig;
  hasFiltersSlot: boolean = false;
  menuItems!: Observable<NavigationItem[]>;
  activeTab: 'menu' | 'filters' | 'main' = 'menu';
  suscPlataforma: string = '';

  colorOpcion1 = '#6f42c1';
  letraOpcion1 = 'R';

  constructor(
    private router: Router,
    private translate: TranslateService,
    private _navigationService: NavigationService,
    private _swalService: SwalAlertService,
    private _logActividadesService: PtllogActividadesService,
    private _empresasScService: PtlEmpresasScService,
    private _suscriptoresService: PTLSuscriptoresService,
    private _localStorageService: LocalStorageService
  ) {
    this.gradientConfig = GradientConfig;
    this.suscPlataforma = this._localStorageService.getSuscriptorPlataformaLocalStorage();
  }

  ngOnInit() {
    this._navigationService.getNavigationItems();
    this.menuItems = this._navigationService.menuItems$;
    this.hasFiltersSlot = true;
    this.consultarSusucriptores();
    // setTimeout(() => {
      this.consultarRegistros();
    // }, 500);
  }

  consultarSusucriptores() {
    this.suscriptoresSub = this._suscriptoresService
      .getSuscriptores()
      .pipe(
        tap((resp: any) => {
          if (resp.ok) {
            this.suscriptores = resp.suscriptores;
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

  columnasRegistros: ColumnMetadata[] = [
    {
      name: 'nombreEmpresa',
      header: 'SUSCRIPTOR.EMPRESAS.NOMBREEMPRESA',
      type: 'date'
    },
    {
      name: 'descripcionEmpresa',
      header: 'SUSCRIPTOR.EMPRESAS.DESCRIPCION',
      type: 'text'
    },
    {
      name: 'nomEstado',
      header: 'SUSCRIPTOR.EMPRESAS.ESTADOEMPRESA',
      type: 'estado'
    }
  ];

  columnasDetailRegistros: ColumnMetadata[] = [
    {
      name: 'codigoSuscriptor',
      header: 'SUSCRIPTOR.EMPRESAS.CODIGOSUSCRIPTOR',
      type: 'text'
    },
    {
      name: 'codigoEmpresa',
      header: 'SUSCRIPTOR.EMPRESAS.CODIGOEMPRESA',
      type: 'text'
    }
  ];

  consultarRegistros() {
    this.registrosSub = this._empresasScService
      .getTodasEmpresaById()
      .pipe(
        tap((resp: any) => {
          if (resp.ok) {
            console.log('respuesta', resp);
            resp.empresasSC.forEach((empresa: any) => {
              empresa.nomEstado = empresa.estadoEmpresa = true ? 'Activa' : 'Inactiva';
            });
            this.registros = resp.empresasSC;
            this.registrosFiltrado = this.registros;
            console.log('Todos las empresas', this.registrosFiltrado);
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

  onFiltroSuscriptorChangeClick(evento: any) {
    if (evento.target.value == 'todos') {
      this.registrosFiltrado = this.registros;
    } else {
      this.registrosFiltrado = this.registrosFiltrado.filter((x) => x.codigoSuscriptor == evento.target.value);
    }
  }

  onFiltroNombreChangeClick(evento: any) {
    const textoFiltro = evento.target.value.toLowerCase();
    if (!textoFiltro) {
      this.registrosFiltrado = [...this.registros];
    } else {
      this.registrosFiltrado = this.registrosFiltrado.filter((ticket) => (ticket.nombreEmpresa || '').toLowerCase().includes(textoFiltro));
    }
  }

  onFiltroDescripcionChangeClick(evento: any) {
    const textoFiltro = evento.target.value.toLowerCase();
    if (!textoFiltro) {
      this.registrosFiltrado = [...this.registros];
    } else {
      this.registrosFiltrado = this.registrosFiltrado.filter((ticket) =>
        (ticket.descripcionEmpresa || '').toLowerCase().includes(textoFiltro)
      );
    }
  }

  onFiltroEstadoChangeClick(evento: any) {
    if (evento.target.value == 'todos') {
      this.registrosFiltrado = this.registros;
    } else {
      this.registrosFiltrado = this.registrosFiltrado.filter((x) => x.estadoEmpresa == evento.target.value);
    }
  }

  OnNuevoRegistroClick() {
    this.router.navigate(['suscriptor/gestion-empresa'], { queryParams: { regId: 'nuevo' } });
  }

  OnEditarRegistroClick(id: any) {
    this.router.navigate(['suscriptores/gestion-empresa'], { queryParams: { regId: id } });
  }

  OnEliminarRegistroClick(id: any) {
    Swal.fire({
      title: this.translate.instant('SUSCRIPTOR.EMPRESAS.ELIMINARTITULO'),
      text: this.translate.instant('SUSCRIPTOR.EMPRESAS.ELIMINARTEXTO'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: this.translate.instant('PLATAFORMA.DELETE'),
      cancelButtonText: this.translate.instant('PLATAFORMA.CANCEL')
    }).then((result: any) => {
      if (result.isConfirmed) {
        console.log('id', id.id);
        const empresa = this.registros.filter((x) => x.codigoEmpresaSC == id.id)[0];
        this._empresasScService.eliminarEmpresa(empresa.codigoEmpresaSC || '').subscribe({
          next: (resp: any) => {
            const logData = {
              codigoTipoLog: '',
              codigoRespuesta: '201',
              descripcionLog: this.translate.instant('SUSCRIPTOR.EMPRESAS.ELIMINAREXITOSA') + ' ' + resp.mensaje
            };
            this._logActividadesService.postCrearRegistro(logData).subscribe(() => console.log('log creado exitosamente'));
            this._swalService.getAlertSuccess(this.translate.instant('SUSCRIPTOR.EMPRESAS.ELIMINAREXITOSA') + ' ' + resp.mensaje);
            this.consultarRegistros();
          },
          error: (err: any) => {
            const logData = {
              codigoTipoLog: '',
              codigoRespuesta: '501',
              descripcionLog: this.translate.instant('SUSCRIPTOR.EMPRESAS.ELIMINARERROR') + ' ' + err.mensaje
            };
            this._logActividadesService.postCrearRegistro(logData).subscribe(() => console.log('log creado exitosamente'));
            this._swalService.getAlertError(this.translate.instant('SUSCRIPTOR.EMPRESAS.ELIMINARERROR') + ' ' + err.mensaje);
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
