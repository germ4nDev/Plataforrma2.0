import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DataTablesModule, DataTableDirective } from 'angular-datatables';
import { log } from 'console';
import { Subscription, Subject, tap, catchError, of } from 'rxjs';
import { GradientConfig } from 'src/app/app-config';
import { NavBarComponent } from 'src/app/theme/layout/admin/nav-bar/nav-bar.component';
import { NavContentComponent } from 'src/app/theme/layout/admin/navigation/nav-content/nav-content.component';
import { NavigationItem } from 'src/app/theme/layout/admin/navigation/navigation';
import { PTLRequerimientoTKModel } from 'src/app/theme/shared/_helpers/models/PTLRequerimientoTK.model';
import { BreadcrumbComponent } from 'src/app/theme/shared/components/breadcrumb/breadcrumb.component';
import { LanguageService } from 'src/app/theme/shared/service';
import { NavigationService } from 'src/app/theme/shared/service/navigation.service';
import { PTLRequerimientosTkService } from 'src/app/theme/shared/service/ptlrequerimientos-tk.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-requerimientos',
  standalone: true,
  imports: [CommonModule, DataTablesModule, SharedModule, TranslateModule, NavBarComponent, NavContentComponent],
  templateUrl: './requerimientos.component.html',
  styleUrl: './requerimientos.component.scss'
})
export class RequerimientosComponent implements OnInit, AfterViewInit {
  //#region VARIABLES
  [x: string]: any;
  @ViewChild(DataTableDirective, { static: false })
  @Output()
  toggleSidebar = new EventEmitter<void>();
  activeTab: 'menu' | 'filters' | 'main' = 'menu';

  datatableElement!: DataTableDirective;
  registrosSub?: Subscription;
  dtColumnSearchingOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  registros: PTLRequerimientoTKModel[] = [];
  lang: string = localStorage.getItem('lang') || '';
  tituloPagina: string = '';

  menuItems: NavigationItem[] = [];
  hasFiltersSlot: boolean = false;
  gradientConfig;
  //#endregion VARIABLES

  constructor(
    private router: Router,
    private translate: TranslateService,
    private requerimientosService: PTLRequerimientosTkService,
    private languageService: LanguageService,
    private BreadCrumb: BreadcrumbComponent,
    private navigationService: NavigationService
  ) {
    this.gradientConfig = GradientConfig;
  }

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
    this.hasFiltersSlot = true;
    this.translate
      .get([
        'TICKETS.REQUERIMIENTOS.NOMBREREQUERIMIENTO',
        'TICKETS.REQUERIMIENTOS.DESCRICIONREQUERIMIENTO',
        'TICKETS.REQUERIMIENTOS.ESTADOREQUERIMIENTO'
      ])
      .subscribe((translations) => {
        this.tituloPagina = translations['REQUERIMIENTOS.TITLE'];
        this.dtColumnSearchingOptions = {
          responsive: true,
          columns: [
            { title: translations['TICKETS.REQUERIMIENTOS.NOMBREREQUERIMIENTO'], data: 'nombreRequerimiento' },
            { title: translations['TICKETS.REQUERIMIENTOS.DESCRICIONREQUERIMIENTO'], data: 'descripcionRequerimiento' },
            { title: translations['TICKETS.REQUERIMIENTOS.ESTADOREQUERIMIENTO'], data: 'estadoRequerimiento' },
            { title: translations['PLATAFORMA.OPTIONS'], data: 'opciones' }
          ]
        };
        this.consultarRegistros();
      });
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
  consultarRegistros() {
    console.log('formregistro', this.requerimientosService);

    this.registrosSub = this.requerimientosService
      .getRegistros()
      .pipe(
        tap((resp: any) => {
          console.log('que me trae', resp);

          if (resp.ok) {
            resp.requerimientos.forEach((Requerimiento: any) => {
              Requerimiento.nomEstado = Requerimiento.estadoRequerimiento;
            });
            this.registros = resp.requerimientos;
            console.log('Todos las Requerimientos', this.registros);
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

  OnNuevoRegistroClick() {
    this.router.navigate(['help-desk/gestion-requerimiento/']);
  }

  OnEditarRegistroClick(id: number) {
    this.router.navigate(['help-desk/gestion-requerimiento/'], { queryParams: { regId: id } });
  }

  OnEliminarRegistroClick(id: number, nombre: string) {
    Swal.fire({
      title: this.translate.instant('TICKETS.REQUERIMIENTOS.ELIMINARTITULO'),
      text: this.translate.instant('TICKETS.REQUERIMIENTOS.ELIMINARTEXTO') + `"${nombre}".!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: this.translate.instant('PLATAFORMA.DELETE'),
      cancelButtonText: this.translate.instant('PLATAFORMA.CANCEL')
    }).then((result: any) => {
      if (result.isConfirmed) {
        this.requerimientosService.deleteEliminarRegistro(id).subscribe({
          next: (resp: any) => {
            Swal.fire(this.translate.instant('TICKETS.REQUERIMIENTOS.ELIMINAREXITOSA'), resp.mensaje, 'success');
            this.registros = this.registros.filter((s) => s.requerimientoId !== id);
          },
          error: (err: any) => {
            Swal.fire('Error', this.translate.instant('TICKETS.REQUERIMIENTOS.ELIMINARERROR'), 'error');
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
