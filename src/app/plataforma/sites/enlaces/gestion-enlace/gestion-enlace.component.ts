import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule, LocationStrategy, Location } from '@angular/common';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';

// third party
import { ActivatedRoute, Router } from '@angular/router';
import { BreadcrumbComponent } from 'src/app/theme/shared/components/breadcrumb/breadcrumb.component';
import { PTLEnlacesSTService } from 'src/app/theme/shared/service/ptlenlaces-st.service';
import { PTLEnlaceSTModel } from 'src/app/theme/shared/_helpers/models/PTLEnlaceST.model';
import Swal from 'sweetalert2';
import { PTLSitiosAPModel } from 'src/app/theme/shared/_helpers/models/PTLSitioAP.model';
import { catchError, of, Subscription, tap } from 'rxjs';
import { PTLSitiosAPService } from 'src/app/theme/shared/service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { GradientConfig } from 'src/app/app-config';
import { NavBarComponent } from 'src/app/theme/layout/admin/nav-bar/nav-bar.component';
import { NavContentComponent } from 'src/app/theme/layout/admin/navigation/nav-content/nav-content.component';
import { NavigationItem } from 'src/app/theme/layout/admin/navigation/navigation';
import { LayoutInitializerService } from 'src/app/theme/shared/service/layout-initializer.service';
import { NavigationService } from 'src/app/theme/shared/service/navigation.service';

@Component({
  selector: 'app-gestion-enlace',
  standalone: true,
  imports: [CommonModule, SharedModule, TranslateModule, NavBarComponent, NavContentComponent],
  templateUrl: './gestion-enlace.component.html',
  styleUrl: './gestion-enlace.component.scss'
})
export class GestionEnlaceComponent {
  // private props
  @Output() toggleSidebar = new EventEmitter<void>();
  FormRegistro: PTLEnlaceSTModel = new PTLEnlaceSTModel();
  menuItems: NavigationItem[] = [];
  gradientConfig: any;
  navCollapsed: boolean = false;
  navCollapsedMob: boolean = false;
  windowWidth: number = 0;

  form: undefined;
  isSubmit: boolean;
  modoEdicion: boolean = false;
  sitiosSub?: Subscription;
  sitios: PTLSitiosAPModel[] = [];

  // constructor
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private BreadCrumb: BreadcrumbComponent,
    private registrosService: PTLEnlacesSTService,
    private sitiosService: PTLSitiosAPService,
    private translate: TranslateService,
    private layoutInitializer: LayoutInitializerService,
    private locationStrategy: LocationStrategy,
    private location: Location,
    private navigationService: NavigationService
  ) {
    this.isSubmit = false;
    GradientConfig.header_fixed_layout = true
    this.gradientConfig = GradientConfig;
    let current_url = this.location.path();
    const baseHref = this.locationStrategy.getBaseHref();

    this.navCollapsed = this.windowWidth >= 992 ? GradientConfig.isCollapse_menu : false;
    this.navCollapsedMob = false;
  }

  ngOnInit() {
    this.BreadCrumb.setBreadcrumb();
    this.consultarSitios();
    this.layoutInitializer.applyLayout();
    const appCode = localStorage.getItem('aplicacionId') || 'plataforma';
    this.menuItems = this.navigationService.getNavigationItems(appCode);
    this.route.queryParams.subscribe((params) => {
      const registroId = params['regId'];
      if (registroId) {
        this.modoEdicion = true;
        this.registrosService.getRegistroById(registroId).subscribe({
          next: (resp: any) => {
            this.FormRegistro = resp.enlace;
            console.log('respuesta componente', this.FormRegistro);
          },
          error: () => {
            Swal.fire('Error', 'No se pudo obtener el enlace', 'error');
          }
        });
      } else {
        this.modoEdicion = false;
      }
    });
  }

  consultarSitios() {
      this.sitiosSub = this.sitiosService
        .getRegistros()
        .pipe(
          tap((resp: any) => {
            if (resp.ok) {
              this.sitios = resp.sitios;
              console.log('Todos las sitios', this.sitios);
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

    onSitiochangeClick(event: any) {
    const value = event.target.value;
    const sitio = this.sitios.filter((x) => x.sitioId == value)[0];
    console.log('Id del sitio seleccionado:', value);
    console.log('datal sitio seleccionado:', sitio);
    this.FormRegistro.sitioId = sitio.sitioId;
  }

  btnGestionarRegistroClick(form: any) {
    this.isSubmit = true;
    if (!form.valid) {
      return;
    }
    if (this.modoEdicion) {
        console.log('Datos a enviar (FormRegistro):', this.FormRegistro);

      this.registrosService.putModificarRegistro(this.FormRegistro).subscribe({
        next: (resp: any) => {
          if (resp.ok) {
            Swal.fire('', this.translate.instant('PLATAFORMA.MODIFICAR'), 'success');
            this.router.navigate(['/sites/enlaces']);
          } else {
            Swal.fire('Error', resp.message || this.translate.instant('PLATAFORMA.NOMODIFICO'), 'error');
          }
        },
        error: (err: any) => {
          console.error(err);
          Swal.fire('Error', this.translate.instant('PLATAFORMA.NOMODIFICO'), 'error');
        }
      });
    } else {
      this.registrosService.postCrearRegistro(this.FormRegistro).subscribe({
        next: (resp: any) => {
          if (resp.ok) {
            Swal.fire('', this.translate.instant('PLATAFORMA.INSERTAR'), 'success');
            form.resetForm();
            this.isSubmit = false;
            this.router.navigate(['/sites/enlaces']);
          }
        },
        error: (err: any) => {
          console.error(err);
          Swal.fire('Error', this.translate.instant('PLATAFORMA.NOINSERTO'), 'error');
        }
      });
    }
  }

  btnRegresarClick() {
    this.router.navigate(['/sites/enlaces']);
  }
     toggleNav(): void {
    this.toggleSidebar.emit();
  }
}
