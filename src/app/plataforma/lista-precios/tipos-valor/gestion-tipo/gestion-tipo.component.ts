/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { GradientConfig } from 'src/app/app-config';
import { TextEditorComponent } from 'src/app/theme/shared/components/text-editor/text-editor.component';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { v4 as uuidv4 } from 'uuid';
import { TranslateModule } from '@ngx-translate/core';
import { NavigationItem } from 'src/app/theme/shared/_helpers/models/Navigation.model';
import { NavigationService } from 'src/app/theme/shared/service/navigation.service';
import { NavBarComponent } from 'src/app/theme/layout/admin/nav-bar/nav-bar.component';
import { NavContentComponent } from 'src/app/theme/layout/admin/navigation/nav-content/nav-content.component';
import { PTLTiposValoresModel } from 'src/app/theme/shared/_helpers/models/PTLTiposValores.model';
import { PtltiposValoresService } from 'src/app/theme/shared/service/ptltipos-valores.service';
import { Observable } from 'rxjs';
import { SwalAlertService } from 'src/app/theme/shared/service';

@Component({
  selector: 'app-gestion-tipo',
  standalone: true,
  imports: [CommonModule, SharedModule, TranslateModule, NavBarComponent, NavContentComponent, TextEditorComponent],
  templateUrl: './gestion-tipo.component.html',
  styleUrl: './gestion-tipo.component.scss'
})
export class GestionTipoComponent implements OnInit {
  @Output() toggleSidebar = new EventEmitter<void>();
  FormRegistro: PTLTiposValoresModel = new PTLTiposValoresModel();
  menuItems!: Observable<NavigationItem[]>;
  gradientConfig: any;
  navCollapsed: boolean = false;
  navCollapsedMob: boolean = false;
  windowWidth: number = 0;

  form: undefined;
  isSubmit: boolean = false;
  modoEdicion: boolean = false;
  codeAplicacion = uuidv4();
  tipoEditorTexto = 'basica';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private _navigationService: NavigationService,
    private _swalAlertService: SwalAlertService,
    private _registrosService: PtltiposValoresService
  ) {
    this.isSubmit = false;
    GradientConfig.header_fixed_layout = true;
    this.gradientConfig = GradientConfig;
    this.navCollapsed = this.windowWidth >= 992 ? GradientConfig.isCollapse_menu : false;
    this.navCollapsedMob = false;
    this.route.queryParams.subscribe((params) => {
      const regId = params['regId'];
      if (regId) {
        console.log('me llena el Id', regId);
        this.modoEdicion = true;
        this._registrosService.getRegistroById(regId).subscribe({
          next: (resp: any) => {
            this.FormRegistro = resp.tipoValor;
          },
          error: () => {
            this._swalAlertService.getAlertError('No se pudo obtener el tipo valor');
          }
        });
      } else {
        console.log('no llena el Id', regId);
        this.modoEdicion = false;
      }
    });
  }

  ngOnInit() {
    this._navigationService.getNavigationItems();
    this.menuItems = this._navigationService.menuItems$;
  }

  actualizarDescripcionVersion(nuevoContenido: string): void {
    this.FormRegistro.descripcionTipo = nuevoContenido;
    console.log('Descripción de versión actualizada:', this.FormRegistro.descripcionTipo);
    // if (this.validationForm && this.isSubmit) {
    // }
  }

  btnGestionarRegistroClick(form: any) {
    this.isSubmit = true;
    if (!form.valid) {
      return;
    }
    if (this.modoEdicion) {
      console.log('1.0 modificar app', this.FormRegistro);
      this._registrosService.putModificarRegistro(this.FormRegistro).subscribe({
        next: (resp: any) => {
          if (resp.ok) {
            this._swalAlertService.getAlertSuccess('El tipo valor se modificó correctamente');
            this.router.navigate(['/lista-precios/tipos-valor']);
          } else {
            this._swalAlertService.getAlertError('No se pudo actualizar el tipo valor');
          }
        },
        error: (err: any) => {
          console.error(err);
          this._swalAlertService.getAlertError('No se pudo actualizar el tipo valor');
        }
      });
    } else {
      this._registrosService.postCrearRegistro(this.FormRegistro).subscribe({
        next: (resp: any) => {
          if (resp.ok) {
            this._swalAlertService.getAlertSuccess('El tipo valor se insertó correctamente');
            form.resetForm();
            this.isSubmit = false;
            this.router.navigate(['/lista-precios/tipos-valor']);
          }
        },
        error: (err: any) => {
          console.error(err);
          this._swalAlertService.getAlertError('No se pudo insertar el tipo valor');
        }
      });
    }
  }

  btnRegresarClick() {
    this.router.navigate(['/lista-precios/tipos-valor']);
  }

  toggleNav(): void {
    this.toggleSidebar.emit();
  }
}
