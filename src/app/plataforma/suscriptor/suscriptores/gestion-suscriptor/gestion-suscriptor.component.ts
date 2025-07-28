import { CommonModule, LocationStrategy, Location } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PTLSuscriptorModel } from 'src/app/theme/shared/_helpers/models/PTLSuscriptor.model';
import { BreadcrumbComponent } from 'src/app/theme/shared/components/breadcrumb/breadcrumb.component';
import { PTLSuscriptoresService } from 'src/app/theme/shared/service/ptlsuscriptores.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { v4 as uuidv4 } from 'uuid';
import Swal from 'sweetalert2';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { GradientConfig } from 'src/app/app-config';
import { NavigationItem } from 'src/app/theme/layout/admin/navigation/navigation';
import { LayoutInitializerService } from 'src/app/theme/shared/service/layout-initializer.service';
import { NavigationService } from 'src/app/theme/shared/service/navigation.service';
import { NavBarComponent } from 'src/app/theme/layout/admin/nav-bar/nav-bar.component';
import { NavContentComponent } from 'src/app/theme/layout/admin/navigation/nav-content/nav-content.component';

@Component({
  selector: 'app-gestion-suscriptor',
  standalone: true,
  imports: [CommonModule, SharedModule, TranslateModule, NavBarComponent, NavContentComponent],
  templateUrl: './gestion-suscriptor.component.html',
  styleUrl: './gestion-suscriptor.component.scss'
})
export class GestionSuscriptorComponent {
  // private props
  @Output() toggleSidebar = new EventEmitter<void>();
  FormRegistro: PTLSuscriptorModel = new PTLSuscriptorModel();
  menuItems: NavigationItem[] = [];
  gradientConfig: any;
  navCollapsed: boolean = false;
  navCollapsedMob: boolean = false;
  windowWidth: number = 0;

  form: undefined;
  isSubmit: boolean;
  modoEdicion: boolean = false;
  cosigoSusucriptor = uuidv4();

  // constructor
  constructor(
    private router: Router,
    private registrosService: PTLSuscriptoresService,
    private route: ActivatedRoute,
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
    this.layoutInitializer.applyLayout();
    const appCode = localStorage.getItem('aplicacionId') || 'plataforma';
    this.menuItems = this.navigationService.getNavigationItems(appCode);
    this.route.queryParams.subscribe((params) => {
      const registroId = params['regId'];
      if (registroId) {
        // console.log('me llena el Id', registroId);
        this.modoEdicion = true;
        this.registrosService.getRegistroById(registroId).subscribe({
          next: (resp: any) => {
            console.log('resp', resp);
            this.FormRegistro = resp.suscriptor;
            console.log('datos del FormRegistro', this.FormRegistro);
          },
          error: () => {
            Swal.fire('Error', 'No se pudo obtener el suscriptor', 'error');
          }
        });
      } else {
        this.modoEdicion = false;
      }
    });
  }

 btnGestionarRegistroClick(form: any) {
     this.isSubmit = true;
     if (!form.valid) {
       return;
     }
     if (this.modoEdicion) {
       // console.log('1.0 modificar usuario', this.FormRegistro);
       this.registrosService.putModificarRegistro(this.FormRegistro).subscribe({
         next: (resp: any) => {
           if (resp.ok) {
             Swal.fire('', this.translate.instant('PLATAFORMA.MODIFICAR'), 'success');
             this.router.navigate(['/suscriptor/suscriptores/']);
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
       // console.log('formregistro', this.FormRegistro);
       this.registrosService.postCrearRegistro(this.FormRegistro).subscribe({
         next: (resp: any) => {
           if (resp.ok) {
             Swal.fire('', this.translate.instant('PLATAFORMA.INSERTAR'), 'success');
             form.resetForm();
             this.isSubmit = false;
             this.router.navigate(['/suscriptor/suscriptores/']);
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
    this.router.navigate(['/suscriptor/suscriptores']);
  }
  toggleNav(): void {
    this.toggleSidebar.emit();
  }
}
