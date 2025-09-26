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
import { PtlSuitesAPService } from 'src/app/theme/shared/service/ptlsuites-ap.service';
import { Subscription, tap, catchError, of } from 'rxjs';
import { PTLAplicacionModel } from 'src/app/theme/shared/_helpers/models/PTLAplicacion.model';
import { LocalStorageService } from 'src/app/theme/shared/service/local-storage.service';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [NgbDropdownModule, RouterModule, ColorPickerModule, SharedModule],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.scss'
})
export class InicioComponent implements OnInit {
  public appCode: string = '';
  aplicacionesSub?: Subscription;
  aplicaciones: PTLAplicacionModel[] = [];

  constructor(
    private route: ActivatedRoute,
    private _aplicacionesService: PtlAplicacionesService,
    private _suitesService: PtlSuitesAPService,
    private _localStorage: LocalStorageService,
    private router: Router
  ) {}

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
    console.log('ingresar a', app);

    this._localStorage.setAplicacionLocalStorage(app);
    this._suitesService.geSuitesAP().subscribe((resp) => {
      const suites = resp.suites.filter((x: { codigoAplicacion: string }) => x.codigoAplicacion == app.codigoAplicacion);
      if (suites.length < 2) {
        this._localStorage.setSuiteLocalStorage(suites[0]);
        this.router.navigate(['/aplicaciones/aplicaciones']);
      } else {
        this.router.navigate(['/frontal/inicio-suites']);
      }
    });
  }
}
