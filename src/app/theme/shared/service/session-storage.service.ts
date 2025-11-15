/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { PTLUsuarioModel } from '../_helpers/models/PTLUsuario.model';
import { PTLAplicacionModel } from '../_helpers/models/PTLAplicacion.model';
import { PTLSuiteAPModel } from '../_helpers/models/PTLSuiteAP.model';
import { PTLModuloAP } from '../_helpers/models/PTLModuloAP.model';
import { BaseSessionModel } from '../_helpers/models/BaseSession.model';
import { NavSettings } from '../_helpers/models/navSettings.model';
import { PTLSuscriptorModel } from '../_helpers/models/PTLSuscriptor.model';

@Injectable({
  providedIn: 'root'
})
export class SessionStorageService {
  DataModel: BaseSessionModel = new BaseSessionModel();
  navsettings: NavSettings = new NavSettings();
  public usuario: any = {};
  public token: any;
  public currentUser: any;
  public aplicacion: any = {};
  public suite: any = {};
  public modulo: any = {};
  public suscriptor: any = {};
  public FormRegistro: any;
  public lang: string = 'en';
  public themeSettings: any;

  constructor() {}

  // #region SETTERS
  setNavSettingsLocalStorage(navsettings: NavSettings) {
    localStorage.setItem('navsettings', JSON.stringify(navsettings));
    this.navsettings = navsettings;
  }

  setCurrentUserLocalStorage(current: PTLUsuarioModel) {
    this.currentUser = current;
    localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
    this.currentUser = current;
  }

  setUsuarioLocalStorage(usuario: PTLUsuarioModel) {
    this.currentUser.usuario = usuario;
    this.setCurrentUserLocalStorage(this.currentUser);
    this.usuario = usuario;
  }

  setTokenLocalStorage(token: any) {
    this.currentUser.token = token;
    this.setCurrentUserLocalStorage(this.currentUser);
    this.token = token;
  }

  setAplicacionLocalStorage(aplicacion: PTLAplicacionModel) {
    this.navsettings = {
        aplicacion: aplicacion,
        suite: this.suite,
        modulo: this.modulo
    }
    this.setNavSettingsLocalStorage(this.navsettings);
    this.aplicacion = aplicacion;
  }

  setSuiteLocalStorage(suite: PTLSuiteAPModel) {
    this.navsettings = {
        aplicacion: this.aplicacion,
        suite: suite,
        modulo: this.modulo
    }
    this.setNavSettingsLocalStorage(this.navsettings);
    this.suite = suite;
  }

  setModuloLocalStorage(modulo: PTLModuloAP) {
    console.log('aplicacion', this.aplicacion);
    console.log('suite', this.suite);
    console.log('modulo', modulo);
    this.navsettings = {
        aplicacion: this.aplicacion,
        suite: this.suite,
        modulo: modulo
    }
    this.setNavSettingsLocalStorage(this.navsettings);
    this.modulo = modulo;
  }

  setSuscriptorLocalStorage(data: PTLSuscriptorModel) {
    this.currentUser.suscrptor = data;
    this.setCurrentUserLocalStorage(this.currentUser);
    this.suscriptor = data;
  }

  setFormRegistro(FormRegistro: any) {
    sessionStorage.setItem('FormRegistro', JSON.stringify(FormRegistro));
    this.FormRegistro = FormRegistro;
  }
  // #endregion SETTERS

  // #region GETTERS
  getCurrentUserLocalStorage() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser') || '');
    return this.currentUser;
  }

  getUsuarioLocalStorage() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser') || '');
    console.log('currentUser', this.currentUser);
    return this.currentUser.usurio;
  }

  getNavSettingsLocalStorage(): NavSettings {
    const navsettings = localStorage.getItem('navsettings') || '';
    this.navsettings = JSON.parse(navsettings);
    return this.navsettings;
  }

  getAplicaicionLocalStorage(): PTLAplicacionModel {
    const navSetts = localStorage.getItem('navsettings');
    if (!navSetts) {
      return new PTLAplicacionModel();
    }
    try {
      const navSettJson = JSON.parse(navSetts);
      const obj = navSettJson.aplicacion;
      console.log('&&&&&&&&&&& Datos de la aplicacion:', obj);
      return obj;
    } catch (e) {
      console.error('Error al parsear JSON desde localStorage:', e);
      return new PTLAplicacionModel();
    }
  }

  getSuiteLocalStorage(): PTLSuiteAPModel {
    const navSetts = localStorage.getItem('navsettings');
    if (!navSetts) {
      return new PTLSuiteAPModel();
    }
    try {
      const navSettJson = JSON.parse(navSetts);
      const obj = navSettJson.suite;
      return obj;
    } catch (e) {
      console.error('Error al parsear JSON desde localStorage:', e);
      return new PTLSuiteAPModel();
    }
  }

  getModuloLocalStorage(): PTLModuloAP {
    const navSetts = localStorage.getItem('navsettings');
    if (!navSetts) {
      return new PTLModuloAP();
    }
    try {
      const navSettJson = JSON.parse(navSetts);
      const obj = navSettJson.modulo;
      return obj;
    } catch (e) {
      console.error('Error al parsear JSON desde localStorage:', e);
      return new PTLModuloAP();
    }
  }

  getSuscriptorLocalStorage(): PTLSuscriptorModel | null {
    const navSetts = localStorage.getItem('navsettings');
    if (!navSetts) {
      return null;
    }
    try {
      const navSettJson = JSON.parse(navSetts);
      const obj = navSettJson.suscriptor;
      return obj;
    } catch (e) {
      console.error('Error al parsear JSON desde localStorage:', e);
      return null;
    }
  }

  getDataModelsLocalStorage() {
    this.usuario = this.getUsuarioLocalStorage().aplicacion || new PTLUsuarioModel();
    console.log('datos del usuario', this.usuario);
    this.aplicacion = this.getNavSettingsLocalStorage().aplicacion || new PTLAplicacionModel();
    this.suite = this.getNavSettingsLocalStorage().suite || new PTLSuiteAPModel();
    this.modulo = this.getNavSettingsLocalStorage().modulo || new PTLModuloAP();
    const modelo: BaseSessionModel = {
      codigoAplicacion: this.aplicacion.codigoAplicacion,
      codigoSuite: this.suite.codigoSuite,
      codigoModulo: this.modulo.codigoModulo,
      usuarioCreacion: this.usuario.codigoUsuario,
      usuarioModificacion: this.usuario.codigoUsuario,
      fechaCreacion: new Date(),
      fechaModificacion: new Date(),
      dataLog: []
    };
    console.log('datamodel local', modelo);
    return modelo;
  }

  getFormRegistro() {
    this.FormRegistro = [];
    if (sessionStorage.getItem('FormRegistro')) {
      this.FormRegistro = JSON.parse(sessionStorage.getItem('FormRegistro') || '');
    }
    return this.FormRegistro;
  }
  // #endregion GETTERS

  // #region REMOVERS
  setLogOut() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('navsettings');
  }

  removeFormRegistro() {
    sessionStorage.removeItem('FormRegistro');
  }
  // #endregion  REMOVERS
}
