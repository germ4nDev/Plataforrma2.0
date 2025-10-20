/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { ColorPickerModule } from 'ngx-color-picker';
import { Subscription, tap, catchError, of } from 'rxjs';
import { PTLAplicacionModel } from 'src/app/theme/shared/_helpers/models/PTLAplicacion.model';
import { PTLSuiteAPModel } from 'src/app/theme/shared/_helpers/models/PTLSuiteAP.model';
import { LocalStorageService } from 'src/app/theme/shared/service/local-storage.service';
import { PtlSuitesAPService } from 'src/app/theme/shared/service/ptlsuites-ap.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { LanguageSelectorComponent } from 'src/app/theme/shared/components/language-selector/language-selector.component';
import { environment } from 'src/environments/environment';
import { FullScreenSliderComponent } from "src/app/theme/shared/components/fullscreen-slider/fullscreen-slider.component";

const base_url = environment.apiUrl;

@Component({
  selector: 'app-launcher',
  standalone: true,
  imports: [NgbDropdownModule, RouterModule, ColorPickerModule, SharedModule, LanguageSelectorComponent, FullScreenSliderComponent],
  templateUrl: './launcher.component.html',
  styleUrl: './launcher.component.scss'
})
export class LauncherComponent implements OnInit {
  nomAplicacion: string = '';
  app: PTLAplicacionModel = new PTLAplicacionModel();
  suitesSub?: Subscription;
  suites: PTLSuiteAPModel[] = [];

  constructor(
    private router: Router,
    private _localStorage: LocalStorageService,
    private _suitesService: PtlSuitesAPService
  ) {}

  ngOnInit(): void {
    this.app = this._localStorage.getAplicaicionLocalStorage();
    console.log('aplicacion storage', this.app);
    this.nomAplicacion = this.app.nombreAplicacion || '';
    this.consultarSuites();
  }

  consultarSuites() {
    this.suitesSub = this._suitesService
      .geSuitesAP()
      .pipe(
        tap((resp: any) => {
          if (resp.ok) {
            resp.suites.forEach((suite: any) => {
              // suite.imagenInicio = this._uploadService.getFilePath('aplicaciones', suite.imagenInicio);
              suite.imagenInicio = `${base_url}/upload/suites/${suite.imagenInicio}`;
            });
            console.log('aplicaciones', resp.aplicaciones);
            this.suites = resp.suites;
          }
        }),
        catchError((err) => {
          console.error(err);
          return of([]);
        })
      )
      .subscribe();
  }

  ingresaSuiteaplicacion(suite: PTLSuiteAPModel) {
    console.log('ingresar a la suite', suite);
    this._localStorage.setSuiteLocalStorage(suite);
    this.router.navigate([suite.rutaInicio]);
    // this._suitesService.geSuitesAP().subscribe((resp) => {
    //   const suites = resp.suites.filter((x: { codigoAplicacion: string }) => x.codigoAplicacion == app.codigoAplicacion);
    //   if (suites.length < 2) {
    //     this._localStorage.setSuiteLocalStorage(suites[0]);
    //   } else {
    //     this.router.navigate(['/frontal/inicio-suites']);
    //   }
    // });
  }
}
