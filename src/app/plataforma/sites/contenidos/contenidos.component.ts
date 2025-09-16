
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
import { NavigationService } from 'src/app/theme/shared/service/navigation.service';
import { PTLContenidosELService } from 'src/app/theme/shared/service/ptlcontenidos-el.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import Swal from 'sweetalert2';
import { DatatableComponent } from "src/app/theme/shared/components/data-table/data-table.component";

@Component({
  selector: 'app-contenidos',
  standalone: true,
  imports: [CommonModule, DataTablesModule, SharedModule, TranslateModule, NavBarComponent, NavContentComponent, DatatableComponent],
  templateUrl: './contenidos.component.html',
  styleUrls: ['./contenidos.component.scss']
})
export class ContenidosComponent implements OnInit, AfterViewInit {
    @Output() toggleSidebar = new EventEmitter<void>();
    //#region VARIABLES
    registrosSub?: Subscription;
    registros: PTLContenidoELModel[] = [];
    lang: string = localStorage.getItem('lang') || '';
    tituloPagina: string = '';
    gradientConfig;
    hasFiltersSlot: boolean = false;
    menuItems: NavigationItem[] = [];
    activeTab: 'menu' | 'filters' | 'main' = 'menu';
    //#endregion VARIABLES
  constructor(
    private router: Router,
    private translate: TranslateService,
    private contenidoService: PTLContenidosELService,
    private navigationService: NavigationService
    ) {
      this.gradientConfig = GradientConfig;
    }

  ngOnInit() {
    const appCode = localStorage.getItem('aplicacionId') || 'plataforma';
    this.menuItems = this.navigationService.getNavigationItems(appCode);
    this.hasFiltersSlot = true;
    this.consultarRegistros();
    console.log('elementos menu componente', this.menuItems);
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
              this.registros = resp.contenidos;
              console.log('Todos los contenidos', this.registros);
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
    this.router.navigate(['/sites/gestion-contenido']);
  }

  OnEditarRegistroClick(id: number) {
    this.router.navigate(['/sites/gestion-contenido'], { queryParams: { regId: id } });
  }

  OnEliminarRegistroClick(id: any) {
    Swal.fire({
      title: this.translate.instant('SITIOS.CONTENIDOS.ELIMINARTITULO'),
      text: this.translate.instant('SITIOS.CONTENIDOS.ELIMINARTEXTO'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: this.translate.instant('PLATAFORMA.DELETE'),
      cancelButtonText: this.translate.instant('PLATAFORMA.CANCEL')
    }).then((result) => {
      if (result.isConfirmed) {
        this.contenidoService.deleteEliminarRegistro(id.id).subscribe({
          next: (resp: any) => {
            Swal.fire(this.translate.instant('SITIOS.CONTENIDOS.ELIMINAREXITOSA'), resp.mensaje, 'success');
            this.registros = this.registros.filter((s) => s.contenidoId !== id.id);
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

