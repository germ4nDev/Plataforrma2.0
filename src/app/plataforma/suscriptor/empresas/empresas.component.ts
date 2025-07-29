import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DataTablesModule, DataTableDirective } from 'angular-datatables';
import { Subscription, Subject, tap, catchError, of } from 'rxjs';
import { GradientConfig } from 'src/app/app-config';
import { NavBarComponent } from 'src/app/theme/layout/admin/nav-bar/nav-bar.component';
import { NavContentComponent } from 'src/app/theme/layout/admin/navigation/nav-content/nav-content.component';
import { NavigationItem } from 'src/app/theme/layout/admin/navigation/navigation';
import { PTLEmpresasSCModel } from 'src/app/theme/shared/_helpers/models/PTLEmpresaSC.model';
import { BreadcrumbComponent } from 'src/app/theme/shared/components/breadcrumb/breadcrumb.component';
import { LanguageService } from 'src/app/theme/shared/service';
import { NavigationService } from 'src/app/theme/shared/service/navigation.service';
import { PTLEmpresasSCService } from 'src/app/theme/shared/service/ptlempresas-sc.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-empresas',
  standalone: true,
  imports: [CommonModule, DataTablesModule, SharedModule, TranslateModule, NavBarComponent, NavContentComponent],
  templateUrl: './empresas.component.html',
  styleUrl: './empresas.component.scss'
})
export class EmpresasComponent implements OnInit, AfterViewInit {
    [x: string]: any;
    @ViewChild(DataTableDirective, { static: false })
    @Output() toggleSidebar = new EventEmitter<void>();
    activeTab: 'menu' | 'filters' | 'main' = 'menu';

    datatableElement!: DataTableDirective;
    registrosSub?: Subscription;

    dtColumnSearchingOptions: DataTables.Settings = {};
    dtTrigger: Subject<any> = new Subject<any>();
    registro: PTLEmpresasSCModel[] = [];
    lang: string = localStorage.getItem('lang') || '';
    tituloPagina: string = '';
    menuItems: NavigationItem[] = [];
    hasFiltersSlot: boolean = false;
    gradientConfig;

  constructor(
    private router: Router,
    private empresasService: PTLEmpresasSCService,
    private translate: TranslateService,
    private languageService: LanguageService,
    private BreadCrumb: BreadcrumbComponent,
    private navigationService: NavigationService
  ) {
    this.gradientConfig = GradientConfig;
  }

  ngOnInit() {
    const appCode = localStorage.getItem('aplicacionId') || 'plataforma';
    this.menuItems = this.navigationService.getNavigationItems(appCode);
    console.log('elementos menu componente', this.menuItems);
    this.hasFiltersSlot = true;
      this.translate
        .get([
            'SUSCRIPTORES.EMPRESASSC.NAME',
            'SUSCRIPTORES.EMPRESASSC.DESCRIPTION',
            'SUSCRIPTORES.EMPRESASSC.STATUS',
            'PLATAFORMA.OPTIONS'])
        .subscribe((translations) => {
          this.tituloPagina = translations['SUSCRIPTORES.EMPRESASSC.TITLE'];
          this.dtColumnSearchingOptions = {
            responsive: true,
            columns: [
              { title: this.translate.instant('SUSCRIPTORES.EMPRESASSC.NAME'), data: 'nombreEmpresa' },
              { title: this.translate.instant('SUSCRIPTORES.EMPRESASSC.DESCRIPTION'), data: 'descripcionEmpresa' },
              { title: this.translate.instant('SUSCRIPTORES.EMPRESASSC.STATUS'), data: 'estadoEmpresa' },
              { title: this.translate.instant('PLATAFORMA.OPTIONS'), data: 'opciones' }
            ]
          };
          this.consultarEmpresas();
        });
    // });
  }

  consultarEmpresas() {
    this.registrosSub = this.empresasService
      .getRegistros()
      .pipe(
        tap((resp: any) => {
          if (resp.ok) {
            resp.empresas.forEach((app: any) => {
              app.nomEstado = app.estadoEmpresa == true ? 'Activa' : 'Inactiva';
            });
            this.registro = resp.empresas;
            console.log('Todos las registro', this.registro);
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

  filtrarColumna(columna: number, valor: string) {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.column(columna).search(valor).draw();
    });
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe(); // <--- Destruye el trigger para evitar memory leaks
  }
  OnNuevoRegistroClick() {
    this.router.navigate(['/suscriptor/gestion-empresa']);
  }

  OnEditarRegistroClick(id: number) {
    this.router.navigate(['/suscriptor/gestion-empresa'], { queryParams: { regId: id } });
  }

  OnEliminarRegistroClick(id: number, nombre: string) {
    Swal.fire({
      title: this.translate.instant('SUSCRIPTORES.EMPRESASSC.ELIMINARTITULO'),
      text: this.translate.instant('SUSCRIPTORES.EMPRESASSC.ELIMINARTEXTO') + `"${nombre}".!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: this.translate.instant('PLATAFORMA.DELETE'),
      cancelButtonText: this.translate.instant('PLATAFORMA.CANCEL')
    }).then((result) => {
      if (result.isConfirmed) {
        this.empresasService.deleteEliminarRegistro(id).subscribe({
          next: (resp: any) => {
            Swal.fire(this.translate.instant('SUSCRIPTORES.EMPRESASSC.ELIMINAREXITOSA'), resp.mensaje, 'success');
            this.registro = this.registro.filter((s) => s.empresaId !== id);
          },
          error: (err: any) => {
            Swal.fire('Error', this.translate.instant('SUSCRIPTORES.EMPRESASSC.ELIMINARERROR'), 'error');
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
