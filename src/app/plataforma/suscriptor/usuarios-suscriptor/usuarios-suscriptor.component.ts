import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Observable, combineLatest, of } from 'rxjs';
import { map, startWith, catchError, tap } from 'rxjs/operators';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { PTLUsuariosService } from 'src/app/theme/shared/service/ptlusuarios.service';
import { DatatableComponent } from 'src/app/theme/shared/components/data-table/data-table.component';
import { NavBarComponent } from 'src/app/theme/layout/admin/nav-bar/nav-bar.component';
import { NavContentComponent } from 'src/app/theme/layout/admin/navigation/nav-content/nav-content.component';
import { NavigationService } from 'src/app/theme/shared/service/navigation.service';
import { NavigationItem } from 'src/app/theme/shared/_helpers/models/Navigation.model';

@Component({
  selector: 'app-usuarios-suscriptor',
  standalone: true,
  imports: [CommonModule, SharedModule, TranslateModule, DatatableComponent, NavBarComponent, NavContentComponent],
  templateUrl: './usuarios-suscriptor.component.html',
  styleUrl: './usuarios-suscriptor.component.scss'
})
export class UsuariosSuscriptorComponent implements OnInit {
  // Estado de la UI
  activeTab: 'menu' | 'filters' = 'filters';
  menuItems!: Observable<NavigationItem[]>;
  suscriptorId: string = '';

  // Fuente de datos principal
  private usuariosSubject = new BehaviorSubject<any[]>([]);
  usuariosFiltrados$!: Observable<any[]>;

  // Subjects para filtros
  private filtroNombreSubject = new BehaviorSubject<string>('');
  private filtroEstadoSubject = new BehaviorSubject<string>('todos');

  // Configuración de columnas (Basado en tu imagen de la BD)
  columnasUsuarios = [
    { name: 'colCodigoUsuario', header: 'USUARIOS.CODIGO_USUARIO', type: 'text' },
    { name: 'colCodigoUsuarioSC', header: 'USUARIOS.CODIGO_SC', type: 'text' },
    { name: 'nomEstado', header: 'PLATAFORMA.STATUS', type: 'estado' }
  ];

  constructor(
    private _usuariosService: PTLUsuariosService,
    private _navigationService: NavigationService,
    private route: ActivatedRoute,
    private router: Router,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    // 1. Cargar menú lateral
    this._navigationService.getNavigationItems();
    this.menuItems = this._navigationService.menuItems$;

    // 2. Escuchar cambios en la URL
    this.route.queryParams.subscribe((params) => {
      this.suscriptorId = params['suscriptorId'];
      if (this.suscriptorId) {
        this.cargarDatos();
      }
    });

    // 3. Configurar el stream de filtrado (Esto corre una sola vez y reacciona a los cambios)
    this.usuariosFiltrados$ = combineLatest([this.usuariosSubject, this.filtroNombreSubject, this.filtroEstadoSubject]).pipe(
      map(([usuarios, nombre, estado]) => {
        return usuarios.filter((u) => {
          const cumpleNombre = !nombre || (u.colCodigoUsuario || '').toLowerCase().includes(nombre.toLowerCase());
          const cumpleEstado = estado === 'todos' || String(u.estadoUsuario) === estado;
          return cumpleNombre && cumpleEstado;
        });
      })
    );
  }

  cargarDatos() {
    this._usuariosService.obtenerUsuariosPorSuscriptor(this.suscriptorId).subscribe({
      next: (res: any) => {
        let lista = [];

        // Normalización para que siempre sea un array (incluso si viene un objeto único)
        if (Array.isArray(res)) {
          lista = res;
        } else if (res && res.usuarios) {
          lista = res.usuarios;
        } else if (res && typeof res === 'object' && res.usuarioSCId) {
          lista = [res];
        }

        // Mapeo de campos de la BD a la Grilla
        const datosMapeados = lista.map((u: any) => ({
          ...u,
          idParaTabla: u.usuarioSCId, // El '1' de tu imagen
          colCodigoUsuario: u.codigoUsuario,
          colCodigoUsuarioSC: u.codigoUsuarioSC,
          nomEstado: u.estadoUsuario === true || u.estadoUsuario === 'True' ? 'Activo' : 'Inactivo'
        }));

        this.usuariosSubject.next(datosMapeados);
      },
      error: (err) => {
        console.error('Error al traer usuarios:', err);
        this.usuariosSubject.next([]);
      }
    });
  }

  // --- Eventos de Interfaz ---

  onFiltroNombreChange(event: any) {
    this.filtroNombreSubject.next(event.target.value || '');
  }

  onFiltroEstadoChange(event: any) {
    this.filtroEstadoSubject.next(event.target.value || 'todos');
  }

  OnNuevoRegistroClick() {
    this.router.navigate(['/suscriptor/gestion-usuario'], {
      queryParams: { suscriptorId: this.suscriptorId, regId: 'nuevo' }
    });
  }

  OnEditarRegistroClick(event: any) {
    const id = event.id || event;
    this.router.navigate(['/suscriptor/gestion-usuario'], { queryParams: { regId: id } });
  }

  OnEliminarRegistroClick(event: any) {
    console.log('Eliminar usuario:', event.id || event);
  }

  toggleNav() {}
}
