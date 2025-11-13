/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { PTLUsuarioModel } from '../_helpers/models/PTLUsuario.model';
import { PTLAplicacionModel } from '../_helpers/models/PTLAplicacion.model';
import { PTLSuiteAPModel } from '../_helpers/models/PTLSuiteAP.model';
import { PTLModuloAP } from '../_helpers/models/PTLModuloAP.model';
import { BaseSessionModel } from '../_helpers/models/BaseSession.model';
import { ThemeSettingsModel } from '../_helpers/models/ThemeSettings.model';
import { NavSettings } from '../_helpers/models/navSettings.model';
import { PTLSuscriptorModel } from '../_helpers/models/PTLSuscriptor.model';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  DataModel: BaseSessionModel = new BaseSessionModel();
  navsettings: NavSettings = new NavSettings();
  public usuario: any;
  public token: any;
  public currentUser: any;
  public aplicacion: any;
  public suite: any;
  public modulo: any;
  public suscriptor: any;
  public FormRegistro: any;
  public lang: string = 'en';
  public themeSettings: any;

  constructor() {}

  // #region SETTERS
  setUsuarioLocalStorage(usuario: PTLUsuarioModel) {
    this.currentUser.usuario = usuario;
    localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
    this.usuario = usuario;
  }

  setTokenLocalStorage(token: any) {
    this.currentUser.token = token;
    localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
    this.token = token;
  }

  setNavSettingsLocalStorage(navsettings: NavSettings) {
    localStorage.setItem('navsettings', JSON.stringify(navsettings));
    this.navsettings = navsettings;
  }

  setAplicacionLocalStorage(aplicacion: PTLAplicacionModel) {
    this.navsettings.aplicacion = aplicacion;
    localStorage.setItem('navsettings', JSON.stringify(this.navsettings));
    this.aplicacion = aplicacion;
  }

  setSuiteLocalStorage(suite: PTLSuiteAPModel) {
    this.navsettings.suite = suite;
    localStorage.setItem('navsettings', JSON.stringify(this.navsettings));
    this.suite = suite;
  }

  setModuloLocalStorage(modulo: PTLModuloAP) {
    this.navsettings.modulo = modulo;
    localStorage.setItem('navsettings', JSON.stringify(this.navsettings));
    this.modulo = modulo;
  }

  setSuscriptorLocalStorage(data: PTLSuscriptorModel) {
    this.currentUser.suscrptor = data;
    localStorage.setItem('navsettings', JSON.stringify(this.navsettings));
    this.suscriptor = data;
  }

  setThemeSettingsLocalStorage(settings: ThemeSettingsModel) {
    localStorage.setItem('themeSettings', JSON.stringify(settings));
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
getCurrentUserLocalStorage() {
    this.usuario = JSON.parse(localStorage.getItem('currentUser') || '');
    return this.usuario.usuario;
  }

  getUsuarioLocalStorage() {
    this.usuario = JSON.parse(localStorage.getItem('currentUser') || '');
    return this.usuario.usuario;
  }

  getNavSettingsLocalStorage(): NavSettings {
    this.navsettings = JSON.parse(localStorage.getItem('navsettings') || '');
    return this.navsettings;
  }

  getAplicaicionLocalStorage(): PTLAplicacionModel {
    const aplicacion = this.getNavSettingsLocalStorage().aplicacion || new PTLAplicacionModel();
    return aplicacion;
  }

  getSuiteLocalStorage(): PTLSuiteAPModel {
    const suite = this.getNavSettingsLocalStorage().suite || new PTLSuiteAPModel();
    return suite;
  }

  getModuloLocalStorage(): PTLModuloAP {
    const modulo = this.getNavSettingsLocalStorage().modulo || new PTLModuloAP();
    return modulo;
  }

  getSuscriptorLocalStorage(): PTLSuscriptorModel {
    const suscriptor = this.getUsuarioLocalStorage().suscriptor || new PTLAplicacionModel();
    return suscriptor;
  }

  getDataModelsLocalStorage() {
    this.usuario = JSON.parse(localStorage.getItem('currentUser') || '');
    this.aplicacion = this.getNavSettingsLocalStorage().aplicacion || new PTLAplicacionModel();
    this.suite = this.getNavSettingsLocalStorage().suite || new PTLSuiteAPModel();
    this.modulo =  this.getNavSettingsLocalStorage().modulo || new PTLModuloAP();
    const modelo: BaseSessionModel = {
      codigoAplicacion: this.aplicacion.codigoAplicacion,
      codigoSuite: this.suite.codigoSuite,
      codigoModulo: this.modulo.codigoModulo,
      usuarioCreacion: this.usuario.usuario.codigoUsuario,
      usuarioModificacion: this.usuario.usuario.codigoUsuario,
      fechaCreacion: new Date(),
      fechaModificacion: new Date(),
      dataLog: []
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
      this.themeSettings = JSON.parse(localStorage.getItem('themeSettings') || '');
    } else {
      const settings: ThemeSettingsModel = {
        isDarkTheme: false,
        navbarColor: '#346BA6',
        iconosColor: '#f6f4f4',
        textoColor: '#f6f4f4',
        buttonsHoverColor: '#346BA6'
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
