
import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DataTablesModule, DataTableDirective } from 'angular-datatables';
import { catchError, of, Subject, Subscription, tap } from 'rxjs';
import { GradientConfig } from 'src/app/app-config';
import { NavBarComponent } from 'src/app/theme/layout/admin/nav-bar/nav-bar.component';
import { NavContentComponent } from 'src/app/theme/layout/admin/navigation/nav-content/nav-content.component';
import { NavigationItem } from 'src/app/theme/layout/admin/navigation/navigation';
import { PTLContenidoELModel } from 'src/app/theme/shared/_helpers/models/PTLContenidoEL.model';
import { BreadcrumbComponent } from 'src/app/theme/shared/components/breadcrumb/breadcrumb.component';
import { LanguageService } from 'src/app/theme/shared/service/lenguage.service';
import { NavigationService } from 'src/app/theme/shared/service/navigation.service';
import { PTLContenidosELService } from 'src/app/theme/shared/service/ptlcontenidos-el.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-contenidos',
  standalone: true,
  imports: [CommonModule, DataTablesModule, SharedModule, TranslateModule, NavBarComponent, NavContentComponent],
  templateUrl: './contenidos.component.html',
  styleUrls: ['./contenidos.component.scss']
})
export class ContenidosComponent implements OnInit, AfterViewInit {
  [x: string]: any;
  @ViewChild(DataTableDirective, { static: false })
  @Output() toggleSidebar = new EventEmitter<void>();
  activeTab: 'menu' | 'filters' | 'main' = 'menu';

  datatableElement!: DataTableDirective;
  registrosSub?: Subscription;

  dtColumnSearchingOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  registro: PTLContenidoELModel[] = [];
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
    private contenidoService: PTLContenidosELService,
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
            'SITIOS.CONTENIDOS.NAME',
            'SITIOS.CONTENIDOS.DESCRIPTION',
            'SITIOS.CONTENIDOS.CONTENIDO',
            'SITIOS.CONTENIDOS.STATUS',
            'PLATAFORMA.OPTIONS'
        ])
        .subscribe((translations) => {
          this.tituloPagina = translations['SITIOS.CONTENIDOS.TITLE'];
          this.dtColumnSearchingOptions = {
            responsive: true,
            columns: [
              { title: this.translate.instant('SITIOS.CONTENIDOS.NAME'), data: 'nombreContenido' },
              { title: this.translate.instant('SITIOS.CONTENIDOS.DESCRIPTION'), data: 'descripcionContenido' },
              { title: this.translate.instant('SITIOS.CONTENIDOS.CONTENIDO'), data: 'contenido' },
              { title: this.translate.instant('SITIOS.CONTENIDOS.STATUS'), data: 'estadoContenido' },
              { title: this.translate.instant('PLATAFORMA.OPTIONS'), data: 'opciones' }
            ]
          };
          this.consultarRegistros();
        });
    // });
  }

  consultarRegistros() {
      this.registrosSub = this.contenidoService
        .getRegistros()
        .pipe(
          tap((resp: any) => {
            if (resp.ok) {
              resp.contenidos.forEach((contenido: any) => {
                contenido.nomEstado = contenido.estadoContenido== true ? 'Activa' : 'Inactiva';
              });
              this.registro = resp.contenidos;
              console.log('Todos los contenidos', this.registro);
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
    this.router.navigate(['/sites/gestion-contenido']);
  }

  OnEditarRegistroClick(id: number) {
    this.router.navigate(['/sites/gestion-contenido'], { queryParams: { regId: id } });
  }

  OnEliminarRegistroClick(id: number, nombre: string) {
    Swal.fire({
      title: this.translate.instant('SITIOS.CONTENIDOS.ELIMINARTITULO'),
      text: this.translate.instant('SITIOS.CONTENIDOS.ELIMINARTEXTO') + `"${nombre}".!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: this.translate.instant('PLATAFORMA.DELETE'),
      cancelButtonText: this.translate.instant('PLATAFORMA.CANCEL')
    }).then((result) => {
      if (result.isConfirmed) {
        this.contenidoService.deleteEliminarRegistro(id).subscribe({
          next: (resp: any) => {
            Swal.fire(this.translate.instant('SITIOS.CONTENIDOS.ELIMINAREXITOSA'), resp.mensaje, 'success');
            this.registro = this.registro.filter((s) => s.contenidoId !== id);
          },
          error: (err: any) => {
            Swal.fire('Error', this.translate.instant('SITIOS.CONTENIDOS.ELIMINARERROR'), 'error');
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

