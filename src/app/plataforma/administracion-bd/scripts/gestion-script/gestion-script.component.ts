import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';

// Componentes del Menú Lateral
import { NavBarComponent } from 'src/app/theme/layout/admin/nav-bar/nav-bar.component';
import { NavContentComponent } from 'src/app/theme/layout/admin/navigation/nav-content/nav-content.component';
import { NavigationService } from 'src/app/theme/shared/service/navigation.service';
import { NavigationItem } from 'src/app/theme/shared/_helpers/models/Navigation.model';

// Modelos y Servicios
import { PTLScriptsService } from 'src/app/theme/shared/service/ptlscripts.service';
import { PTLTiposScriptsService } from 'src/app/theme/shared/service/ptltipos-scripts.service';
import { PTLScriptsModel } from 'src/app/theme/shared/_helpers/models/PTLScripts.model';
import { PtlAplicacionesService } from 'src/app/theme/shared/service/ptlaplicaciones.service';

@Component({
  selector: 'app-gestion-script',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, TranslateModule, NavBarComponent, NavContentComponent],
  templateUrl: './gestion-script.component.html',
  styleUrl: './gestion-script.component.scss'
})
export class GestionScriptComponent implements OnInit {
  scriptForm!: FormGroup;
  esNuevo: boolean = true;
  scriptId: string = '';
  tiposScripts: any[] = [];
  aplicaciones: any[] = [];

  // Variables para el menú lateral
  menuItems$!: Observable<NavigationItem[]>;
  @Output() toggleSidebar = new EventEmitter<void>();

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private _scriptsService: PTLScriptsService,
    private _tiposScriptsService: PTLTiposScriptsService,
    private _aplicacionesService: PtlAplicacionesService,
    private translate: TranslateService,
    private _navigationService: NavigationService
  ) {
    this.crearFormulario();
  }

  ngOnInit(): void {
    this._navigationService.getNavigationItems();
    this.menuItems$ = this._navigationService.menuItems$;

    this.cargarTiposScripts();
    this.cargarAplicaciones();

    this.route.queryParams.subscribe((params) => {
      const regId = params['regId'];
      if (params['regId'] === 'nuevo') {
        this.esNuevo = true;
        const numeroAleatorio = Math.floor(Math.random() * 10000)
          .toString()
          .padStart(4, '0');
        const codigoGenerado = `SCR-${numeroAleatorio}`;
        this.scriptForm.patchValue({
          codigoScript: codigoGenerado
        });
      } else {
        this.esNuevo = false;
        this.scriptId = regId;
        this.cargarScript(regId);
      }

      if (regId && regId !== 'nuevo') {
        this.esNuevo = false;
      }
    });
  }

  cargarAplicaciones(): void {
    this._aplicacionesService.getAplicaciones().subscribe({
      next: (resp: any) => {
        if (resp.ok) {
          this.aplicaciones = resp.aplicaciones.filter((a: any) => a.estadoAplicacion === true);
        } else if (Array.isArray(resp)) {
          this.aplicaciones = resp.filter((a: any) => a.estadoAplicacion === true);
        }
      },
      error: (err: any) => console.error('Error cargando Aplicaciones', err)
    });
  }

  crearFormulario(): void {
    this.scriptForm = this.fb.group({
      codigoScript: [{ value: '', disabled: true }],
      nombreScript: ['', [Validators.required]],
      descripcionScript: [''],
      codigoAplicacion: ['', [Validators.required]],
      codigoTipo: ['', [Validators.required]],
      estadoScript: [true, [Validators.required]]
    });
  }

  cargarTiposScripts(): void {
    this._tiposScriptsService.getRegistros().subscribe({
      next: (resp: any) => {
        if (resp.ok) {
          this.tiposScripts = resp.tiposScripts.filter((t: any) => t.estadoTipo === true);
        }
      },
      error: (err) => console.error('Error cargando Tipos de Scripts', err)
    });
  }

  cargarScript(id: string): void {
    this._scriptsService.getRegistroById(id).subscribe({
      next: (resp: any) => {
        if (resp.ok && resp.script) {
          this.scriptForm.patchValue({
            codigoScript: resp.script.codigoScript,
            nombreScript: resp.script.nombreScript,
            descripcionScript: resp.script.descripcionScript,
            codigoAplicacion: resp.script.codigoAplicacion,
            codigoTipo: resp.script.codigoTipo,
            estadoScript: resp.script.estadoScript
          });
          this.scriptForm.get('codigoScript')?.disable();
        }
      },
      error: () => {
        Swal.fire('Error', 'No se pudo cargar la información del script', 'error');
        this.volver();
      }
    });
  }

  guardar(): void {
    if (this.scriptForm.invalid) {
      Object.values(this.scriptForm.controls).forEach((control) => control.markAsTouched());
      return;
    }

    const scriptData: PTLScriptsModel = {
      ...this.scriptForm.getRawValue(),
      codigoUsuarioCreacion: 'ADMIN',
      fechaCreacion: new Date().toISOString(),
      codigoUsuarioModificacion: 'ADMIN',
      fechaModificacion: new Date().toISOString()
    };

    if (this.esNuevo) {
      this._scriptsService.postCrearRegistro(scriptData).subscribe({
        next: () => {
          Swal.fire('Éxito', 'Script creado correctamente', 'success');
          this.volver();
        },
        error: (err) => {
          console.error(err);
          Swal.fire('Error', 'Ocurrió un error al crear el script', 'error');
        }
      });
    } else {
      this._scriptsService.putModificarRegistro(scriptData).subscribe({
        next: () => {
          Swal.fire('Éxito', 'Script actualizado correctamente', 'success');
          this.volver();
        },
        error: (err) => {
          console.error(err);
          Swal.fire('Error', 'Ocurrió un error al actualizar el script', 'error');
        }
      });
    }
  }

  volver(): void {
    this.router.navigate(['/administracion-bd/scripts']);
  }

  campoNoValido(campo: string): boolean {
    return this.scriptForm.get(campo)?.invalid && this.scriptForm.get(campo)?.touched ? true : false;
  }

  // Función para abrir/cerrar el menú lateral
  toggleNav(): void {
    this.toggleSidebar.emit();
  }
}
