import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import Swal from 'sweetalert2';

import { BreadcrumbComponent } from '../../../theme/shared/components/breadcrumb/breadcrumb.component';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { PTLEnlacesSTService } from 'src/app/theme/shared/service/ptlenlaces-st.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/theme/shared/service/lenguage.service';
import { catchError, of, Subject, Subscription, tap } from 'rxjs';
import { GradientConfig } from 'src/app/app-config';
import { NavBarComponent } from 'src/app/theme/layout/admin/nav-bar/nav-bar.component';
import { NavContentComponent } from 'src/app/theme/layout/admin/navigation/nav-content/nav-content.component';
import { NavigationItem } from 'src/app/theme/layout/admin/navigation/navigation';
import { PTLEnlaceSTModel } from 'src/app/theme/shared/_helpers/models/PTLEnlaceST.model';
import { NavigationService } from 'src/app/theme/shared/service/navigation.service';

@Component({
  selector: 'app-enlaces',
  standalone: true,
  imports: [CommonModule, DataTablesModule, SharedModule, TranslateModule, NavBarComponent, NavContentComponent],
  templateUrl: './enlaces.component.html',
  styleUrls: ['./enlaces.component.scss']
})
export class EnlacesComponent implements OnInit, AfterViewInit {
  [x: string]: any;
  @ViewChild(DataTableDirective, { static: false })
  @Output() toggleSidebar = new EventEmitter<void>();
  activeTab: 'menu' | 'filters' | 'main' = 'menu';

  datatableElement!: DataTableDirective;
  registrosSub?: Subscription;

  dtColumnSearchingOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  registros: PTLEnlaceSTModel[] = [];
  lang: string = localStorage.getItem('lang') || '';
  tituloPagina: string = '';
  menuItems: NavigationItem[] = [];
  hasFiltersSlot: boolean = false;
  gradientConfig;

  constructor(
    private router: Router,
    private BreadCrumb: BreadcrumbComponent,
    private translate: TranslateService,
    private languageService: LanguageService,
    private enlacesService: PTLEnlacesSTService,
    private navigationService: NavigationService
    ) {
      this.gradientConfig = GradientConfig;
    }

  ngOnInit() {
    // this.languageService.currentLang$.subscribe((lang) => {
    //   this.translate.use(lang);
    const appCode = localStorage.getItem('aplicacionId') || 'plataforma';
    this.menuItems = this.navigationService.getNavigationItems(appCode);
    console.log('elementos menu componente', this.menuItems);
    this.hasFiltersSlot = true;
      this.translate
        .get([
            'ENLACES.NAME',
            'ENLACES.DESCRIPTION',
            'ENLACES.RUTA',
            'ENLACES.STATUS',
            'PLATAFORMA.OPTIONS'
        ])
        .subscribe((translations) => {
          this.tituloPagina = translations['ENLACES.TITLE'];
          this.dtColumnSearchingOptions = {
            responsive: true,
            columns: [
              { title: this.translate.instant('ENLACES.NAME'), data: 'nombreEnlace' },
              { title: this.translate.instant('ENLACES.DESCRIPTION'), data: 'descripcionEnlace' },
              { title: this.translate.instant('ENLACES.RUTA'), data: 'rutaEnlace' },
              { title: this.translate.instant('ENLACES.STATUS'), data: 'estadoEnlace' },
              { title: this.translate.instant('PLATAFORMA.OPTIONS'), data: 'opciones' }
            ]
          };
          this.consultarRegistros();
        });
    // });
  }

  consultarRegistros() {
    this.registrosSub = this.enlacesService
      .getRegistros()
      .pipe(
        tap((resp: any) => {
          if (resp.ok) {
            resp.enlaces.forEach((enlace: any) => {
              enlace.nomEstado = enlace.estadoEnlace== true ? 'Activa' : 'Inactiva';
            });
            this.registros = resp.enlaces;
            console.log('Todos los enlaces', this.registros);
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
    this.router.navigate(['/sites/gestion-enlace']);
  }

  OnEditarRegistroClick(id: number) {
    this.router.navigate(['/sites/gestion-enlace'], { queryParams: { regId: id } });
  }

  OnEliminarRegistroClick(id: number, nombre: string) {
    Swal.fire({
      title: this.translate.instant('ENLACES.ELIMINARTITULO'),
      text: this.translate.instant('ENLACES.ELIMINARTEXTO') + `"${nombre}".!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: this.translate.instant('PLATAFORMA.DELETE'),
      cancelButtonText: this.translate.instant('PLATAFORMA.CANCEL')
    }).then((result) => {
      if (result.isConfirmed) {
        this.enlacesService.deleteEliminarRegistro(id).subscribe({
          next: (resp: any) => {
            Swal.fire(this.translate.instant('ENLACES.ELIMINAREXITOSA'), resp.mensaje, 'success');
            this.registros = this.registros.filter((s) => s.enlaceId !== id);
          },
          error: (err: any) => {
            Swal.fire('Error', this.translate.instant('ENLACES.ELIMINARERROR'), 'error');
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
