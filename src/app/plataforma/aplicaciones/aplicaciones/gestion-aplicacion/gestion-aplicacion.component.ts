/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { GradientConfig } from 'src/app/app-config';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { PTLAplicacionModel } from '../../../../theme/shared/_helpers/models/PTLAplicacion.model';
import { PtlAplicacionesService } from 'src/app/theme/shared/service';
import { v4 as uuidv4 } from 'uuid';
import { TranslateModule } from '@ngx-translate/core';
import { NavigationItem } from 'src/app/theme/shared/_helpers/models/Navigation.model';
import { NavigationService } from 'src/app/theme/shared/service/navigation.service';
import { NavBarComponent } from 'src/app/theme/layout/admin/nav-bar/nav-bar.component';
import { NavContentComponent } from 'src/app/theme/layout/admin/navigation/nav-content/nav-content.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-gestion-aplicacion',
  standalone: true,
  imports: [CommonModule, SharedModule, TranslateModule, NavBarComponent, NavContentComponent],
  templateUrl: './gestion-aplicacion.component.html',
  styleUrl: './gestion-aplicacion.component.scss'
})
export class GestionAplicacionComponent implements OnInit {
  @Output() toggleSidebar = new EventEmitter<void>();
  FormRegistro: PTLAplicacionModel = new PTLAplicacionModel();
  menuItems: NavigationItem[] = [];
  gradientConfig: any;
  navCollapsed: boolean = false;
  navCollapsedMob: boolean = false;
  windowWidth: number = 0;

  form: undefined;
  isSubmit: boolean = false;
  modoEdicion: boolean = false;
  codeAplicacion = uuidv4();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
   private _navigationService: NavigationService,
    private _aplicacionesService: PtlAplicacionesService
  ) {
    this.isSubmit = false;
    GradientConfig.header_fixed_layout = true;
    this.gradientConfig = GradientConfig;
    this.navCollapsed = this.windowWidth >= 992 ? GradientConfig.isCollapse_menu : false;
    this.navCollapsedMob = false;
  }

  ngOnInit() {
    this.menuItems = this._navigationService.getNavigationItems();
    this.route.queryParams.subscribe((params) => {
      const aplicacionId = params['aplicacionId'];
      if (aplicacionId) {
        console.log('me llena el Id', aplicacionId);
        this.modoEdicion = true;
        this._aplicacionesService.getAplicacionById(aplicacionId).subscribe({
          next: (resp: any) => {
            this.FormRegistro = resp.aplicacion;
            this.codeAplicacion = resp.aplicacion.codigoAplicacion;
          },
          error: () => {
            Swal.fire('Error', 'No se pudo obtener la Aplicación', 'error');
          }
        });
      } else {
        console.log('no llena el Id', aplicacionId);
        this.modoEdicion = false;
        this.FormRegistro.codigoAplicacion = uuidv4();
      }
    });
  }

  btnGestionarAplicacionClick(form: any) {
    this.isSubmit = true;
    if (!form.valid) {
      return;
    }
    if (this.modoEdicion) {
      console.log('1.0 modificar app', this.FormRegistro);
      this._aplicacionesService.actualizarAplicacion(this.FormRegistro).subscribe({
        next: (resp: any) => {
          if (resp.ok) {
            Swal.fire('', 'la Aplicación se modificó correctamente', 'success');
            this.router.navigate(['/aplicaciones/aplicaciones']);
          } else {
            Swal.fire('Error', resp.message || 'No se pudo actualizar la Aplicación', 'error');
          }
        },
        error: (err: any) => {
          console.error(err);
          Swal.fire('Error', 'No se pudo actualizar la Aplicación', 'error');
        }
      });
    } else {
      this._aplicacionesService.crearAplicacion(this.FormRegistro).subscribe({
        next: (resp: any) => {
          if (resp.ok) {
            Swal.fire('', 'La Aplicación se insertó correctamente', 'success');
            form.resetForm();
            this.isSubmit = false;
            this.router.navigate(['/aplicaciones/aplicaciones']);
          }
        },
        error: (err: any) => {
          console.error(err);
          Swal.fire('Error', 'No se pudo insertar la Aplicación', 'error');
        }
      });
    }
  }

  btnRegresarClick() {
    this.router.navigate(['/aplicaciones/aplicaciones']);
  }

  navMobClick() {
    if (this.windowWidth < 992) {
      if (this.navCollapsedMob && !document.querySelector('app-navigation.pcoded-navbar')?.classList.contains('mob-open')) {
        this.navCollapsedMob = !this.navCollapsedMob;
        setTimeout(() => {
          this.navCollapsedMob = !this.navCollapsedMob;
        }, 100);
      } else {
        this.navCollapsedMob = !this.navCollapsedMob;
      }
    }
  }

  toggleNav(): void {
    this.toggleSidebar.emit();
  }
}
