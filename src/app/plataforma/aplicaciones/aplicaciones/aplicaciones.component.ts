// //#region IMPORTS
// import { AfterViewInit, Component, NgZone, OnInit, ViewChild, TemplateRef } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { DataTableDirective, DataTablesModule } from 'angular-datatables';
// import { Router } from '@angular/router';
// import { SharedModule } from 'src/app/theme/shared/shared.module';
// import { TranslateModule } from '@ngx-translate/core';
// import { TranslateService } from '@ngx-translate/core';
// import { BreadcrumbComponent } from '../../../theme/shared/components/breadcrumb/breadcrumb.component';
// import { PTLAplicacionModel } from 'src/app/theme/shared/_helpers/models/PTLAplicacion.model';
// import { PtlAplicacionesService } from 'src/app/theme/shared/service/ptlaplicaciones.service';
// import { Location, LocationStrategy } from '@angular/common';

// import { GradientConfig } from 'src/app/app-config';
// import { catchError, Subject, tap } from 'rxjs';
// import { of, Subscription } from 'rxjs';
// import Swal from 'sweetalert2';
// import { NavigationItem } from 'src/app/theme/layout/admin/navigation/navigation';
// import { NavigationService } from 'src/app/theme/shared/service/navigation.service';
// import { LayoutInitializerService } from 'src/app/theme/shared/service/layout-initializer.service';
// import { LayoutComponent } from 'src/app/theme/shared/components/layout/layout.component';
// //#endregion IMPORTS

// @Component({
//   selector: 'app-aplicaciones',
//   standalone: true,
//   imports: [CommonModule, DataTablesModule, SharedModule, BreadcrumbComponent, TranslateModule, LayoutComponent],
//   templateUrl: './aplicaciones.component.html',
//   styleUrl: './aplicaciones.component.scss'
// })
// export class AplicacionesComponent implements OnInit, AfterViewInit {
//   @ViewChild('filtrosTemplate') filtrosTemplateRef!: TemplateRef<any>;
//   @ViewChild(DataTableDirective, { static: false }) datatableElement!: DataTableDirective;
//   filtroPersonalizado: string = 'Usuario';
//   activeTab: 'menu' | 'filters' = 'menu';
//   menuItems: NavigationItem[] = [];
//   showConfig = false;
//   //#region VARIABLES
//   gradientConfig: any;
//   navCollapsed: boolean = false;
//   navCollapsedMob: boolean = false;
//   windowWidth: number = 0;

//   [x: string]: any;
//   registrosSub?: Subscription;
//   dtColumnSearchingOptions: DataTables.Settings = {};
// dtTrigger: Subject<any> = new Subject<any>();

//   aplicaciones: PTLAplicacionModel[] = [];
//   tituloPagina: string = '';
//   //#endregion VARIABLES

//   constructor(
//     private router: Router,
//     private zone: NgZone,
//     private location: Location,
//     private layoutInitializer: LayoutInitializerService,
//     private navigationService: NavigationService,
//     private locationStrategy: LocationStrategy,
//     private aplicacionesService: PtlAplicacionesService,
//     private translate: TranslateService,
//     private BreadCrumb: BreadcrumbComponent
//   ) {
//     this.gradientConfig = GradientConfig;
//     let current_url = this.location.path();
//     const baseHref = this.locationStrategy.getBaseHref();
//     // if (baseHref) {
//     //   current_url = baseHref + this.location.path();
//     // }
//     // this.windowWidth = window.innerWidth;
//     // if (
//     //   current_url === baseHref + '/layout/collapse-menu' ||
//     //   current_url === baseHref + '/layout/box' ||
//     //   (this.windowWidth >= 992 && this.windowWidth <= 1024)
//     // ) {
//     //   GradientConfig.isCollapse_menu = true;
//     // }
//     this.navCollapsed = this.windowWidth >= 992 ? GradientConfig.isCollapse_menu : false;
//     this.navCollapsedMob = false;
//   }

//   ngAfterViewInit(): void {
//     this.BreadCrumb.setBreadcrumb();
//     this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
//       dtInstance.columns().every(function () {
//         const that = this;
//         $('input', this.header()).on('keyup change', function () {
//           const valor = $(this).val() as string;
//           if (that.search() !== valor) {
//             that.search(valor).draw();
//           }
//         });
//       });
//     });
//   }

//   ngOnInit() {
//     // this.layoutInitializer.setFiltersTemplate(this.filtrosTemplateRef);
//     // this.layoutInitializer.applyLayout();

//     const appCode = localStorage.getItem('aplicacionId') || 'plataforma';
//     this.menuItems = this.navigationService.getNavigationItems(appCode);
//     if (this.windowWidth < 992) {
//       GradientConfig.layout = 'vertical';
//       setTimeout(() => {
//         document.querySelector('.pcoded-navbar')?.classList.add('menupos-static');
//         (document.querySelector('#nav-ps-gradient-able') as HTMLElement).style.maxHeight = '100%'; // 100%
//       }, 500);
//     }
//     this.BreadCrumb.setBreadcrumb();
//     // Forzamos que ngx-translate lo aplique
//     this.translate
//       .get(['APLICACIONES.CODE', 'APLICACIONES.NAME', 'APLICACIONES.DESCRIPTION', 'APLICACIONES.STATUS', 'PLATAFORMA.OPTIONS'])
//       .subscribe((translations) => {
//         this.tituloPagina = translations['APLICACIONES.TITLE'];
//         this.dtColumnSearchingOptions = {
//           responsive: true,
//           columns: [
//             { title: translations['APLICACIONES.CODE'], data: 'codigoAplicacion' },
//             { title: translations['APLICACIONES.NAME'], data: 'nombreAplicacion' },
//             { title: translations['APLICACIONES.DESCRIPTION'], data: 'descripcionAplicacion' },
//             { title: translations['APLICACIONES.STATUS'], data: 'estadoAplicacion' },
//             { title: translations['PLATAFORMA.OPTIONS'], data: 'opciones' }
//           ]
//         };
//         this.consultarAplicaciones();
//         // });
//       });
//   }

//   ngOnDestroy(): void {
//     this.dtTrigger.unsubscribe();
//   }

//   consultarAplicaciones() {
//     this.registrosSub = this.aplicacionesService
//       .getAplicaciones()
//       .pipe(
//         tap((resp: any) => {
//           if (resp.ok) {
//             resp.aplicaciones.forEach((app: any) => {
//               app.nomEstado = app.estadoAplicacion == true ? 'Activa' : 'Inactiva';
//             });
//             this.aplicaciones = resp.aplicaciones;
//             console.log('Todos las aplicaciones', this.aplicaciones);
//             this.dtTrigger.next(null); // <--- Dispara la actualización de la tabla
//             return;
//           }
//         }),
//         catchError((err) => {
//           return of(null);
//         })
//       )
//       .subscribe();
//   }

//   filtrarColumna(columna: number, valor: string) {
//     this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
//       dtInstance.column(columna).search(valor).draw();
//     });
//   }

//   getEstado(estado: boolean): string {
//     return estado ? 'Activo' : 'Inactivo';
//   }

//   OnNuevaAplicaicionClick() {
//     this.router.navigate(['aplicaciones/gestion-aplicacion']);
//   }

//   OnEditarAplicaicionClick(id: number) {
//     this.router.navigate(['aplicaciones/gestion-aplicacion'], { queryParams: { aplicacionId: id } });
//   }

//   OnEliminarAplicaicionClick(id: number, nombre: string) {
//     Swal.fire({
//       title: this.translate.instant('APLICACIONES.ELIMINARTITULO'),
//       text: this.translate.instant('APLICACIONES.ELIMINARTEXTO') + `"${nombre}".!`,
//       icon: 'warning',
//       showCancelButton: true,
//       confirmButtonText: this.translate.instant('PLATAFORMA.DELETE'),
//       cancelButtonText: this.translate.instant('PLATAFORMA.CANCEL')
//     }).then((result: any) => {
//       if (result.isConfirmed) {
//         this.aplicacionesService.eliminarAplicacion(id).subscribe({
//           next: (resp: any) => {
//             Swal.fire(this.translate.instant('APLICACIONES.ELIMINAREXITOSA'), resp.mensaje, 'success');
//             this.aplicaciones = this.aplicaciones.filter((s) => s.aplicacionId !== id);
//           },
//           error: (err: any) => {
//             Swal.fire('Error', this.translate.instant('APLICACIONES.ELIMINARERROR'), 'error');
//             console.error('Error eliminando', err);
//           }
//         });
//       }
//     });
//   }

//   navMobClick() {
//     if (this.windowWidth < 992) {
//       if (this.navCollapsedMob && !document.querySelector('app-navigation.pcoded-navbar')?.classList.contains('mob-open')) {
//         this.navCollapsedMob = !this.navCollapsedMob;
//         setTimeout(() => {
//           this.navCollapsedMob = !this.navCollapsedMob;
//         }, 100);
//       } else {
//         this.navCollapsedMob = !this.navCollapsedMob;
//       }
//     }
//   }

//   onNavCollapse() {}
//   onNavCollapsedMob() {}

//   toggleTheme() {
//     document.body.classList.toggle('dark-theme');
//   }
// }

import { AfterViewInit, Component, EventEmitter, NgZone, OnInit, Output, ViewChild } from '@angular/core';
import { CommonModule, Location, LocationStrategy } from '@angular/common';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subject, Subscription, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { SharedModule } from 'src/app/theme/shared/shared.module';
import { BreadcrumbComponent } from 'src/app/theme/shared/components/breadcrumb/breadcrumb.component';
import { PtlAplicacionesService } from 'src/app/theme/shared/service/ptlaplicaciones.service';
import { NavigationService } from 'src/app/theme/shared/service/navigation.service';

import { PTLAplicacionModel } from 'src/app/theme/shared/_helpers/models/PTLAplicacion.model';
import { GradientConfig } from 'src/app/app-config';
import { NavigationItem } from 'src/app/theme/layout/admin/navigation/navigation';
import Swal from 'sweetalert2';
import { NavContentComponent } from 'src/app/theme/layout/admin/navigation/nav-content/nav-content.component';
import { NavBarComponent } from '../../../theme/layout/admin/nav-bar/nav-bar.component';

@Component({
  selector: 'app-aplicaciones',
  standalone: true,
  imports: [CommonModule, DataTablesModule, SharedModule, TranslateModule, NavBarComponent, NavContentComponent],
  templateUrl: './aplicaciones.component.html',
  styleUrl: './aplicaciones.component.scss'
})
export class AplicacionesComponent implements OnInit, AfterViewInit {
  @ViewChild(DataTableDirective, { static: false })
  datatableElement!: DataTableDirective;
  @Output() toggleSidebar = new EventEmitter<void>();

  aplicaciones: PTLAplicacionModel[] = [];
  aplicacionesFiltrado: PTLAplicacionModel[] = [];
  dtTrigger: Subject<any> = new Subject<any>();
  dtColumnSearchingOptions: DataTables.Settings = {};
  activeTab: 'menu' | 'filters' | 'main' = 'menu';

  menuItems: NavigationItem[] = [];
  filtroPersonalizado: string = '';
  tituloPagina: string = '';
  hasFiltersSlot: boolean = false;
  registrosSub?: Subscription;
  gradientConfig;

  constructor(
    private router: Router,
    private navigationService: NavigationService,
    private aplicacionesService: PtlAplicacionesService,
    private translate: TranslateService
  ) {
    this.gradientConfig = GradientConfig;
  }

  ngAfterViewInit(): void {
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

  ngOnInit(): void {
    const appCode = localStorage.getItem('aplicacionId') || 'plataforma';
    this.menuItems = this.navigationService.getNavigationItems(appCode);
    console.log('elementos menu componente', this.menuItems);
    this.hasFiltersSlot = true;
    this.translate
      .get([
        'APLICACIONES.CODE',
        'APLICACIONES.NAME',
        'APLICACIONES.DESCRIPTION',
        'APLICACIONES.STATUS',
        'PLATAFORMA.OPTIONS',
        'APLICACIONES.TITLE'
      ])
      .subscribe((translations) => {
        this.tituloPagina = translations['APLICACIONES.TITLE'];
        this.dtColumnSearchingOptions = {
          responsive: true,
          columns: [
            { title: translations['APLICACIONES.CODE'], data: 'codigoAplicacion' },
            { title: translations['APLICACIONES.NAME'], data: 'nombreAplicacion' },
            { title: translations['APLICACIONES.DESCRIPTION'], data: 'descripcionAplicacion' },
            { title: translations['APLICACIONES.STATUS'], data: 'estadoAplicacion' },
            { title: translations['PLATAFORMA.OPTIONS'], data: 'opciones' }
          ]
        };

        this.consultarAplicaciones();
      });
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  consultarAplicaciones(): void {
    this.registrosSub = this.aplicacionesService
      .getAplicaciones()
      .pipe(
        tap((resp: any) => {
          if (resp.ok) {
            resp.aplicaciones.forEach((app: any) => {
              app.nomEstado = app.estadoAplicacion ? 'Activa' : 'Inactiva';
            });
            this.aplicaciones = resp.aplicaciones;
            this.aplicacionesFiltrado = resp.aplicaciones;
            this.dtTrigger.next(null);
          }
        }),
        catchError((err) => {
          console.error('Error en consulta', err);
          return of(null);
        })
      )
      .subscribe();
  }

  filtrarColumna(columna: number, valor: string): void {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.column(columna).search(valor).draw();
    });
  }

  onFiltroCodigoChangeClick(evento: any) {
    console.log('filtrar el codigo ', evento.target.value);
    if (evento.target.value == 'todos') {
      this.aplicacionesFiltrado = this.aplicaciones;
    } else {
      this.aplicacionesFiltrado = this.aplicacionesFiltrado.filter((x) => (x.codigoAplicacion = evento.target.value));
    }
  }

  onFiltroNombreChangeClick(evento: any) {
    console.log('filtrar el nombre ', evento.target.value);
    if (evento.target.value == 'todos') {
      this.aplicacionesFiltrado = this.aplicaciones;
    } else {
      this.aplicacionesFiltrado = this.aplicacionesFiltrado.filter((x) => (x.nombreAplicacion = evento.target.value));
    }
  }

  onFiltroDescripcionChangeClick(evento: any) {
    console.log('filtrar el descripcion ', evento.target.value);
    const textoFiltro = evento.target.value.toLowerCase();
    if (!textoFiltro) {
      this.aplicacionesFiltrado = [... this.aplicaciones];
    } else {
      this.aplicacionesFiltrado = this.aplicacionesFiltrado.filter((app) => (app.descripcionAplicacion || '').toLowerCase().includes(textoFiltro));
    }
  }

  onFiltroEstadoChangeClick(evento: any) {
    console.log('filtrar el estado ', evento.target.value);
    // const estado: boolean = evento.target.value || true;
    if (evento.target.value == 'todos') {
      this.aplicacionesFiltrado = this.aplicaciones;
    } else {
        const estado = evento.target.value == "true" ? true : false;
        console.log('Aplicaciones', this.aplicacionesFiltrado);
      this.aplicacionesFiltrado = this.aplicacionesFiltrado.filter((x) => (x.estadoAplicacion = estado));
    }
  }

  getEstado(estado: boolean): string {
    return estado ? 'Activo' : 'Inactivo';
  }

  OnNuevaAplicaicionClick(): void {
    this.router.navigate(['aplicaciones/gestion-aplicacion']);
  }

  OnEditarAplicaicionClick(id: number): void {
    this.router.navigate(['aplicaciones/gestion-aplicacion'], { queryParams: { aplicacionId: id } });
  }

  OnEliminarAplicaicionClick(id: number, nombre: string): void {
    Swal.fire({
      title: this.translate.instant('APLICACIONES.ELIMINARTITULO'),
      text: this.translate.instant('APLICACIONES.ELIMINARTEXTO') + `"${nombre}".`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: this.translate.instant('PLATAFORMA.DELETE'),
      cancelButtonText: this.translate.instant('PLATAFORMA.CANCEL')
    }).then((result) => {
      if (result.isConfirmed) {
        this.aplicacionesService.eliminarAplicacion(id).subscribe({
          next: (resp: any) => {
            Swal.fire(this.translate.instant('APLICACIONES.ELIMINAREXITOSA'), resp.mensaje, 'success');
            this.aplicaciones = this.aplicaciones.filter((a) => a.aplicacionId !== id);
          },
          error: () => {
            Swal.fire('Error', this.translate.instant('APLICACIONES.ELIMINARERROR'), 'error');
          }
        });
      }
    });
  }

  toggleNav(): void {
    this.toggleSidebar.emit();
  }
}
