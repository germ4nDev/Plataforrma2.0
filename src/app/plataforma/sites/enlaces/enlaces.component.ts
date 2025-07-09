import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { Subject } from 'rxjs';
import Swal from 'sweetalert2';

import { BreadcrumbComponent } from '../../../theme/shared/components/breadcrumb/breadcrumb.component';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { PTLEnlacesSTService } from 'src/app/theme/shared/service/ptlenlaces-st.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/theme/shared/service/lenguage.service';
import { PTLEnlaceSTModel } from 'src/app/theme/shared/_helpers/models/PTLEnlaceST.model';

@Component({
  selector: 'app-enlaces',
  standalone: true,
  imports: [CommonModule, DataTablesModule, SharedModule, BreadcrumbComponent, TranslateModule],
  templateUrl: './enlaces.component.html',
  styleUrls: ['./enlaces.component.scss']
})
export class EnlacesComponent implements OnInit, AfterViewInit {
  [x: string]: any;
  @ViewChild(DataTableDirective, { static: false })
  datatableElement!: DataTableDirective;

  dtColumnSearchingOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  enlaceST: PTLEnlaceSTModel[] = [];
  lang: string = localStorage.getItem('lang') || '';
  tituloPagina: string = '';

  constructor(
    private router: Router,
    private BreadCrumb: BreadcrumbComponent,
    private translate: TranslateService,
    private languageService: LanguageService,
    private enlacesService: PTLEnlacesSTService
  ) {}

  ngOnInit() {
    this.languageService.currentLang$.subscribe((lang) => {
      this.translate.use(lang);
      this.translate
        .get(['ENLACES.NAME', 'ENLACES.DESCRIPTION', 'ENLACES.RUTA', 'ENLACES.STATUS', 'PLATAFORMA.OPTIONS'])
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
          this.consultarEnlaces();
        });
    });
  }
  consultarEnlaces() {
    this.enlacesService.getEnlaces().subscribe((enlace: any) => {
      console.log('Todos los enlaces', enlace.resp.data);
      this.enlaceST = enlace.resp.data;
      this.dtTrigger.next(null); // <--- Dispara la actualización de la tabla
    });
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

  getEstado(estado: boolean): string {
    return estado ? 'Activo' : 'Inactivo';
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe(); // <--- Destruye el trigger para evitar memory leaks
  }
  nuevoEnlace() {
    this.router.navigate(['/sites/gestion-enlace']);
  }

  editarEnlace(id: number) {
    this.router.navigate(['/sites/gestion-enlace'], { queryParams: { enlaceId: id } });
  }

  eliminarEnlace(id: number, nombre: string) {
    Swal.fire({
      title: this.translate.instant('ENLACES.ELIMINARTITULO'),
      text: this.translate.instant('ENLACES.ELIMINARTEXTO') + `"${nombre}".!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: this.translate.instant('PLATAFORMA.DELETE'),
      cancelButtonText: this.translate.instant('PLATAFORMA.CANCEL')
    }).then((result) => {
      if (result.isConfirmed) {
        this.enlacesService.eliminarEnlace(id).subscribe({
          next: (resp: any) => {
            Swal.fire(this.translate.instant('ENLACES.ELIMINAREXITOSA'), resp.mensaje, 'success');
            this.enlaceST = this.enlaceST.filter((s) => s.enlaceId !== id);
          },
          error: (err: any) => {
            Swal.fire('Error', this.translate.instant('ENLACES.ELIMINARERROR'), 'error');
            console.error('Error eliminando', err);
          }
        });
      }
    });
  }
}
