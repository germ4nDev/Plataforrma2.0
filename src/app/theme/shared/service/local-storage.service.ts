/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { PTLUsuarioModel } from '../_helpers/models/PTLUsuario.model';
import { PTLAplicacionModel } from '../_helpers/models/PTLAplicacion.model';
import { PTLSuiteAPModel } from '../_helpers/models/PTLSuiteAP.model';
import { PTLModuloAP } from '../_helpers/models/PTLModuloAP.model';
import { FormDataModel } from '../_helpers/models/FormData.model';

interface ThemeSettings {
  isDarkTheme: boolean;
  navbarColor: string;
  iconosColor: string;
  textoColor: string;
}

interface Modelostorage {
  codigoAplicacion: string;
  codigoSuite: string;
  codigoModulo: string;
  usuarioCreacion: string;
  usuarioModificacion: string;
  fechaCreacion: Date;
  fechaModificacion: Date;
  actividad: [];
}

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  DataModel: FormDataModel = new FormDataModel();
  public usuario: any;
  public currentUser: any;
  public aplicacion: any;
  public suite: any;
  public modulo: any;
  public FormRegistro: any;
  public lang: string = 'en';
  public themeSettings: any;

  constructor() {}

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

  setFormRegistro(FormRegistro: any) {
    sessionStorage.setItem('FormRegistro', JSON.stringify(FormRegistro));
    this.FormRegistro = FormRegistro;
  }

  setLogOut() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('aplicacion');
    localStorage.removeItem('suite');
    localStorage.removeItem('modulo');
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
    this.modulo = localStorage.getItem('modulo') ? JSON.parse(localStorage.getItem('modulo') || '') : '';
    console.log('modulo local storage', this.modulo);
    return this.modulo;
  }

  getDataModelsLocalStorage() {
    this.usuario = JSON.parse(localStorage.getItem('currentUser') || '');
    this.aplicacion = JSON.parse(localStorage.getItem('aplicacion') || '');
    this.suite = JSON.parse(localStorage.getItem('suite') || '');
    this.modulo = JSON.parse(localStorage.getItem('modulo') || '');
    const modelo: Modelostorage = {
      codigoAplicacion: this.aplicacion.codigoAplicacion,
      codigoSuite: this.suite.codigoSuite,
      codigoModulo: this.modulo.codigoModulo,
      usuarioCreacion: this.usuario.usuario.codigoUsuario,
      usuarioModificacion: this.usuario.usuario.codigoUsuario,
      fechaCreacion: new Date(),
      fechaModificacion: new Date(),
      actividad: []
    };
    console.log('datamodel local', modelo);
    return modelo;
  }

  getLanguage(): string {
    return this.lang;
  }

  getFormRegistro() {
    this.FormRegistro = [];
    if (sessionStorage.getItem('FormRegistro')) {
      this.FormRegistro = JSON.parse(sessionStorage.getItem('FormRegistro') || '');
    }
    return this.FormRegistro;
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

  // #region REMOVERS
  removeFormRegistro() {
    sessionStorage.removeItem('FormRegistro');
  }
  // #endregion  REMOVERS
}
