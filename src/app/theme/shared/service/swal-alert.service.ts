/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import Swal, { SweetAlertOptions } from 'sweetalert2';
import { ThemeService } from './theme.service'; // Importa tu ThemeService

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

  private getSwalCustomClass() {
    return {
      container: this.isDarkTheme ? 'swal2-dark-theme-container' : 'swal2-light-theme-container',
      popup: 'custom-popup-class', // Usa esta clase si necesitas más control
      confirmButton: this.isDarkTheme ? 'btn btn-primary-dark' : 'btn btn-primary-light',
      denyButton: 'btn btn-secondary'
    };
  }

  private fireSwal(options: SweetAlertOptions) {
    Swal.fire({
      ...options, // Aplica las opciones pasadas
      customClass: this.getSwalCustomClass(),
      buttonsStyling: false, // Desactiva el estilo por defecto para usar los tuyos
      target: 'body'
    });
  }

  getAlertConfirmError(descripcion: string) {
    this.fireSwal({
      position: 'center',
      icon: 'error',
      title: descripcion,
      showConfirmButton: true
    });
  }

  // Aplica esta estructura para todas las demás alertas (success, warning, etc.)
  getAlertConfirmSuccess(descripcion: string) {
    this.fireSwal({
      position: 'center',
      icon: 'success',
      title: descripcion,
      showConfirmButton: true
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
      showConfirmButton: true
    });
  }

  getAlertError(descripcion: string) {
    this.fireSwal({
      position: 'center',
      icon: 'error',
      title: descripcion,
      showConfirmButton: true,
      timer: 9000
    });
  }

  getAlertSuccess(descripcion: string) {
    this.fireSwal({
      position: 'center',
      icon: 'success',
      title: descripcion,
      showConfirmButton: true,
      timer: 9000
    });
  }

  getAlertInfo(descripcion: string) {
    this.fireSwal({
      position: 'center',
      icon: 'info',
      title: descripcion,
      showConfirmButton: true,
      timer: 9000
    });
  }

  getAlertWarning(descripcion: string) {
    this.fireSwal({
      position: 'center',
      icon: 'warning',
      title: descripcion,
      showConfirmButton: true,
      timer: 9000
    });
  }

  getAlertQuestion(descripcion: string) {
    this.fireSwal({
      position: 'center',
      icon: 'question',
      title: descripcion,
      showConfirmButton: true,
      timer: 9000
    });
  }

  getAlertQuestionRequest(descripcion: string, confirmButtonText: string, denyButtonText: string) {
    const customClasses = this.getSwalCustomClass();
    return Swal.fire({
      title: descripcion,
      icon: 'question',
      showDenyButton: true,
      confirmButtonText: confirmButtonText,
      denyButtonText: denyButtonText,
      customClass: {
        container: customClasses.container,
        confirmButton: customClasses.confirmButton,
        denyButton: customClasses.denyButton
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
