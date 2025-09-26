import { Injectable } from '@angular/core';
import { PTLUsuarioModel } from '../_helpers/models/PTLUsuario.model';
import { PTLAplicacionModel } from '../_helpers/models/PTLAplicacion.model';
import { PTLSuiteAPModel } from '../_helpers/models/PTLSuiteAP.model';
import { PTLModuloAP } from '../_helpers/models/PTLModuloAP.model';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  public usuario: PTLUsuarioModel = new PTLUsuarioModel();
  public aplicacion: PTLAplicacionModel = new PTLAplicacionModel();
  public suite: PTLSuiteAPModel = new PTLSuiteAPModel();
  public modulo: PTLModuloAP = new PTLModuloAP();
  public lang: string = 'en';

  constructor() {
    // this.usuario = JSON.parse(localStorage.getItem('currentUser') || '');
    // this.aplicacion = localStorage.getItem('aplicacion') ? JSON.parse(localStorage.getItem('aplicacion')) : new PTLAplicacionModel()
    // this.suite = JSON.parse(localStorage.getItem('suite') || '');
    // this.modulo = JSON.parse(localStorage.getItem('modulo') || '');
  }

  // #region SETTERS
  setUsuarioLocalStorage(usu: PTLUsuarioModel) {
    localStorage.setItem('currrentUser', JSON.stringify(usu));
    this.usuario = usu;
  }

  setAplicacionLocalStorage(aplicacion: PTLAplicacionModel) {
    localStorage.setItem('aplicacion', JSON.stringify(aplicacion));
    this.aplicacion = aplicacion
  }

  setSuiteLocalStorage(suite: PTLSuiteAPModel) {
    localStorage.setItem('suite', JSON.stringify(suite));
    this.suite = suite
  }

  setModuloLocalStorage(modulo: PTLModuloAP) {
    localStorage.setItem('modulo', JSON.stringify(modulo));
    this.modulo = modulo
  }

  setLanguage(lang: string) {
    localStorage.setItem('lang', lang);
    this.lang = lang;
  }

  // #endregion SETTERS

  // #region GETTERS

  getUsuarioLocalStorage(): PTLUsuarioModel {
    return this.usuario;
  }

  getAplicaicionLocalStorage(): PTLUsuarioModel {
    return this.aplicacion;
  }

  getSuiteLocalStorage(): PTLSuiteAPModel {
    return this.suite;
  }

  getModuloLocalStorage(): PTLModuloAP {
    return this.modulo;
  }

  getLanguage(): string {
    return this.lang;
  }

  getLanguageUrl() {
    return `//cdn.datatables.net/plug-ins/1.10.25/i18n/${this.lang === 'es' ? 'Spanish' : 'English'}.json`;
  }

  // #endregion GETTERS
}
