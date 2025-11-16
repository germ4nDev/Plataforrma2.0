/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DataTablesModule } from 'angular-datatables';
import { Subscription, catchError, of, Observable, BehaviorSubject, switchMap, startWith, combineLatest, map } from 'rxjs';
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
import { UploadFilesService } from 'src/app/theme/shared/service';

@Component({
  selector: 'app-suscriptores',
  standalone: true,
  imports: [CommonModule, DataTablesModule, SharedModule, TranslateModule, NavBarComponent, NavContentComponent, DatatableComponent],
  templateUrl: './suscriptores.component.html',
  styleUrl: './suscriptores.component.scss'
})
export class SuscriptoresComponent implements OnInit, OnDestroy {
  @Output() toggleSidebar = new EventEmitter<void>();
  //#region VARIABLES
  subscriptions = new Subscription();
//   filtroCodigoSubject = new BehaviorSubject<string>('todos');
  filtroNombreSubject = new BehaviorSubject<string>('');
  filtroIdentificacionSubject = new BehaviorSubject<string>('');
  filtroEstadoSubject = new BehaviorSubject<string>('todos');

  registrosTransformadas$: Observable<PTLSuscriptorModel[]> = of([]);
  registrosFiltrados$: Observable<PTLSuscriptorModel[]> = of([]);
  registros: PTLSuscriptorModel[] = [];

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
    private _navigationService: NavigationService,
    private _uploadService: UploadFilesService
  ) {
    this.gradientConfig = GradientConfig;
  }

  ngOnInit() {
    this._navigationService.getNavigationItems();
    this.menuItems = this._navigationService.menuItems$;
    this.hasFiltersSlot = true;
    this.setupRegistrosStream();
    this.subscriptions.add(
      this._suscriptoresService.getRegistros().subscribe(
        () => console.log('Aplicaciones cargadas y guardadas en el servicio'),
        (err) => console.error('Error al cargar aplicaciones:', err)
      )
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  setupRegistrosStream(): void {
    this.registrosTransformadas$ = this._suscriptoresService.suscriptores$.pipe(
      switchMap((regs: PTLSuscriptorModel[]) => {
        if (!regs) return of([]);
        const transformedRegs = regs.map((reg: any) => {
          reg.nomEstado = reg.estadoAplicacion ? 'Activo' : 'Inactivo';
          reg.logoSuscriptor = this._uploadService.getFilePath('plataforma', 'suscriptores', reg.logoSuscriptor);
          return reg as PTLSuscriptorModel;
        });
        this.registros = transformedRegs;
        console.log('registros', this.registros);
        return of(transformedRegs);
      }),
      catchError((err) => {
        console.error('Error en el stream de aplicaciones:', err);
        return of([]);
      })
    );
    this.registrosFiltrados$ = combineLatest([
      this.registrosTransformadas$.pipe(startWith([])),
    //   this.filtroCodigoSubject,
      this.filtroNombreSubject,
      this.filtroIdentificacionSubject,
      this.filtroEstadoSubject
    ]).pipe(
      map(([regs, nombre, identificacion, estado]) => {
        let filteredRegs = regs;
        console.log('quien putas es estado', estado);
        // if (codigo !== 'todos') {
        //   filteredRegs = filteredRegs.filter((app) => app.codigoAplicacion === codigo);
        // }
        if (nombre) {
          const textoFiltro = nombre.toLowerCase();
          filteredRegs = filteredRegs.filter((reg) => (reg.nombreSuscriptor || '').toLowerCase().includes(textoFiltro));
        }
        if (identificacion) {
          filteredRegs = filteredRegs.filter((reg) => (reg.identificacionSuscriptor || '').toLowerCase().includes(identificacion));
        }
        if (estado !== 'todos') {
          const estadoBoolean = estado === 'true';
          filteredRegs = filteredRegs.filter(app => app.estadoSuscriptor === estadoBoolean);
        }
        console.log('filtrado2s', filteredRegs);
        return filteredRegs;
      })
    );
  }

  onFiltroNombreChangeClick(evento: any) {
    console.log('filtrar el NOMBRE ', evento.target.value);
    this.filtroNombreSubject.next(evento.target.value);
  }

  onFiltroIdentificacionChangeClick(evento: any) {
    console.log('filtrar el descripcion ', evento.target.value);
    this.filtroIdentificacionSubject.next(evento.target.value);
  }

  onFiltroEstadoChangeClick(evento: any) {
    console.log('filtrar el estado ', evento.target.value);
    this.filtroEstadoSubject.next(evento.target.value);
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
      type: 'estado'
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

  toggleNav(): void {
    this.toggleSidebar.emit();
  }
}
