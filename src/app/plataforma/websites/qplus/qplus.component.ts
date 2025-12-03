import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { LocalStorageService, UploadFilesService } from 'src/app/theme/shared/service';

@Component({
  selector: 'app-qplus',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './qplus.component.html',
  styleUrl: './qplus.component.scss'
})
export class QplusComponent implements OnInit {
  suscPlataforma: string = '';
  LogoQplus: string = '';
  carrusel1: string = '';
  carrusel2: string = '';
  carrusel3: string = '';
  carrusel4: string = '';
  carrusel5: string = '';
  videoInicio: string = '';
  qplusSG: string = '';
  qplusVD: string = '';
  qplusTH: string = '';

  /*
  Caract-1.png
La_nube2.png
Multiempresa.png
Equipo_1.png
Logo_D&M.png
  logo_Protecnica.png
logoquimicalider.png
logonutresol.png
logo_Comfandi3.jpg
logo_SOS.png
logo_gangana.png
logo_Suchance.png
logoreditos.png
logoproductecnica.png
logo_Protecnica.png
logoquimicalider.png
logonutresol.png
logo_Comfandi3.jpg
logo_SOS.png
logo_gangana.png
logo_Suchance.png
logoreditos.png
logoproductecnica.png
  */

  constructor(
    private _localStorageService: LocalStorageService,
    private _uploadService: UploadFilesService
  ) {}

  ngOnInit(): void {
    console.log('Qplus Website iniciado correctamente');
    this.suscPlataforma = this._localStorageService.getSuscriptorPlataformaLocalStorage();
    this.LogoQplus = this._uploadService.getFilePath(this.suscPlataforma, 'qplus10', 'logo_Qplus2.jpg');
    this.carrusel1 = this._uploadService.getFilePath(this.suscPlataforma, 'qplus10carrusel', '1.png');
    this.carrusel2 = this._uploadService.getFilePath(this.suscPlataforma, 'qplus10carrusel', '2.png');
    this.carrusel3 = this._uploadService.getFilePath(this.suscPlataforma, 'qplus10carrusel', '3.png');
    this.carrusel4 = this._uploadService.getFilePath(this.suscPlataforma, 'qplus10carrusel', '4.png');
    this.carrusel5 = this._uploadService.getFilePath(this.suscPlataforma, 'qplus10carrusel', '5.png');
    this.videoInicio = this._uploadService.getFilePath(this.suscPlataforma, 'qplus10', 'Qplus 2024- Corto.mp4');
    this.qplusSG = this._uploadService.getFilePath(this.suscPlataforma, 'qplus10', 'SG_Qplus.png');
    this.qplusVD = this._uploadService.getFilePath(this.suscPlataforma, 'qplus10', 'VD_Qplus.png');
    this.qplusTH = this._uploadService.getFilePath(this.suscPlataforma, 'qplus10', 'TH_Qplus.png');
  }
}
