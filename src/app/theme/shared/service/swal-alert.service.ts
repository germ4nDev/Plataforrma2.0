/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class SwalAlertService {
    settings: any = '';

  constructor(private _localStorageService: LocalStorageService) {
    this.settings = this._localStorageService.getThemeSettings();
   }

  getAlertConfirmError(descripcion: string) {
    Swal.fire({
      position: 'center',
      icon: 'error',
      title: descripcion,
      showConfirmButton: true,
      confirmButtonColor: this.settings.navbarColor,
    })
  }

  getAlertConfirmSuccess(descripcion: string) {
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: descripcion,
      showConfirmButton: true,
      confirmButtonColor: this.settings.navbarColor,
    })
  }

  // modificable
  getAlertConfirmWarning(descripcion: string) {
    const listadoIncidencias = descripcion
        .split('\n') // Divide las incidencias en líneas
        .map(incidencia => `<li>${incidencia}</li>`) // Envuelve cada línea en <li>
        .join(''); // Une todas las líneas en una cadena

    Swal.fire({
        position: 'center',
        icon: 'warning',
        title: 'Advertencia',
        html: `<ul style="list-style-type: disc; margin: 0; padding-left: 20px; text-align: left;">${listadoIncidencias}</ul>`,
        showConfirmButton: true,
        confirmButtonColor: this.settings.navbarColor,
    });
}



  getAlertError(descripcion: string) {
    Swal.fire({
      position: 'center',
      icon: 'error',
      title: descripcion,
      showConfirmButton: false,
      confirmButtonColor: this.settings.navbarColor,
      timer: 9000
    })
  }

  getAlertSuccess(descripcion: string) {
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: descripcion,
      showConfirmButton: false,
      confirmButtonColor: this.settings.navbarColor,
      timer: 9000
    })
  }

  getAlertInfo(descripcion: string) {
    Swal.fire({
      position: 'center',
      icon: 'info',
      title: descripcion,
      showConfirmButton: false,
      confirmButtonColor: this.settings.navbarColor,
      timer: 9000
    })
  }

  getAlertWarning(descripcion: string) {
    Swal.fire({
      position: 'center',
      icon: 'warning',
      title: descripcion,
      showConfirmButton: false,
      confirmButtonColor: this.settings.navbarColor,
      timer: 9000
    })
  }

  getAlertQuestion(descripcion: string) {
    Swal.fire({
      position: 'center',
      icon: 'question',
      title: descripcion,
      showConfirmButton: false,
      confirmButtonColor: this.settings.navbarColor,
      timer: 9000
    })
  }

  getAlertQuestionRequest(descripcion: string, confirmButtonText: string, denyButtonText: string) {
  return Swal.fire({
      title: descripcion,
      showDenyButton: true,
      confirmButtonText: confirmButtonText,
      confirmButtonColor: this.settings.navbarColor,
      denyButtonText: denyButtonText
    }).then(result => {
      if (result.isConfirmed) {
       return true;
      }
      return false;
    });
  }

}
