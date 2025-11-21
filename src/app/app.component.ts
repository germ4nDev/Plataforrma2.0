import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { ThemeStorageService } from './theme/shared/service/theme-storage.service';
import { PtlAplicacionesService, PTLRolesAPService, PtlusuariosRolesApService } from './theme/shared/service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(
    private router: Router,
    private themeStorage: ThemeStorageService,
    private _aplicacionesService: PtlAplicacionesService,
    private _usuariosRolesService: PtlusuariosRolesApService,
    private _rolesAPService: PTLRolesAPService
  ) {}

  ngOnInit() {
    this.router.events.subscribe((evt) => {
      if (evt instanceof NavigationEnd) {
        window.scrollTo(0, 0);
      }
    });
    this._aplicacionesService.cargarAplicaciones().subscribe(
      () => console.log('Aplicaciones cargadas y guardadas en el servicio'),
      (err) => console.error('Error al cargar aplicaciones:', err)
    );
    this._rolesAPService.cargarRegistros().subscribe(
      () => console.log('Roles cargadas y guardadas en el servicio'),
      (err) => console.error('Error al cargar roles:', err)
    );
    this._usuariosRolesService.cargarRegistros().subscribe(
      () => console.log('Usuarios Roles cargadas y guardadas en el servicio'),
      (err) => console.error('Error al cargar roles:', err)
    );
  }
}
