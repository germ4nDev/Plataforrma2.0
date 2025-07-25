import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DataTablesModule, DataTableDirective } from 'angular-datatables';
import { Subscription, Subject, tap, catchError, of } from 'rxjs';
import { GradientConfig } from 'src/app/app-config';
import { NavBarComponent } from 'src/app/theme/layout/admin/nav-bar/nav-bar.component';
import { NavContentComponent } from 'src/app/theme/layout/admin/navigation/nav-content/nav-content.component';
import { NavigationItem } from 'src/app/theme/layout/admin/navigation/navigation';
import { PTLAplicacionModel } from 'src/app/theme/shared/_helpers/models/PTLAplicacion.model';
import { PTLConexionBDModel } from 'src/app/theme/shared/_helpers/models/PTLConexionBD.model';
import { PTLSuscriptorModel } from 'src/app/theme/shared/_helpers/models/PTLSuscriptor.model';
import { BreadcrumbComponent } from 'src/app/theme/shared/components/breadcrumb/breadcrumb.component';
import { LanguageService, PtlAplicacionesService } from 'src/app/theme/shared/service';
import { NavigationService } from 'src/app/theme/shared/service/navigation.service';
import { PTLConexionesBDSTService } from 'src/app/theme/shared/service/ptlconexiones-bd-st.service';
import { PTLSuscriptoresService } from 'src/app/theme/shared/service/ptlsuscriptores.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-conexciones',
  standalone: true,
  imports: [CommonModule, DataTablesModule, SharedModule, TranslateModule, NavBarComponent, NavContentComponent],
  templateUrl: './conexiones.component.html',
  styleUrl: './conexiones.component.scss'
})
export class ConexionesComponent implements OnInit, AfterViewInit {
 //#region VARIABLES
  [x: string]: any;
  @ViewChild(DataTableDirective, { static: false })
  @Output() toggleSidebar = new EventEmitter<void>();
  activeTab: 'menu' | 'filters' | 'main' = 'menu';

  datatableElement!: DataTableDirective;
  registrosSub?: Subscription;
  dtColumnSearchingOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  registros: PTLConexionBDModel[] = [];
  aplicaciones: PTLAplicacionModel[] = [];
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
    private conexionService: PTLConexionesBDSTService,
    private aplicacionesService: PtlAplicacionesService,
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
    // this.languageService.currentLang$.subscribe((lang) => {
    //   this.translate.use(lang);
    const appCode = localStorage.getItem('aplicacionId') || 'plataforma';
    this.menuItems = this.navigationService.getNavigationItems(appCode);
    console.log('elementos menu componente', this.menuItems);
    this.hasFiltersSlot = true;
      this.translate
        .get([
            'CONEXIONES.NOMBREAPLICACION',
            'CONEXIONES.NOMBRESUSCRIPTOR',
            'CONEXIONES.NOMBRESERVIDOR',
            'CONEXIONES.NOMBREBD',
            'CONEXIONES.ESTADOCONEXION'
        ])
        .subscribe((translations) => {
          this.tituloPagina = translations['CONEXIONES.TITLE'];
          this.dtColumnSearchingOptions = {
            responsive: true,
            columns: [
              { title: translations['CONEXIONES.NOMBREAPLICACION'], data: 'nombreAplicacion' },
              { title: translations['CONEXIONES.NOMBRESUSCRIPTOR'], data: 'nombreSuscriptor' },
              { title: translations['CONEXIONES.NOMBREconexion'], data: 'nombreconexion' },
              { title: translations['CONEXIONES.NOMBREBD'], data: 'BDNombre' },
              { title: translations['CONEXIONES.ESTADOCONEXION'], data: 'estadoConexion' },
              { title: translations['PLATAFORMA.OPTIONS'], data: 'opciones' }
            ]
          };
          this.consultarRegistros();
        });
    // });
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  consultarRegistros() {
    this.consultarAplicaciones();
    this.consultarSuscriptores();
    this.registrosSub = this.conexionService
      .getRegistros()
      .pipe(
        tap((resp: any) => {
          if (resp.ok) {
            resp.conexiones.forEach((conexion: any) => {
                const app = this.aplicaciones.filter((x) => x.aplicacionId == conexion.aplicacionId)[0];
                const susc = this.suscriptores.filter((x) => x.suscriptorId == conexion.suscriptorId)[0];
                conexion.nombreAplicacion = app.nombreAplicacion;
                conexion.nombreSuscriptor = susc.nombreSuscriptor;
                conexion.nomEstado = conexion.estadoConexion == true ? 'Activo' : 'Inactivo';
            });
            this.registros = resp.conexiones;
            console.log('Todos las conexiones', this.registros);
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

    consultarAplicaciones() {
    this.registrosSub = this.aplicacionesService
      .getAplicaciones()
      .pipe(
        tap((resp: any) => {
          if (resp.ok) {
            this.aplicaciones = resp.aplicaciones;
            console.log('Todos las aplicaciones', this.aplicaciones);
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

  consultarSuscriptores() {
    this.registrosSub = this.suscriptoresService
      .getSuscriptores()
      .pipe(
        tap((resp: any) => {
          if (resp.ok) {
            this.suscriptores = resp.suscriptores;
            console.log('Todos las suscriptores', this.suscriptores);
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
    this.router.navigate(['administracion-bd/gestion-conexion/']);
  }

  OnEditarRegistroClick(id: number) {
    this.router.navigate(['administracion-bd/gestion-conexion/'], { queryParams: { regId: id } });
  }

  OnEliminarRegistroClick(id: number, nombre: string) {
    Swal.fire({
      title: this.translate.instant('CONEXIONES.ELIMINARTITULO'),
      text: this.translate.instant('CONEXIONES.ELIMINARTEXTO') + `"${nombre}".!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: this.translate.instant('PLATAFORMA.DELETE'),
      cancelButtonText: this.translate.instant('PLATAFORMA.CANCEL')
    }).then((result: any) => {
      if (result.isConfirmed) {
        this.conexionService.deleteEliminarRegistro(id).subscribe({
          next: (resp: any) => {
            Swal.fire(this.translate.instant('CONEXIONES.ELIMINAREXITOSA'), resp.mensaje, 'success');
            this.registros = this.registros.filter((s) => s.conexionId !== id);
          },
          error: (err: any) => {
            Swal.fire('Error', this.translate.instant('CONEXIONES.ELIMINARERROR'), 'error');
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
