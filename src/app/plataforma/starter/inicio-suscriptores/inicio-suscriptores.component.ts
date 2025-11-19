/* eslint-disable @typescript-eslint/no-explicit-any */
// angular import
import { Component, OnInit } from '@angular/core';

// project import
import { RouterModule } from '@angular/router';
import { Router, ActivatedRoute } from '@angular/router';

// bootstrap import
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

// third party
import { ColorPickerModule } from 'ngx-color-picker';
import { Subscription, tap, catchError, of } from 'rxjs';
// import { PTLAplicacionModel } from 'src/app/theme/shared/_helpers/models/PTLAplicacion.model';
// import { PTLModuloAP } from 'src/app/theme/shared/_helpers/models/PTLModuloAP.model';
// import { PTLSuiteAPModel } from 'src/app/theme/shared/_helpers/models/PTLSuiteAP.model';
import { PTLSuscriptorModel } from 'src/app/theme/shared/_helpers/models/PTLSuscriptor.model';
import { FullScreenSliderComponent } from 'src/app/theme/shared/components/fullscreen-slider/fullscreen-slider.component';
import { LanguageSelectorComponent } from 'src/app/theme/shared/components/language-selector/language-selector.component';
import { PTLSuscriptoresService, PtlSuitesAPService, UploadFilesService, LocalStorageService } from 'src/app/theme/shared/service';
import { SharedModule } from 'src/app/theme/shared/shared.module';
// import { environment } from 'src/environments/environment';

// const base_url = environment.apiUrl;

@Component({
  selector: 'app-inicio-suscriptores',
  standalone: true,
  imports: [NgbDropdownModule, RouterModule, ColorPickerModule, SharedModule, LanguageSelectorComponent, FullScreenSliderComponent],
  templateUrl: './inicio-suscriptores.component.html',
  styleUrl: './inicio-suscriptores.component.scss'
})
export class InicioSuscriptoresComponent implements OnInit {
  public suscCode: string = '';
  suscriptoresSub?: Subscription;
  suscriptores: PTLSuscriptorModel[] = [];
  suscriptor: string = '';

  constructor(
    private route: ActivatedRoute,
    private _suscriptoresService: PTLSuscriptoresService,
    private _suitesService: PtlSuitesAPService,
    private _uploadService: UploadFilesService,
    private _localStorageService: LocalStorageService,
    private router: Router
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
    this.suscriptoresSub = this._suscriptoresService
      .getSuscriptores()
      .pipe(
        tap((resp: any) => {
          if (resp.ok) {
            resp.suscriptores.forEach((susc: any) => {
              // susc.imagenInicio = this._uploadService.getFilePath('suscriptores', susc.imagenInicio);
              susc.logoSusucriptor = this._uploadService.getFilePath(this.suscriptor, 'suscriptores', susc.logoSusucriptor);
              //   susc.logoSusucriptor = `${base_url}/upload/${this.suscriptor}/suscriptores/${susc.logoSusucriptor}`;
            });
            console.log('suscriptores', resp.suscriptores);
            this.suscriptores = resp.suscriptores;
          }
        }),
        catchError((err) => {
          console.error(err);
          return of([]);
        })
      )
      .subscribe();
  }

  ingresarPlataforma(susc: PTLSuscriptorModel) {
    //TODO Validar las suscriptores con los suscriptores y los usuarios
    console.log('ingresar a', susc);
    this._localStorageService.setSuscriptorLocalStorage(susc);
    this.router.navigate(['/starter/inicio-aplicaciones']);
  }
}
