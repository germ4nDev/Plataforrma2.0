import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DataTablesModule, DataTableDirective } from 'angular-datatables';
import { Subscription, Subject, tap, catchError, of } from 'rxjs';
import { PTLServidorModel } from 'src/app/theme/shared/_helpers/models/PTLServidor.model';
import { BreadcrumbComponent } from 'src/app/theme/shared/components/breadcrumb/breadcrumb.component';
import { LanguageService } from 'src/app/theme/shared/service';
import { PTLServidorService } from 'src/app/theme/shared/service/ptlservidor.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-servidores',
  standalone: true,
  imports: [CommonModule, DataTablesModule, SharedModule, BreadcrumbComponent, TranslateModule],
  templateUrl: './servidores.component.html',
  styleUrl: './servidores.component.scss'
})
export class ServidoresComponent implements OnInit, AfterViewInit {
 //#region VARIABLES
  [x: string]: any;
  @ViewChild(DataTableDirective, { static: false })
  datatableElement!: DataTableDirective;
  registrosSub?: Subscription;
  dtColumnSearchingOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  registros: PTLServidorModel[] = [];
  lang: string = localStorage.getItem('lang') || '';
  tituloPagina: string = '';

  //#endregion VARIABLES

  constructor(
    private router: Router,
    private translate: TranslateService,
    private servidorService: PTLServidorService,
    private languageService: LanguageService,
    private BreadCrumb: BreadcrumbComponent
  ) {}

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
    this.languageService.currentLang$.subscribe((lang) => {
      this.translate.use(lang);
      this.translate
        .get(['SERVIDORES.NOMBRESERVIDOR', 'SERVIDORES.DESCRIPCIONSERVIDOR', 'SERVIDORES.RUTASERVIDOR', 'SERVIDORES.ESTADOSERVIDOR'])
        .subscribe((translations) => {
          this.tituloPagina = translations['SERVIDORES.TITLE'];
          this.dtColumnSearchingOptions = {
            responsive: true,
            columns: [
              { title: translations['SERVIDORES.NOMBRESERVIDOR'], data: 'nombreServidor' },
              { title: translations['SERVIDORES.DESCRIPCIONSERVIDOR'], data: 'descripcionServidor' },
              { title: translations['SERVIDORES.RUTASERVIDOR'], data: 'rutaServidor' },
              { title: translations['SERVIDORES.ESTADOSERVIDOR'], data: 'estadoServidor' },
              { title: translations['PLATAFORMA.OPTIONS'], data: 'opciones' }
            ]
          };
          this.consultarRegistros();
        });
    });
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  consultarRegistros() {
    this.registrosSub = this.servidorService
      .getRegistros()
      .pipe(
        tap((resp: any) => {
          if (resp.ok) {
            resp.servidores.forEach((servidor: any) => {
              servidor.nomEstado = servidor.estadoServidor == true ? 'Activo' : 'Inactivo';
            });
            this.registros = resp.servidores;
            console.log('Todos las servidores', this.registros);
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
    this.router.navigate(['administracion-bd/gestion-servidor/']);
  }

  OnEditarRegistroClick(id: number) {
    this.router.navigate(['administracion-bd/gestion-servidor/'], { queryParams: { regId: id } });
  }

  OnEliminarRegistroClick(id: number, nombre: string) {
    Swal.fire({
      title: this.translate.instant('SERVIDORES.ELIMINARTITULO'),
      text: this.translate.instant('SERVIDORES.ELIMINARTEXTO') + `"${nombre}".!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: this.translate.instant('PLATAFORMA.DELETE'),
      cancelButtonText: this.translate.instant('PLATAFORMA.CANCEL')
    }).then((result: any) => {
      if (result.isConfirmed) {
        this.servidorService.deleteEliminarRegistro(id).subscribe({
          next: (resp: any) => {
            Swal.fire(this.translate.instant('SERVIDORES.ELIMINAREXITOSA'), resp.mensaje, 'success');
            this.registros = this.registros.filter((s) => s.servidorId !== id);
          },
          error: (err: any) => {
            Swal.fire('Error', this.translate.instant('SERVIDORES.ELIMINARERROR'), 'error');
            console.error('Error eliminando', err);
          }
        });
      }
    });
  }
}
