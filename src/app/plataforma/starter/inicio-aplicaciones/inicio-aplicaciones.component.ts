/* eslint-disable @typescript-eslint/no-explicit-any */
// angular import
import { Component, OnInit } from '@angular/core';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { RouterModule } from '@angular/router';
import { Router, ActivatedRoute } from '@angular/router';

// bootstrap import
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

// third party
import { ColorPickerModule } from 'ngx-color-picker';
import { PtlAplicacionesService } from 'src/app/theme/shared/service';
import { Subscription, tap, catchError, of } from 'rxjs';
import { PTLAplicacionModel } from 'src/app/theme/shared/_helpers/models/PTLAplicacion.model';
import { LocalStorageService } from 'src/app/theme/shared/service/local-storage.service';
import { LanguageSelectorComponent } from 'src/app/theme/shared/components/language-selector/language-selector.component';
import { environment } from 'src/environments/environment';
import { FullScreenSliderComponent } from 'src/app/theme/shared/components/fullscreen-slider/fullscreen-slider.component';

const base_url = environment.apiUrl;

@Component({
  selector: 'app-inicio-aplicaciones',
  standalone: true,
  imports: [NgbDropdownModule, RouterModule, ColorPickerModule, SharedModule, LanguageSelectorComponent, FullScreenSliderComponent],
  templateUrl: './inicio-aplicaciones.component.html',
  styleUrl: './inicio-aplicaciones.component.scss'
})
export class InicioAplicacionesComponent implements OnInit {
  public appCode: string = '';
  aplicacionesSub?: Subscription;
  aplicaciones: PTLAplicacionModel[] = [];
  suscriptor: string = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private _aplicacionesService: PtlAplicacionesService,
    private _localStorageService: LocalStorageService,
  ) {
    // const suscriptor = this._localStorageService.getSuscriptorLocalStorage();
    // if (suscriptor) {
    //   this.suscriptor = this._localStorageService.getSuscriptorLocalStorage()?.codigoSuscriptor || '';
    //   console.log('datos del suscriptor', suscriptor);
    // } else {
      this.suscriptor = this._localStorageService.getSuscriptorPlataformaLocalStorage();
      console.log('no hay suscriptor suscriptor');
    // }
  }

  ngOnInit(): void {
    console.log('ingresa a la plataforma');
    this.consultarAplicaciones();
  }

  consultarAplicaciones() {
    this.aplicacionesSub = this._aplicacionesService
      .getAplicaciones()
      .pipe(
        tap((resp: any) => {
          if (resp.ok) {
            resp.aplicaciones.forEach((app: any) => {
              // app.imagenInicio = this._uploadService.getFilePath('aplicaciones', app.imagenInicio);
              app.imagenInicio = `${base_url}/upload/${this.suscriptor}/aplicaciones/${app.imagenInicio}`;
            });
            console.log('aplicaciones', resp.aplicaciones);
            this.aplicaciones = resp.aplicaciones;
          }
        }),
        catchError((err) => {
          console.error(err);
          return of([]);
        })
      )
      .subscribe();
  }

  ingresarPlataforma(app: PTLAplicacionModel) {
    //TODO Validar las aplicaciones con los suscriptores y los usuarios
    this._localStorageService.setAplicacionLocalStorage(app);
    // this._localStorageService.setNavSettingsLocalStorage(navSettings);
    this.router.navigate(['/starter/inicio-suites']);
  }
}
