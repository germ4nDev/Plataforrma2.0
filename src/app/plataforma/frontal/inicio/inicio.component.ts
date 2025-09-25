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

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [NgbDropdownModule, RouterModule, ColorPickerModule, SharedModule],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.scss'
})
export class InicioComponent implements OnInit {
  public appCode: string = '';

  constructor(
    private route: ActivatedRoute,
    private _aplicacionesService: PtlAplicacionesService,
    private _suitesService: PtlSuitesAPService,
    private router: Router
  ) {}

  ngOnInit(): void {
    console.log('ingresa a la plataforma');
  }

  ingresarPlataforma() {
    this.appCode = 'e1a8fa99-15db-479b-a0a4-9c2be72273b5';
    this._aplicacionesService.getAplicacionByCode(this.appCode).subscribe((app) => {
      localStorage.setItem('aplicacion', JSON.stringify(app.aplicacion));
    });
    this._suitesService.geSuitesAP().subscribe((resp) => {
      const suite = resp.suites.filter((x: { codigoAplicacion: string }) => x.codigoAplicacion == this.appCode)[0];
      localStorage.setItem('suite', JSON.stringify(suite));
    });
    this.router.navigate(['/aplicaciones/aplicaciones']);
  }
}
