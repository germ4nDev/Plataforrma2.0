/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { ThemeService } from './theme.service'; // Importa tu ThemeService
import Swal, { SweetAlertOptions } from 'sweetalert2';
// import '@sweetalert2/theme-dark/dark.css'

@Injectable({
  providedIn: 'root'
})
export class SwalAlertService {
  private isDarkTheme: boolean = false;

  constructor(private themeService: ThemeService) {
    // Suscribirse a los cambios de tema
    this.themeService.isDarkTheme$.subscribe((isDark) => {
      this.isDarkTheme = isDark;
    });
  }

  getSwalCustomClass() {
    if (!this.isDarkTheme) {
      return {
        container: 'swal2-light-theme-container',
        popup: 'custom-popup-class swal2-light-mode-custom',
        confirmButton: 'btn btn-primary-light',
        denyButton: 'btn btn-secondary'
      };
    } else {
      return {
        container: this.isDarkTheme ? 'swal2-dark-theme-container' : 'swal2-light-theme-container',
        popup: 'custom-popup-class swal2-dark-mode-custom',
        confirmButton: this.isDarkTheme ? 'btn btn-primary-dark' : 'btn btn-primary-light',
        denyButton: 'btn btn-secondary'
      };
    }
  }

  fireSwal(options: SweetAlertOptions) {
    Swal.fire({
      ...options,
      customClass: this.getSwalCustomClass(),
      buttonsStyling: false,
      target: 'body'
    });
  }

  getAlertConfirmError(descripcion: string) {
    this.fireSwal({
      position: 'center',
      icon: 'error',
      title: 'Error',
      text: descripcion,
      showConfirmButton: true,
      customClass: this.getSwalCustomClass()
    });
  }

  // Aplica esta estructura para todas las demás alertas (success, warning, etc.)
  getAlertConfirmSuccess(descripcion: string) {
    this.fireSwal({
      position: 'center',
      icon: 'success',
      title: 'Success',
      text: descripcion,
      showConfirmButton: true,
      customClass: this.getSwalCustomClass()
    });
  }

  // modificable
  getAlertConfirmWarning(descripcion: string) {
    const listadoIncidencias = descripcion
      .split('\n') // Divide las incidencias en líneas
      .map((incidencia) => `<li>${incidencia}</li>`) // Envuelve cada línea en <li>
      .join(''); // Une todas las líneas en una cadena

    this.fireSwal({
      position: 'center',
      icon: 'warning',
      title: 'Advertencia',
      html: `<ul style="list-style-type: disc; margin: 0; padding-left: 20px; text-align: left;">${listadoIncidencias}</ul>`,
      showConfirmButton: true,
      customClass: this.getSwalCustomClass()
    });
  }

  getAlertError(descripcion: string) {
    this.fireSwal({
      position: 'center',
      icon: 'error',
      title: 'Error',
      text: descripcion,
      showConfirmButton: true,
      timer: 9000,
      customClass: this.getSwalCustomClass()
    });
  }

  getAlertSuccess(descripcion: string) {
    this.fireSwal({
      position: 'center',
      icon: 'success',
      title: 'Success',
      text: descripcion,
      showConfirmButton: true,
      timer: 9000,
      customClass: this.getSwalCustomClass()
    });
  }

  getAlertInfo(descripcion: string) {
    this.fireSwal({
      position: 'center',
      icon: 'info',
      title: 'Info',
      text: descripcion,
      showConfirmButton: true,
      timer: 9000,
      customClass: this.getSwalCustomClass()
    });
  }

  getAlertWarning(descripcion: string) {
    this.fireSwal({
      position: 'center',
      icon: 'warning',
      title: 'Warning',
      text: descripcion,
      showConfirmButton: true,
      timer: 9000,
      customClass: this.getSwalCustomClass()
    });
  }

  getAlertQuestion(descripcion: string) {
    this.fireSwal({
      position: 'center',
      icon: 'question',
      title: 'Question',
      text: descripcion,
      showConfirmButton: true,
      timer: 9000,
      customClass: this.getSwalCustomClass()
    });
  }

  getAlertQuestionRequest(descripcion: string, confirmButtonText: string, denyButtonText: string) {
    const customClasses = this.getSwalCustomClass();
    return Swal.fire({
      title: 'Question',
      text: descripcion,
      icon: 'question',
      showDenyButton: true,
      confirmButtonText: confirmButtonText,
      denyButtonText: denyButtonText,
      customClass: {
        container: customClasses.container,
        confirmButton: customClasses.confirmButton,
        denyButton: customClasses.denyButton,
        popup: 'swal2-dark-mode-custom'
      },
      buttonsStyling: false
    }).then((result) => {
      if (result.isConfirmed) {
        return true;
      }
      return false;
    });
  }
}
