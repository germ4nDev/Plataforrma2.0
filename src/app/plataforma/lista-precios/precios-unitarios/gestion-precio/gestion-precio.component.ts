/* eslint-disable @angular-eslint/use-lifecycle-interface */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, Observable, of, Subscription, tap } from 'rxjs';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { GradientConfig } from 'src/app/app-config';
import { NavBarComponent } from 'src/app/theme/layout/admin/nav-bar/nav-bar.component';
import { NavContentComponent } from 'src/app/theme/layout/admin/navigation/nav-content/nav-content.component';
import { NavigationItem } from 'src/app/theme/layout/admin/navigation/navigation';
import { LayoutInitializerService } from 'src/app/theme/shared/service/layout-initializer.service';
import { NavigationService } from 'src/app/theme/shared/service/navigation.service';
import { v4 as uuidv4 } from 'uuid';
import { TextEditorComponent } from 'src/app/theme/shared/components/text-editor/text-editor.component';
import { PTLTiposValoresModel } from 'src/app/theme/shared/_helpers/models/PTLTiposValores.model';
import { PTLValoresUnitarios } from 'src/app/theme/shared/_helpers/models/PTLValoresUnitarios.model';
import { PtlvaloresUnitariosService } from 'src/app/theme/shared/service/ptlvalores-unitarios.service';
import { PtltiposValoresService } from 'src/app/theme/shared/service/ptltipos-valores.service';
import { SwalAlertService } from 'src/app/theme/shared/service';

@Component({
  selector: 'app-gestion-precio',
  standalone: true,
  imports: [CommonModule, SharedModule, TranslateModule, NavBarComponent, NavContentComponent, TextEditorComponent],
  templateUrl: './gestion-precio.component.html',
  styleUrl: './gestion-precio.component.scss'
})
export class GestionPrecioComponent implements OnInit {
  // private props
  @Output() toggleSidebar = new EventEmitter<void>();
  FormRegistro: PTLValoresUnitarios = new PTLValoresUnitarios();
  menuItems!: Observable<NavigationItem[]>;
  gradientConfig: any;
  navCollapsed: boolean = false;
  navCollapsedMob: boolean = false;
  windowWidth: number = 0;
  form: undefined;
  isSubmit: boolean;
  valorUnitarioId: number = 9;
  modoEdicion: boolean = false;
  tiposValorSub?: Subscription;
  tiposValor: PTLTiposValoresModel[] = [];
  valoresUnitariosSub?: Subscription;
  valoresUnitarios: PTLValoresUnitarios[] = [];
  tipoEditorTexto = 'basica';

  // constructor
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private translate: TranslateService,
    private _registrosService: PtlvaloresUnitariosService,
    private _tiposValorService: PtltiposValoresService,
    private _layoutInitializer: LayoutInitializerService,
    private _swalAlertService: SwalAlertService,
    private _navigationService: NavigationService
  ) {
    this.isSubmit = false;
    GradientConfig.header_fixed_layout = true;
    this.gradientConfig = GradientConfig;

    this.navCollapsed = this.windowWidth >= 992 ? GradientConfig.isCollapse_menu : false;
    this.navCollapsedMob = false;
    this.route.queryParams.subscribe((params) => {
      this.valorUnitarioId = params['regId'];
      if (this.valorUnitarioId) {
        this.modoEdicion = true;
        this._registrosService.getRegistroById(this.valorUnitarioId).subscribe({
          next: (resp: any) => {
            this.FormRegistro = resp.valorUnitario;
          },
          error: (err) => {
            this._swalAlertService.getAlertError('No se pudo obtener el precio unitario por ' + err);
          }
        });
      } else {
        this.FormRegistro.codigoValor = uuidv4();
        this.modoEdicion = false;
      }
    });
  }

  ngOnInit() {
    this._navigationService.getNavigationItems();
    this.menuItems = this._navigationService.menuItems$;
    this.consultarTiposValor();
    this._layoutInitializer.applyLayout();
  }

  consultarTiposValor() {
    console.log('1');
    this.tiposValorSub = this._tiposValorService
      .getRegistros()
      .pipe(
        tap((resp: any) => {
          if (resp.ok) {
            console.log('tipos valor', resp);
            this.tiposValor = resp.tiposValor;
          }
        }),
        catchError((err) => {
          console.error(err);
          return of([]);
        })
      )
      .subscribe();
  }

  onTipoValorChangeClick(event: any) {
    const value = event.target.value;
    const reg = this.valoresUnitarios.filter((x) => x.tipoValorId == value)[0];
    this.FormRegistro.tipoValorId = reg.tipoValorId || 0;
  }

  actualizarDescripcionVersion(nuevoContenido: string): void {
    this.FormRegistro.descripcionValor = nuevoContenido;
    console.log('Descripción de versión actualizada:', this.FormRegistro.descripcionValor);
    // if (this.validationForm && this.isSubmit) {
    // }
  }

  btnGestionarRegistroClick(form: any) {
    this.isSubmit = true;
    if (!form.valid) {
      return;
    }
    if (this.modoEdicion) {
      this._registrosService.putModificarRegistro(this.FormRegistro, this.valorUnitarioId).subscribe({
        next: (resp: any) => {
          if (resp.ok) {
            this._swalAlertService.getAlertSuccess(this.translate.instant('PLATAFORMA.MODIFICAR'));
            this.router.navigate(['/lista-precios/precios-unitarios']);
          } else {
            this._swalAlertService.getAlertError(resp.message || this.translate.instant('PLATAFORMA.NOMODIFICO'));
          }
        },
        error: (err: any) => {
          console.error(err);
          this._swalAlertService.getAlertError(this.translate.instant('PLATAFORMA.NOMODIFICO'));
        }
      });
    } else {
      this._registrosService.postCrearRegistro(this.FormRegistro).subscribe({
        next: (resp: any) => {
          if (resp.ok) {
            this._swalAlertService.getAlertSuccess(this.translate.instant('PLATAFORMA.INSERTAR'));
            form.resetForm();
            this.isSubmit = false;
            this.router.navigate(['/lista-precios/precios-unitarios']);
          }
        },
        error: (err: any) => {
          console.error(err);
          this._swalAlertService.getAlertError(this.translate.instant('PLATAFORMA.NOINSERTO'));
        }
      });
    }
  }

  btnRegresarClick() {
    this.router.navigate(['/lista-precios/precios-unitarios']);
  }

  toggleNav(): void {
    this.toggleSidebar.emit();
  }
}
