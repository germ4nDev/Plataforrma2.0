/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DataTablesModule } from 'angular-datatables';
import { Subscription, tap, catchError, of, Observable } from 'rxjs';
import { PTLSuscriptorModel } from 'src/app/theme/shared/_helpers/models/PTLSuscriptor.model';
import { PTLSuscriptoresService } from 'src/app/theme/shared/service/ptlsuscriptores.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import Swal from 'sweetalert2';
import { DatatableComponent } from 'src/app/theme/shared/components/data-table/data-table.component';
import { NavBarComponent } from 'src/app/theme/layout/admin/nav-bar/nav-bar.component';
import { GradientConfig } from 'src/app/app-config';
import { NavigationService } from 'src/app/theme/shared/service/navigation.service';
import { NavContentComponent } from 'src/app/theme/layout/admin/navigation/nav-content/nav-content.component';
import { ColumnMetadata } from 'src/app/theme/shared/_helpers/models/ColumnMetadata.model';
import { NavigationItem } from 'src/app/theme/shared/_helpers/models/Navigation.model';

@Component({
  selector: 'app-suscriptores',
  standalone: true,
  imports: [CommonModule, DataTablesModule, SharedModule, TranslateModule, NavBarComponent, NavContentComponent, DatatableComponent],
  templateUrl: './suscriptores.component.html',
  styleUrl: './suscriptores.component.scss'
})
export class SuscriptoresComponent implements OnInit {
  @Output() toggleSidebar = new EventEmitter<void>();
  //#region VARIABLES
  registrosSub?: Subscription;
  registros: PTLSuscriptorModel[] = [];
  registrosFiltrado: PTLSuscriptorModel[] = [];
  lang: string = localStorage.getItem('lang') || '';
  tituloPagina: string = '';
  gradientConfig;
  hasFiltersSlot: boolean = false;
  menuItems!: Observable<NavigationItem[]>;
  activeTab: 'menu' | 'filters' | 'main' = 'menu';
  //#endregion VARIABLES

  constructor(
    private router: Router,
    private translate: TranslateService,
    private _suscriptoresService: PTLSuscriptoresService,
    private _navigationService: NavigationService
  ) {
    this.gradientConfig = GradientConfig;
  }

  ngOnInit() {
    this._navigationService.getNavigationItems();
    this.menuItems = this._navigationService.menuItems$;
    this.hasFiltersSlot = true;
    this.consultarRegistros();
  }

  consultarRegistros() {
    this.registrosSub = this._suscriptoresService
      .getSuscriptores()
      .pipe(
        tap((resp: any) => {
          if (resp.ok) {
            console.log('respuesta componente', resp);

            resp.suscriptores.forEach((regs: any) => {
              regs.nomEstado = regs.estadoSuscriptor == true ? 'Activo' : 'Inactivo';
            });
            this.registros = resp.suscriptores;
            this.registrosFiltrado = resp.suscriptores;
            console.log('Todos los Suscriptores', this.registros);
            return;
          }
        }),
        catchError((err) => {
          console.log('error', err);
          return of(null);
        })
      )
      .subscribe();
  }

  columnasRegistros: ColumnMetadata[] = [
    {
      name: 'logoSuscriptor',
      header: 'SUSCRIPTORES.CODE',
      type: 'image'
    },
    {
      name: 'nombreSuscriptor',
      header: 'SUSCRIPTORES.NAME',
      type: 'text'
    },
    {
      name: 'identificacionSuscriptor',
      header: 'SUSCRIPTORES.IDENTIFICATION',
      type: 'text'
    },
    {
      name: 'correoSuscriptor',
      header: 'SUSCRIPTORES.STATUS',
      type: 'text'
    },
    {
      name: 'nomEstado',
      header: 'SUSCRIPTORES.STATUS',
      type: 'text'
    }
  ];

  columnasDetailRegistros: ColumnMetadata[] = [
    {
      name: 'codigoSuscriptor',
      header: 'SUSCRIPTORES.CODE',
      type: 'text'
    },
    {
      name: 'direccionSuscriptor',
      header: 'SUSCRIPTORES.CODE',
      type: 'text'
    },
    {
      name: 'telefonoContacto',
      header: 'SUSCRIPTORES.CODE',
      type: 'text'
    },
    {
      name: 'numeroEmpresas',
      header: 'SUSCRIPTORES.CODE',
      type: 'text'
    },
    {
      name: 'numeroUsuarios',
      header: 'SUSCRIPTORES.CODE',
      type: 'text'
    },
    {
      name: 'usuarioAdministrador',
      header: 'SUSCRIPTORES.CODE',
      type: 'text'
    },
    {
      name: 'descripcionSuscriptor',
      header: 'SUSCRIPTORES.DESCRIPTION',
      type: 'text'
    }
  ];

  OnNuevoRegistroClick() {
    this.router.navigate(['/suscriptor/gestion-suscriptor'], { queryParams: { regId: 'nuevo' } });
  }

  OnEditarRegistroClick(id: number) {
    this.router.navigate(['/suscriptor/gestion-suscriptor'], { queryParams: { regId: id } });
  }

  OnEliminarRegistroClick(id: any) {
    Swal.fire({
      title: this.translate.instant('SUSCRIPTORES.ELIMINARTITULO'),
      text: this.translate.instant('SUSCRIPTORES.ELIMINARTEXTO'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: this.translate.instant('PLATAFORMA.DELETE'),
      cancelButtonText: this.translate.instant('PLATAFORMA.CANCEL')
    }).then((result: any) => {
      if (result.isConfirmed) {
        this._suscriptoresService.eliminarSuscripctor(id.id).subscribe({
          next: (resp: any) => {
            Swal.fire(this.translate.instant('SUSCRIPTORES.ELIMINAREXITOSA'), resp.mensaje, 'success');
            this.registros = this.registros.filter((s) => s.suscriptorId !== id.id);
          },
          error: (err: any) => {
            Swal.fire('Error', this.translate.instant('SUSCRIPTORES.ELIMINARERROR'), 'error');
            console.error('Error eliminando', err);
          }
        });
      }
    });
  }

  onFiltroNombreChangeClick(evento: any) {
    console.log('filtrar el NOMBRE ', evento.target.value);
    const textoFiltro = evento.target.value.toLowerCase();
    if (!textoFiltro) {
      this.registrosFiltrado = [...this.registros];
    } else {
      this.registrosFiltrado = this.registrosFiltrado.filter((suscriptor) =>
        (suscriptor.nombreSuscriptor || '').toLowerCase().includes(textoFiltro)
      );
      console.log('filtrados', this.registrosFiltrado);
    }
  }

  onFiltroIdentificacionChangeClick(evento: any) {
    console.log('filtrar el descripcion ', evento.target.value);
    const textoFiltro = evento.target.value.toLowerCase();
    if (!textoFiltro) {
      this.registrosFiltrado = [...this.registros];
    } else {
      this.registrosFiltrado = this.registrosFiltrado.filter((suscriptor) => suscriptor.identificacionSuscriptor || 0);
      console.log('filtrados', this.registrosFiltrado);
    }
  }

  onFiltroEstadoChangeClick(evento: any) {
    console.log('filtrar el estado ', evento.target.value);
    if (evento.target.value == 'todos') {
      this.registrosFiltrado = this.registros;
    } else {
      const estado = evento.target.value == 'true' ? true : false;
      this.registrosFiltrado = this.registros.filter((x) => x.estadoSuscriptor == estado);
    }
  }

  toggleNav(): void {
    this.toggleSidebar.emit();
  }
}
