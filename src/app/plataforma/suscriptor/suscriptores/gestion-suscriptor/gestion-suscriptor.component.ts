/* eslint-disable @angular-eslint/use-lifecycle-interface */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NarikCustomValidatorsModule } from '@narik/custom-validators';
import { PTLSuscriptorModel } from 'src/app/theme/shared/_helpers/models/PTLSuscriptor.model';
import { PTLSuscriptoresService } from 'src/app/theme/shared/service/ptlsuscriptores.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NavBarComponent } from 'src/app/theme/layout/admin/nav-bar/nav-bar.component';
import { NavContentComponent } from 'src/app/theme/layout/admin/navigation/nav-content/nav-content.component';
import { NavigationItem } from 'src/app/theme/layout/admin/navigation/navigation';
import { NavigationService } from 'src/app/theme/shared/service/navigation.service';
import { v4 as uuidv4 } from 'uuid';
import Swal from 'sweetalert2';
import { TextEditorComponent } from 'src/app/theme/shared/components/text-editor/text-editor.component';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-gestion-suscriptor',
  standalone: true,
  imports: [CommonModule, SharedModule, NarikCustomValidatorsModule, NavBarComponent, NavContentComponent, TextEditorComponent],
  templateUrl: './gestion-suscriptor.component.html',
  styleUrl: './gestion-suscriptor.component.scss'
})
export class GestionSuscriptorComponent {
  // private props
  @Output() toggleSidebar = new EventEmitter<void>();
  FormRegistro: PTLSuscriptorModel = new PTLSuscriptorModel();
  menuItems!: Observable<NavigationItem[]>;
  gradientConfig: any;
  navCollapsed: boolean = false;
  navCollapsedMob: boolean = false;
  windowWidth: number = 0;
  form: undefined;
  isSubmit: boolean;
  modoEdicion: boolean = false;
  cosigoSusucriptor = uuidv4();
  tipoEditorTexto = 'basica';

  // constructor
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private _suscriptoresService: PTLSuscriptoresService,
    private _navigationService: NavigationService
  ) {
    this.isSubmit = false;
  }

  ngOnInit() {
    this._navigationService.getNavigationItems();
    this.menuItems = this._navigationService.menuItems$;
    this.route.queryParams.subscribe((params) => {
      const id = params['regId'];
      console.log('me llena el Id', id);
      if (id) {
        this.modoEdicion = true;
        this._suscriptoresService.getSuscriptorById(id).subscribe({
          next: (resp: any) => {
            this.FormRegistro = resp.suscriptor;
            console.log('respuesta componente', this.FormRegistro);
          },
          error: () => {
            Swal.fire('Error', 'No se pudo obtener el suscriptor', 'error');
          }
        });
      } else {
        this.modoEdicion = false;
        this.FormRegistro.codigoSuscriptor = uuidv4();
      }
    });
  }

  actualizarDescripcionSuscriptor(nuevoContenido: string): void {
    this.FormRegistro.descripcionSuscriptor = nuevoContenido;
    console.log('Descripción de versión actualizada:', this.FormRegistro.descripcionSuscriptor);
    // if (this.validationForm && this.isSubmit) {
    // }
  }

  btnInsertEditSucriptor(form: any) {
    this.isSubmit = true;
    if (!form.valid) {
      return;
    }
    if (this.modoEdicion) {
      this._suscriptoresService.actualizarSuscriptor(this.FormRegistro).subscribe({
        next: (resp: any) => {
          if (resp.ok) {
            Swal.fire('', 'El suscriptor se modificó correctamente', 'success');
            this.router.navigate(['/suscriptor/suscriptores']);
          } else {
            Swal.fire('Error', resp.message || 'No se pudo actualizar el suscriptor', 'error');
          }
        },
        error: (err: any) => {
          console.error(err);
          Swal.fire('Error', 'No se pudo actualizar el suscriptor', 'error');
        }
      });
    } else {
      this._suscriptoresService.crearSuscriptor(this.FormRegistro).subscribe({
        next: (resp: any) => {
          if (resp.ok) {
            Swal.fire('', 'El suscriptor se insertó correctamente', 'success');
            form.resetForm();
            this.isSubmit = false;
            this.router.navigate(['/suscriptor/suscriptores']);
          }
        },
        error: (err: any) => {
          console.error(err);
          Swal.fire('Error', 'No se pudo insertar el suscriptor', 'error');
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
