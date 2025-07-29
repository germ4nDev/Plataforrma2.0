import { CommonModule, LocationStrategy, Location } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subscription, tap, catchError, of } from 'rxjs';
import { GradientConfig } from 'src/app/app-config';
import { NavBarComponent } from 'src/app/theme/layout/admin/nav-bar/nav-bar.component';
import { NavContentComponent } from 'src/app/theme/layout/admin/navigation/nav-content/nav-content.component';
import { NavigationItem } from 'src/app/theme/layout/admin/navigation/navigation';
import { PTLEmpresasSCModel } from 'src/app/theme/shared/_helpers/models/PTLEmpresaSC.model';
import { PTLSuscriptorModel } from 'src/app/theme/shared/_helpers/models/PTLSuscriptor.model';
import { BreadcrumbComponent } from 'src/app/theme/shared/components/breadcrumb/breadcrumb.component';
import { LayoutInitializerService } from 'src/app/theme/shared/service/layout-initializer.service';
import { NavigationService } from 'src/app/theme/shared/service/navigation.service';
import { PTLEmpresasSCService } from 'src/app/theme/shared/service/ptlempresas-sc.service';
import { PTLSuscriptoresService } from 'src/app/theme/shared/service/ptlsuscriptores.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-gestion-empresa',
  standalone: true,
  imports: [CommonModule, SharedModule, TranslateModule, NavBarComponent, NavContentComponent],
  templateUrl: './gestion-empresa.component.html',
  styleUrl: './gestion-empresa.component.scss'
})
export class GestionEmpresaComponent {

    @Output() toggleSidebar = new EventEmitter<void>();
    FormRegistro: PTLEmpresasSCModel = new PTLEmpresasSCModel();
    menuItems: NavigationItem[] = [];
    gradientConfig: any;
    navCollapsed: boolean = false;
    navCollapsedMob: boolean = false;
    windowWidth: number = 0;

    form: undefined;
    isSubmit: boolean;
    modoEdicion: boolean = false;
    suscriptoresSub?: Subscription;
    suscriptores: PTLSuscriptorModel[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private registrosService: PTLEmpresasSCService,
    private suscriptoresService: PTLSuscriptoresService,
    private BreadCrumb: BreadcrumbComponent,
    private layoutInitializer: LayoutInitializerService,
    private locationStrategy: LocationStrategy,
    private location: Location,
    private navigationService: NavigationService,
    private translate: TranslateService
  ) {
    this.isSubmit = false;
    GradientConfig.header_fixed_layout = true;
    this.gradientConfig = GradientConfig;
    let current_url = this.location.path();
    const baseHref = this.locationStrategy.getBaseHref();

    this.navCollapsed = this.windowWidth >= 992 ? GradientConfig.isCollapse_menu : false;
    this.navCollapsedMob = false;
  }

  ngOnInit() {
    this.BreadCrumb.setBreadcrumb();
    this.consultarSuscriptores();
    this.layoutInitializer.applyLayout();
    const appCode = localStorage.getItem('aplicacionId') || 'plataforma';
    this.menuItems = this.navigationService.getNavigationItems(appCode);
    this.route.queryParams.subscribe((params) => {
      const registroId = params['regId'];
      if (registroId) {
        this.modoEdicion = true;
        this.registrosService.getRegistroById(registroId).subscribe({
          next: (resp: any) => {
            this.FormRegistro = resp.empresa;
            console.log('respuesta componente', this.FormRegistro);
          },
          error: () => {
            Swal.fire('Error', 'No se pudo obtener el contenido', 'error');
          }
        });
      } else {
        this.modoEdicion = false;
      }
    });
  }

  consultarSuscriptores() {
    this.suscriptoresSub = this.suscriptoresService
      .getRegistros()
      .pipe(
        tap((resp: any) => {
          if (resp.ok) {
            this.suscriptores = resp.suscriptores;
            console.log('Todos los suscriptores', this.suscriptores);
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

  onSuscriptorChangeClick(event: any) {
    const value = event.target.value;
    const suscriptor = this.suscriptores.filter((x) => x.suscriptorId == value)[0];
    console.log('Id del suscriptor seleccionado:', value);
    console.log('datal suscriptor seleccionado:', suscriptor);
    this.FormRegistro.suscriptorId = suscriptor.suscriptorId;
  }

  btnGestionarRegistroClick(form: any) {
    this.isSubmit = true;

    if (!form.valid) {
      return;
    }

    if (this.modoEdicion) {
      this.registrosService.putModificarRegistro(this.FormRegistro).subscribe({
        next: (resp: any) => {
          if (resp.ok) {
            Swal.fire('', this.translate.instant('PLATAFORMA.MODIFICAR'), 'success');
            this.router.navigate(['/suscriptor/empresas']);
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
            this.router.navigate(['/suscriptor/empresas']);
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
    this.router.navigate(['/suscriptor/empresas']);
  }
  toggleNav(): void {
    this.toggleSidebar.emit();
  }
}

