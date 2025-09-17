/* eslint-disable @angular-eslint/use-lifecycle-interface */
/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { AfterViewInit, Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { Router } from '@angular/router';
import { PTLSitiosAPService } from 'src/app/theme/shared/service/ptlsitios-ap.service';
import { catchError, of, Subject, Subscription, tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

// project import
import { BreadcrumbComponent } from '../../../theme/shared/components/breadcrumb/breadcrumb.component';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { PTLSitiosAPModel } from 'src/app/theme/shared/_helpers/models/PTLSitioAP.model';
import { GradientConfig } from 'src/app/app-config';
import { NavigationItem } from 'src/app/theme/layout/admin/navigation/navigation';
import { NavigationService } from 'src/app/theme/shared/service/navigation.service';
import { NavBarComponent } from 'src/app/theme/layout/admin/nav-bar/nav-bar.component';
import { NavContentComponent } from 'src/app/theme/layout/admin/navigation/nav-content/nav-content.component';
import { DatatableComponent } from "src/app/theme/shared/components/data-table/data-table.component";

@Component({
  selector: 'app-sites',
  standalone: true,
  imports: [CommonModule, DataTablesModule, SharedModule, TranslateModule, NavBarComponent, NavContentComponent, DatatableComponent],
  templateUrl: './sites.component.html',
  styleUrl: './sites.component.scss'
})
export class SitesComponent implements OnInit, AfterViewInit {
    @Output() toggleSidebar = new EventEmitter<void>();
    //#region VARIABLES
    registrosSub?: Subscription;
    registros: PTLSitiosAPModel[] = [];
    lang: string = localStorage.getItem('lang') || '';
    tituloPagina: string = '';
    gradientConfig;
    hasFiltersSlot: boolean = false;
    menuItems: NavigationItem[] = [];
    activeTab: 'menu' | 'filters' | 'main' = 'menu';
    //#endregion VARIABLES
  constructor(
    private router: Router,
    private sitiosService: PTLSitiosAPService,
    private translate: TranslateService,
    private navigationService: NavigationService,
  ) {
    this.gradientConfig = GradientConfig;
  }

  ngOnInit() {
    const appCode = localStorage.getItem('aplicacionId') || 'plataforma';
    this.menuItems = this.navigationService.getNavigationItems(appCode);
    this.hasFiltersSlot = true;
    this.consultarSitios();
    console.log('elementos menu componente', this.menuItems);
  }

  consultarSitios() {
    this.registrosSub = this.sitiosService
      .getRegistros()
      .pipe(
        tap((resp: any) => {
          if (resp.ok) {
            resp.sitios.forEach((app: any) => {
              app.nomEstado = app.estadoSitio == true ? 'Activa' : 'Inactiva';
            });
            this.registros = resp.sitios;
            console.log('Todos las sitiosAP', this.registros);
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
  }

  getEstado(estado: boolean): string {
    return estado ? 'Activo' : 'Inactivo';
  }

  ngOnDestroy(): void {
  }

  OnNuevoRegistroClick() {
    this.router.navigate(['/sites/gestion-site']);
  }

  OnEditarRegistroClick(id: number) {
    this.router.navigate(['/sites/gestion-site'], { queryParams: { regId: id } });
  }

  OnEliminarRegistroClick(id: any) {
    console.log('id eliminar', id.id);

    Swal.fire({
      title: this.translate.instant('SITIOS.ELIMINARTITULO'),
      text: this.translate.instant('SITIOS.ELIMINARTEXTO'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: this.translate.instant('PLATAFORMA.DELETE'),
      cancelButtonText: this.translate.instant('PLATAFORMA.CANCEL')
    }).then((result) => {
      if (result.isConfirmed) {
        this.sitiosService.deleteEliminarRegistro(id.id).subscribe({
          next: (resp: any) => {
            Swal.fire(this.translate.instant('SITIOS.ELIMINAREXITOSA'), resp.mensaje, 'success');
            this.registros = this.registros.filter((s) => s.sitioId !== id.id);
          },
          error: (err: any) => {
            Swal.fire('Error', this.translate.instant('SITIOS.ELIMINARERROR'), 'error');
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
