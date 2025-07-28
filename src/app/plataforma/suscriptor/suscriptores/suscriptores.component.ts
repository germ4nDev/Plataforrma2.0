import { CommonModule } from '@angular/common';
import { Component, OnInit, AfterViewInit, ViewChild, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DataTablesModule, DataTableDirective } from 'angular-datatables';
import { Subscription, Subject, tap, catchError, of } from 'rxjs';
import { GradientConfig } from 'src/app/app-config';
import { NavBarComponent } from 'src/app/theme/layout/admin/nav-bar/nav-bar.component';
import { NavContentComponent } from 'src/app/theme/layout/admin/navigation/nav-content/nav-content.component';
import { NavigationItem } from 'src/app/theme/layout/admin/navigation/navigation';
import { PTLSuscriptorModel } from 'src/app/theme/shared/_helpers/models/PTLSuscriptor.model';
import { BreadcrumbComponent } from 'src/app/theme/shared/components/breadcrumb/breadcrumb.component';
import { LanguageService } from 'src/app/theme/shared/service';
import { NavigationService } from 'src/app/theme/shared/service/navigation.service';
import { PTLSuscriptoresService } from 'src/app/theme/shared/service/ptlsuscriptores.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-suscriptores',
  standalone: true,
  imports: [CommonModule, DataTablesModule, SharedModule, TranslateModule, NavBarComponent, NavContentComponent],
  templateUrl: './suscriptores.component.html',
  styleUrl: './suscriptores.component.scss'
})
export class SuscriptoresComponent implements OnInit, AfterViewInit {
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
  suscriptores: PTLSuscriptorModel[] = [];
  lang: string = localStorage.getItem('lang') || '';
  tituloPagina: string = '';
  menuItems: NavigationItem[] = [];
  hasFiltersSlot: boolean = false;
  gradientConfig;

  //#endregion VARIABLES

  constructor(
    private router: Router,
    private translate: TranslateService,
    private suscriptoresService: PTLSuscriptoresService,
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
        'SUSCRIPTORES.IDENTIFICATION',
        'SUSCRIPTORES.NAME',
        'SUSCRIPTORES.DESCRIPTION',
        'SUSCRIPTORES.ESTADO'
    ])
      .subscribe((translations) => {
        this.tituloPagina = translations['SUSCRIPTORES.TITLE'];
        this.dtColumnSearchingOptions = {
          responsive: true,
          columns: [
            { title: translations['SUSCRIPTORES.IDENTIFICATION'], data: 'identificacionSuscriptor' },
            { title: translations['SUSCRIPTORES.NAME'], data: 'nombreSuscriptor' },
            { title: translations['SUSCRIPTORES.DESCRIPTION'], data: 'descripcionSuscriptor' },
            { title: translations['SUSCRIPTORES.STATUS'], data: 'estadoSuscriptor' },
            { title: translations['SUSCRIPTORES.OPTIONS'], data: 'opciones' }
          ]
        };
        this.consultarRegistros();
      });
  }

  OnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  consultarRegistros() {
    this.registrosSub = this.suscriptoresService
      .getRegistros()
      .pipe(
        tap((resp: any) => {
          if (resp.ok) {
            resp.suscriptores.forEach((regs: any) => {
              regs.nomEstado = regs.estadoSuscriptor == true ? 'Activo' : 'Inactivo';
            });
            this.suscriptores = resp.suscriptores;
            console.log('Todos los Suscriptores', this.suscriptores);
            this.dtTrigger.next(null); // <--- Dispara la actualización de la tabla
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

  filtrarColumna(columna: number, valor: string) {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.column(columna).search(valor).draw();
    });
  }

  OnNuevoRegistroClick() {
    this.router.navigate(['/suscriptor/gestion-suscriptor']);
  }

  OnEditarRegistroClick(id: number) {
    this.router.navigate(['/suscriptor/gestion-suscriptor'], { queryParams: { regId: id } });
  }

  OnEliminarRegistroClick(id: number, nombre: string) {
    Swal.fire({
      title: this.translate.instant('SUSCRIPTORES.ELIMINARTITULO'),
      text: this.translate.instant('SUSCRIPTORES.ELIMINARTEXTO') + `"${nombre}".!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: this.translate.instant('PLATAFORMA.DELETE'),
      cancelButtonText: this.translate.instant('PLATAFORMA.CANCEL')
    }).then((result: any) => {
      if (result.isConfirmed) {
        this.suscriptoresService.deleteEliminarRegistro(id).subscribe({
          next: (resp: any) => {
            Swal.fire(this.translate.instant('SUSCRIPTORES.ELIMINAREXITOSA'), resp.mensaje, 'success');
            this.suscriptores = this.suscriptores.filter((s) => s.suscriptorId !== id);
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
