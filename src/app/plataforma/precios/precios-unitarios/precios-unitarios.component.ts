/* eslint-disable @angular-eslint/use-lifecycle-interface */
/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DataTablesModule } from 'angular-datatables';
import { Router } from '@angular/router';
import { catchError, of, Subscription, tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { GradientConfig } from 'src/app/app-config';
import { NavigationItem } from 'src/app/theme/layout/admin/navigation/navigation';
import { NavigationService } from 'src/app/theme/shared/service/navigation.service';
import { NavBarComponent } from 'src/app/theme/layout/admin/nav-bar/nav-bar.component';
import { NavContentComponent } from 'src/app/theme/layout/admin/navigation/nav-content/nav-content.component';
import { DatatableComponent } from 'src/app/theme/shared/components/data-table/data-table.component';
import { PtlvaloresUnitariosService } from 'src/app/theme/shared/service/ptlvalores-unitarios.service';
import { PTLValoresUnitarios } from 'src/app/theme/shared/_helpers/models/PTLValoresUnitarios.model';
import Swal from 'sweetalert2';
import { PtltiposValoresService } from 'src/app/theme/shared/service/ptltipos-valores.service';
import { PTLTiposValoresModel } from '../../../theme/shared/_helpers/models/PTLTiposValores.model';

@Component({
  selector: 'app-precios-unitarios',
  standalone: true,
  imports: [CommonModule, DataTablesModule, SharedModule, TranslateModule, NavBarComponent, NavContentComponent, DatatableComponent],
  templateUrl: './precios-unitarios.component.html',
  styleUrl: './precios-unitarios.component.scss'
})
export class PreciosUnitariosComponent implements OnInit {
  @Output() toggleSidebar = new EventEmitter<void>();
  //#region VARIABLES
  registrosSub?: Subscription;
  tiposValorSub?: Subscription;
  registros: PTLValoresUnitarios[] = [];
  tiposValor: PTLTiposValoresModel[] = [];
  registrosFiltrado: PTLValoresUnitarios[] = [];
  lang: string = localStorage.getItem('lang') || '';
  tituloPagina: string = '';
  gradientConfig;
  hasFiltersSlot: boolean = false;
  menuItems: NavigationItem[] = [];
  activeTab: 'menu' | 'filters' | 'main' = 'menu';
  //#endregion VARIABLES

  constructor(
    private router: Router,
    private translate: TranslateService,
    private _registrosService: PtlvaloresUnitariosService,
    private _tiposValorService: PtltiposValoresService,
    private _navigationService: NavigationService
  ) {
    this.gradientConfig = GradientConfig;
  }

  ngOnInit() {
    this.menuItems = this._navigationService.getNavigationItems();
    this.hasFiltersSlot = true;
    this.consultarTiposValor();
    this.consultarRegistros();
    console.log('elementos menu componente', this.menuItems);
  }

  consultarTiposValor() {
    this.tiposValorSub = this._tiposValorService
      .getRegistros()
      .pipe(
        tap((resp: any) => {
          if (resp.ok) {
            this.tiposValor = resp.tiposValor;
          }
        }),
        catchError((err) => {
          console.error(err);
          return of([]);
        })
      )
      .subscribe();
  }

  consultarRegistros() {
    this.registrosSub = this._registrosService
      .getRegistros()
      .pipe(
        tap((resp: any) => {
          if (resp.ok) {
            resp.valoresUnitarios.forEach((reg: any) => {
              reg.nomEstado = reg.estadoValor == true ? 'Activa' : 'Inactiva';
            });
            this.registros = resp.valoresUnitarios;
            this.registrosFiltrado = resp.valoresUnitarios;
            console.log('Todos los sitios', this.registrosFiltrado);
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

  OnNuevoRegistroClick() {
    this.router.navigate(['/precios/gestion-precio']);
  }

  OnEditarRegistroClick(id: number) {
    this.router.navigate(['/precios/gestion-precio'], { queryParams: { regId: id } });
  }

  OnEliminarRegistroClick(id: any) {
    Swal.fire({
      title: this.translate.instant('PRECIOS.ELIMINARTITULO'),
      text: this.translate.instant('PRECIOS.ELIMINARTEXTO'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: this.translate.instant('PLATAFORMA.DELETE'),
      cancelButtonText: this.translate.instant('PLATAFORMA.CANCEL')
    }).then((result) => {
      console.log('Eliminado', id);
      if (result.isConfirmed) {
        this._registrosService.deleteEliminarRegistro(id.id).subscribe({
          next: (resp: any) => {
            Swal.fire(this.translate.instant('PRECIOS.ELIMINAREXITOSA'), resp.mensaje, 'success');
            this.consultarRegistros();
          },
          error: (err: any) => {
            Swal.fire('Error', this.translate.instant('PRECIOS.ELIMINARERROR'), 'error');
            console.error('Error eliminando', err);
          }
        });
      }
    });
  }

  onFiltroTipoValorChangeClick(evento: any) {
    console.log('filtrar el codigo ', evento.target.value);
    if (evento.target.value == 'todos') {
      this.registrosFiltrado = this.registros;
    } else {
      this.registrosFiltrado = this.registrosFiltrado.filter((x) => (x.tipoValorId = evento.target.value));
      this.consultarRegistros();
    }
  }

  onFiltroNombreChangeClick(evento: any) {
    console.log('filtrar el NOMBRE ', evento.target.value);
    const textoFiltro = evento.target.value.toLowerCase();
    if (!textoFiltro) {
      this.registrosFiltrado = [...this.registros];
    } else {
      this.registrosFiltrado = this.registrosFiltrado.filter((sitio) => (sitio.nombreValor || '').toLowerCase().includes(textoFiltro));
      console.log('filtrados', this.registrosFiltrado);
    }
  }

  onFiltroDescripcionChangeClick(evento: any) {
    console.log('filtrar el descripcion ', evento.target.value);
    const textoFiltro = evento.target.value.toLowerCase();
    if (!textoFiltro) {
      this.registrosFiltrado = [...this.registros];
    } else {
      this.registrosFiltrado = this.registrosFiltrado.filter((app) => (app.descripcionValor || '').toLowerCase().includes(textoFiltro));
      console.log('filtrados', this.registrosFiltrado);
    }
  }

  onFiltroEstadoChangeClick(evento: any) {
    console.log('filtrar el estado ', evento.target.value);
    if (evento.target.value == 'todos') {
      this.registrosFiltrado = this.registros;
    } else {
      const estado = evento.target.value == 'true' ? true : false;
      this.registrosFiltrado = this.registros.filter((x) => x.estadoValor == estado);
    }
  }

  toggleNav(): void {
    this.toggleSidebar.emit();
  }
}
