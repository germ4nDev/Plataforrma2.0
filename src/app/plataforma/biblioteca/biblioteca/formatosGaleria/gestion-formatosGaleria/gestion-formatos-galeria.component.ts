/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, EventEmitter, OnInit, OnDestroy, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { GradientConfig } from 'src/app/app-config';
import { TextEditorComponent } from 'src/app/theme/shared/components/text-editor/text-editor.component';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { LocalStorageService, SwalAlertService } from 'src/app/theme/shared/service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NavigationItem } from 'src/app/theme/shared/_helpers/models/Navigation.model';

import { PTLFormatosGaleria } from 'src/app/theme/shared/_helpers/models/PTLFormatosGaleria.model';
import { PtlFormatosGaleriaService } from 'src/app/theme/shared/service/ptlformatosgaleria.service';
import { NavigationService } from 'src/app/theme/shared/service/navigation.service';
import { NavBarComponent } from 'src/app/theme/layout/admin/nav-bar/nav-bar.component';
import { NavContentComponent } from 'src/app/theme/layout/admin/navigation/nav-content/nav-content.component';
import { Observable, Subscription } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-gestion-formatos-galeria',
  standalone: true,
  imports: [CommonModule, FormsModule, SharedModule, TranslateModule, NavBarComponent, NavContentComponent, TextEditorComponent],
  templateUrl: './gestion-formatos-galeria.component.html',
  styleUrl: './gestion-formatos-galeria.component.scss'
})
export class GestionFormatosGaleriaComponent implements OnInit, OnDestroy {
  @Output() toggleSidebar = new EventEmitter<void>();
  FormRegistro: PTLFormatosGaleria = new PTLFormatosGaleria();
  menuItems$!: Observable<NavigationItem[]>;
  gradientConfig: any;
  navCollapsed: boolean = false;
  navCollapsedMob: boolean = false;
  windowWidth: number = 0;

  isSubmit: boolean = false;
  modoEdicion: boolean = false;
  codeFormato = uuidv4();
  tipoEditorTexto = 'basica';
  lockScreenSubscription: Subscription | undefined;
  isLocked: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private translate: TranslateService,
    private _navigationService: NavigationService,
    private _localStorageService: LocalStorageService,
    private _formatosGaleriaService: PtlFormatosGaleriaService,
    private _swalService: SwalAlertService
  ) {
    this.gradientConfig = GradientConfig;
    this._navigationService.getNavigationItems();

    this.route.queryParams.subscribe((params) => {
      if (Object.keys(params).length > 0) {
        const regId = params['regId'];
        if (regId !== 'nuevo') {
          this.modoEdicion = true;
          this._formatosGaleriaService.getFormatoGaleriaById(regId).subscribe({
            next: (resp: any) => {
              this.FormRegistro = resp.formatoGaleria;
              this.codeFormato = resp.formatoGaleria.codigoFormatosGaleria;
            },
            error: () => Swal.fire('Error', 'No se pudo obtener el Formato', 'error')
          });
        }
      }
    });
  }

  ngOnInit() {
    this.menuItems$ = this._navigationService.menuItems$;
    if (this.modoEdicion == false) {
      this.FormRegistro.codigoFormatosGaleria = uuidv4();
      this.FormRegistro.estadoFormatosGaleria = true;
    }
  }

  ngOnDestroy() {
    if (this.lockScreenSubscription) this.lockScreenSubscription.unsubscribe();
  }

  actualizarDescripcionVersion(nuevoContenido: string): void {
    this.FormRegistro.descripcionFormatosGaleria = nuevoContenido;
  }

  btnGestionarFormatoClick(form: any) {
    if (this.modoEdicion) {
      this.FormRegistro.codigoUsuarioModificacion = this._localStorageService.getUsuarioLocalStorage().codigoUsuario;
      this.FormRegistro.fechaModificacion = new Date().toISOString();
      this._formatosGaleriaService.actualizarFormatoGaleria(this.FormRegistro).subscribe({
        next: (resp: any) => {
          if (resp.ok) {
            this._swalService.getAlertSuccess(this.translate.instant('FORMATOSGALERIA.UPDATESUCCSESSFULLY'));
            form.resetForm();
            this.router.navigate(['/biblioteca/formatos-galeria']);
          }
        },
        error: () => this._swalService.getAlertError('No se pudo actualizar')
      });
    } else {
      form.formatosGaleriaId = 0;
      const registroData = form.value as PTLFormatosGaleria;
      registroData.codigoFormatosGaleria = this.FormRegistro.codigoFormatosGaleria;
      registroData.descripcionFormatosGaleria = this.FormRegistro.descripcionFormatosGaleria;
      registroData.codigoUsuarioCreacion = this._localStorageService.getUsuarioLocalStorage().codigoUsuario;
      registroData.fechaCreacion = new Date().toISOString();
      registroData.codigoUsuarioModificacion = this._localStorageService.getUsuarioLocalStorage().codigoUsuario;
      registroData.fechaModificacion = new Date().toISOString();

      this._formatosGaleriaService.crearFormatoGaleria(registroData).subscribe({
        next: (resp: any) => {
          if (resp.ok) {
            this._swalService.getAlertSuccess(this.translate.instant('FORMATOSGALERIA.CREATESUCCSESSFULLY'));
            form.resetForm();
            this.router.navigate(['/biblioteca/formatos-galeria']);
          }
        },
        error: () => this._swalService.getAlertError('No se pudo crear')
      });
    }
  }

  btnRegresarClick() {
    this.router.navigate(['/biblioteca/formatos-galeria']);
  }

  toggleNav(): void {
    this.toggleSidebar.emit();
  }
}
