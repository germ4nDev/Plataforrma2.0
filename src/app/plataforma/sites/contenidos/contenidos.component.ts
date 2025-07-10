import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DataTablesModule, DataTableDirective } from 'angular-datatables';
import { catchError, of, Subject, Subscription, tap } from 'rxjs';
import { PTLContenidoELModel } from 'src/app/theme/shared/_helpers/models/PTLContenidoEL.model';
import { BreadcrumbComponent } from 'src/app/theme/shared/components/breadcrumb/breadcrumb.component';
import { LanguageService } from 'src/app/theme/shared/service/lenguage.service';
import { PTLContenidosELService } from 'src/app/theme/shared/service/ptlcontenidos-el.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-contenidos',
  standalone: true,
  imports: [CommonModule, DataTablesModule, SharedModule, BreadcrumbComponent, TranslateModule],
  templateUrl: './contenidos.component.html',
  styleUrls: ['./contenidos.component.scss']
})
export class ContenidosComponent implements OnInit, AfterViewInit {
  [x: string]: any;
  @ViewChild(DataTableDirective, { static: false })
  datatableElement!: DataTableDirective;
  registrosSub?: Subscription;

  dtColumnSearchingOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  contenidoEL: PTLContenidoELModel[] = [];
  lang: string = localStorage.getItem('lang') || '';
  tituloPagina: string = '';

  constructor(
    private router: Router,
    private BreadCrumb: BreadcrumbComponent,
    private translate: TranslateService,
    private languageService: LanguageService,
    private contenidoService: PTLContenidosELService
  ) {}

  ngOnInit() {
    this.languageService.currentLang$.subscribe((lang) => {
      this.translate.use(lang);
      this.translate
        .get(['CONTENIDOS.NAME', 'CONTENIDOS.DESCRIPTION', 'CONTENIDOS.CONTENIDO', 'CONTENIDOS.STATUS', 'PLATAFORMA.OPTIONS'])
        .subscribe((translations) => {
          this.tituloPagina = translations['CONTENIDOS.TITLE'];
          this.dtColumnSearchingOptions = {
            responsive: true,
            columns: [
              { title: this.translate.instant('CONTENIDOS.NAME'), data: 'nombreContenido' },
              { title: this.translate.instant('CONTENIDOS.DESCRIPTION'), data: 'descripcionContenido' },
              { title: this.translate.instant('CONTENIDOS.CONTENIDO'), data: 'contenido' },
              { title: this.translate.instant('CONTENIDOS.STATUS'), data: 'estadoContenido' },
              { title: this.translate.instant('PLATAFORMA.OPTIONS'), data: 'opciones' }
            ]
          };
          this.consultarContenido();
        });
    });
  }

  consultarContenido() {
      this.registrosSub = this.contenidoService
        .getContenido()
        .pipe(
          tap((resp: any) => {
            if (resp.ok) {
              resp.contenido.forEach((app: any) => {
                app.nomEstado = app.estadoContenido== true ? 'Activa' : 'Inactiva';
              });
              this.contenidoEL = resp.contenido;
              console.log('Todos los contenidos', this.contenidoEL);
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
  nuevoContenido() {
    this.router.navigate(['/sites/gestion-contenido']);
  }

  editarContenido(id: number) {
    this.router.navigate(['/sites/gestion-contenido'], { queryParams: { regId: id } });
  }

  eliminarContenido(id: number, nombre: string) {
    Swal.fire({
      title: this.translate.instant('CONTENIDOS.ELIMINARTITULO'),
      text: this.translate.instant('CONTENIDOS.ELIMINARTEXTO') + `"${nombre}".!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: this.translate.instant('PLATAFORMA.DELETE'),
      cancelButtonText: this.translate.instant('PLATAFORMA.CANCEL')
    }).then((result) => {
      if (result.isConfirmed) {
        this.contenidoService.eliminarContenido(id).subscribe({
          next: (resp: any) => {
            Swal.fire(this.translate.instant('CONTENIDOS.ELIMINAREXITOSA'), resp.mensaje, 'success');
            this.contenidoEL = this.contenidoEL.filter((s) => s.contenidoId !== id);
          },
          error: (err: any) => {
            Swal.fire('Error', this.translate.instant('CONTENIDOS.ELIMINARERROR'), 'error');
            console.error('Error eliminando', err);
          }
        });
      }
    });
  }
}

