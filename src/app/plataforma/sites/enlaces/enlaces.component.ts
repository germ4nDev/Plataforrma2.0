import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import Swal from 'sweetalert2';

import { BreadcrumbComponent } from '../../../theme/shared/components/breadcrumb/breadcrumb.component';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { PTLEnlacesSTService } from 'src/app/theme/shared/service/ptlenlaces-st.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { catchError, of, Subject, Subscription, tap } from 'rxjs';
import { GradientConfig } from 'src/app/app-config';
import { NavBarComponent } from 'src/app/theme/layout/admin/nav-bar/nav-bar.component';
import { NavContentComponent } from 'src/app/theme/layout/admin/navigation/nav-content/nav-content.component';
import { NavigationItem } from 'src/app/theme/layout/admin/navigation/navigation';
import { PTLEnlaceSTModel } from 'src/app/theme/shared/_helpers/models/PTLEnlaceST.model';
import { NavigationService } from 'src/app/theme/shared/service/navigation.service';
import { DatatableComponent } from "src/app/theme/shared/components/data-table/data-table.component";

@Component({
  selector: 'app-enlaces',
  standalone: true,
  imports: [CommonModule, DataTablesModule, SharedModule, TranslateModule, NavBarComponent, NavContentComponent, DatatableComponent],
  templateUrl: './enlaces.component.html',
  styleUrls: ['./enlaces.component.scss']
})
export class EnlacesComponent implements OnInit, AfterViewInit {
    @Output() toggleSidebar = new EventEmitter<void>();
    //#region VARIABLES
    registrosSub?: Subscription;
    registros: PTLEnlaceSTModel[] = [];
    lang: string = localStorage.getItem('lang') || '';
    tituloPagina: string = '';
    gradientConfig;
    hasFiltersSlot: boolean = false;
    menuItems: NavigationItem[] = [];
    activeTab: 'menu' | 'filters' | 'main' = 'menu';
    //#endregion VARIABLES
  constructor(
    private router: Router,
    private BreadCrumb: BreadcrumbComponent,
    private translate: TranslateService,
    private enlacesService: PTLEnlacesSTService,
    private navigationService: NavigationService
    ) {
      this.gradientConfig = GradientConfig;
    }

  ngOnInit() {
    const appCode = localStorage.getItem('aplicacionId') || 'plataforma';
    this.menuItems = this.navigationService.getNavigationItems(appCode);
    this.hasFiltersSlot = true;
    this.consultarRegistros();
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

  ngOnDestroy(): void {
  }

  OnNuevoRegistroClick() {
    this.router.navigate(['/sites/gestion-enlace']);
  }

  OnEditarRegistroClick(id: number) {
    this.router.navigate(['/sites/gestion-enlace'], { queryParams: { regId: id } });
  }

  OnEliminarRegistroClick(id: any) {
    Swal.fire({
      title: this.translate.instant('SITIOS.ENLACES.ELIMINARTITULO'),
      text: this.translate.instant('SITIOS.ENLACES.ELIMINARTEXTO'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: this.translate.instant('PLATAFORMA.DELETE'),
      cancelButtonText: this.translate.instant('PLATAFORMA.CANCEL')
    }).then((result) => {
      if (result.isConfirmed) {
        this.enlacesService.deleteEliminarRegistro(id.id).subscribe({
          next: (resp: any) => {
            Swal.fire(this.translate.instant('SITIOS.ENLACES.ELIMINAREXITOSA'), resp.mensaje, 'success');
            this.registros = this.registros.filter((s) => s.enlaceId !== id.id);
          },
          error: (err: any) => {
            Swal.fire('Error', this.translate.instant('SITIOS.ENLACES.ELIMINARERROR'), 'error');
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
