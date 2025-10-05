/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { PTLUsuarioModel } from '../_helpers/models/PTLUsuario.model';
import { PTLAplicacionModel } from '../_helpers/models/PTLAplicacion.model';
import { PTLSuiteAPModel } from '../_helpers/models/PTLSuiteAP.model';
import { PTLModuloAP } from '../_helpers/models/PTLModuloAP.model';

interface ThemeSettings {
  isDarkTheme: boolean;
  navbarColor: string;
  iconosColor: string;
  textoColor: string;
}

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  public usuario: any;
  public currentUser: any;
  public aplicacion: any;
  public suite: any;
  public modulo: any;
  public lang: string = 'en';
  public themeSettings: any;

  constructor() {
    // this.usuario = JSON.parse(localStorage.getItem('currentUser') || '');
    // this.aplicacion = localStorage.getItem('aplicacion') ? JSON.parse(localStorage.getItem('aplicacion')) : new PTLAplicacionModel()
    // this.suite = JSON.parse(localStorage.getItem('suite') || '');
    // this.modulo = JSON.parse(localStorage.getItem('modulo') || '');
  }

  // #region SETTERS
  setUsuarioLocalStorage(user: PTLUsuarioModel) {
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.usuario = user;
  }

  setAplicacionLocalStorage(aplicacion: PTLAplicacionModel) {
    localStorage.setItem('aplicacion', JSON.stringify(aplicacion));
    this.aplicacion = aplicacion;
  }

  setSuiteLocalStorage(suite: PTLSuiteAPModel) {
    localStorage.setItem('suite', JSON.stringify(suite));
    this.suite = suite;
  }

  setModuloLocalStorage(modulo: PTLModuloAP) {
    localStorage.setItem('modulo', JSON.stringify(modulo));
    this.modulo = modulo;
  }

  setThemeSettingsLocalStorage(settings: ThemeSettings) {
    localStorage.setItem('app-theme-settings', JSON.stringify(settings));
    this.themeSettings = settings;
  }

  setLanguage(lang: string) {
    localStorage.setItem('lang', lang);
    this.lang = lang;
  }

  setLogOut() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('aplicacion');
    localStorage.removeItem('suite');
  }
  // #endregion SETTERS

  // #region GETTERS
  getUsuarioLocalStorage() {
    this.usuario = JSON.parse(localStorage.getItem('currentUser') || '');
    return this.usuario.usuario;
  }

  getAplicaicionLocalStorage(): PTLAplicacionModel {
    this.aplicacion = JSON.parse(localStorage.getItem('aplicacion') || '');
    return this.aplicacion;
  }

  getSuiteLocalStorage(): PTLSuiteAPModel {
    this.suite = JSON.parse(localStorage.getItem('suite') || '');
    return this.suite;
  }

  getModuloLocalStorage(): PTLModuloAP {
    this.modulo = JSON.parse(localStorage.getItem('modulo') || '');
    return this.modulo;
  }

  getLanguage(): string {
    return this.lang;
  }

  getThemeSettings() {
    if (localStorage.getItem('app-theme-settings')) {
      this.themeSettings = JSON.parse(localStorage.getItem('app-theme-settings') || '');
    } else {
      const settings: ThemeSettings = {
        isDarkTheme: false,
        navbarColor: '#2c3e50',
        iconosColor: '#fff',
        textoColor: '#fff'
      };
      this.themeSettings = settings;
    }
    return this.themeSettings;
  }

  getLanguageUrl() {
    return `//cdn.datatables.net/plug-ins/1.10.25/i18n/${this.lang === 'es' ? 'Spanish' : 'English'}.json`;
  }

  // #endregion GETTERS
}
