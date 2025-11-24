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
import { CurrentUserModel } from '../_helpers/models/CurrentUser.model';
import { PTLRoleAPModel } from '../_helpers/models/PTLRoleAP.model';
import { PTLEmpresaSCModel } from '../_helpers/models/PTLEmpresaSC.model';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  DataModel: BaseSessionModel = new BaseSessionModel();
  navsettings: NavSettings = new NavSettings();
  public usuario: any = {};
  public token: any;
  public currentUser: any;
  public aplicacion: any = {};
  public suite: any = {};
  public modulo: any = {};
  public suscriptor: any = {};
  public empresa: any = {};
  public FormRegistro: any;
  public lang: string = 'en';
  public themeSettings: any;
  public roles: PTLRoleAPModel[] = [];

  constructor() {}

  // #region GETTERS
  getCurrentUserLocalStorage(): any {
    const currentUserSession = sessionStorage.getItem('currentUser');
    if (!currentUserSession) {
      // console.log('No existe currentUser en la sesión o está vacío.');
      return null;
    }
    try {
      const currentUser = JSON.parse(currentUserSession);
      return currentUser;
    } catch (e) {
      console.error('Error al parsear JSON desde sessionStorage:', e);
      return null;
    }
  }

  getUsuarioLocalStorage() {
    const currentUserSession = sessionStorage.getItem('currentUser');
    if (!currentUserSession) {
      // console.log('No existe currentUser en la sesión o está vacío.');
      return null;
    }
    try {
      const currentUser = JSON.parse(currentUserSession);
      // console.log('Datos de la currentUser', currentUser);
      return currentUser.usuario;
    } catch (e) {
      console.error('Error al parsear JSON desde sessionStorage:', e);
      return null;
    }
  }

  getTokenLocalStorage() {
    const currentUserSession = sessionStorage.getItem('currentUser');
    if (!currentUserSession) {
      // console.log('No existe currentUser en la sesión o está vacío.');
      return null;
    }
    try {
      const currentUser = JSON.parse(currentUserSession);
      // console.log('Datos de la currentUser', currentUser);
      return currentUser.token;
    } catch (e) {
      console.error('Error al parsear JSON desde sessionStorage:', e);
      return null;
    }
  }

  getNavSettingsLocalStorage(): NavSettings {
    const navsettings = sessionStorage.getItem('navsettings');
    if (!navsettings) {
      return new NavSettings();
    }
    try {
      const navSettJson = JSON.parse(navsettings);
      const obj = navSettJson;
      // console.log('&&&&&&&&&&& Datos de la aplicacion:', obj);
      return obj;
    } catch (e) {
      console.error('Error al parsear JSON desde sessionStorage:', e);
      return new NavSettings();
    }
  }

  getAplicaicionLocalStorage(): PTLAplicacionModel {
    const navSetts = sessionStorage.getItem('navsettings');
    if (!navSetts) {
      return new PTLAplicacionModel();
    }
    try {
      const navSettJson = JSON.parse(navSetts);
      const obj = navSettJson.aplicacion;
      // console.log('&&&&&&&&&&& Datos de la aplicacion:', obj);
      return obj;
    } catch (e) {
      console.error('Error al parsear JSON desde sessionStorage:', e);
      return new PTLAplicacionModel();
    }
  }

  getSuiteLocalStorage(): PTLSuiteAPModel {
    const navSetts = sessionStorage.getItem('navsettings');
    if (!navSetts) {
      return new PTLSuiteAPModel();
    }
    try {
      const navSettJson = JSON.parse(navSetts);
      const obj = navSettJson.suite;
      return obj;
    } catch (e) {
      console.error('Error al parsear JSON desde sessionStorage:', e);
      return new PTLSuiteAPModel();
    }
  }

  getModuloLocalStorage(): PTLModuloAP {
    const navSetts = sessionStorage.getItem('navsettings');
    // console.log('===NAVSETTINGS HIJUEPUTAAAAAAAAAAAAAAAAAA', navSetts);
    if (!navSetts) {
      return new PTLModuloAP();
    }
    try {
      const navSettJson = JSON.parse(navSetts);
      const obj = navSettJson.modulo;
      return obj;
    } catch (e) {
      console.error('Error al parsear JSON desde sessionStorage:', e);
      return new PTLModuloAP();
    }
  }

  getSuscriptorPlataformaLocalStorage() {
    return 'e1a8fa99-15db-479b-a0a4-9c2be72273c9';
  }

  getSuscriptorLocalStorage(): PTLSuscriptorModel | null {
    const navSetts = sessionStorage.getItem('currentUser');
    if (!navSetts) {
      return null;
    }
    try {
      const navSettJson = JSON.parse(navSetts);
      const obj: PTLSuscriptorModel = navSettJson.suscriptor;
      return obj;
    } catch (e) {
      console.error('Error al parsear JSON desde sessionStorage:', e);
      return null;
    }
  }

  getDataModelsLocalStorage() {
    this.usuario = this.getUsuarioLocalStorage().aplicacion || new PTLUsuarioModel();
    // console.log('datos del usuario', this.usuario);
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
    // console.log('datamodel local', modelo);
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
    if (sessionStorage.getItem('app-theme-settings')) {
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

  // #region SETTERS
  setNavSettingsLocalStorage(navsettings: NavSettings) {
    sessionStorage.setItem('navsettings', JSON.stringify(navsettings));
    this.navsettings = navsettings;
  }

  setThemeSettingsLocalStorage(settings: ThemeSettingsModel) {
    localStorage.setItem('themeSettings', JSON.stringify(settings));
    this.themeSettings = settings;
  }

  setCurrentUserLocalStorage(data: CurrentUserModel) {
    let current = this.getCurrentUserLocalStorage();
    console.log('********* nuevo current user', data);
    current = data;
    sessionStorage.setItem('currentUser', JSON.stringify(current));
    this.currentUser = current;
  }

  setUsuarioLocalStorage(usuario: PTLUsuarioModel) {
    let currentUser = this.getCurrentUserLocalStorage();
    currentUser = {
      suscriptor: currentUser.suscriptor,
      ok: currentUser.ok,
      token: currentUser.token,
      roles: currentUser.roles,
      empresa: currentUser.empresa,
      usuario: usuario
    };
    this.setCurrentUserLocalStorage(currentUser);
    this.usuario = usuario;
  }

  setSuscriptorLocalStorage(data: PTLSuscriptorModel) {
    let currentUser = this.getCurrentUserLocalStorage();
    // console.log('===CURRENTUSER HIJUEPUTAAAAAAAAAAAAAAAAAA', currentUser);
    currentUser = {
      suscriptor: data,
      ok: currentUser.ok,
      token: currentUser.token,
      roles: currentUser.roles,
      empresa: currentUser.empresa,
      usuario: currentUser.usuario
    };
    this.setCurrentUserLocalStorage(currentUser);
    this.suscriptor = data;
  }

  setRolesLocalStorage(roles: PTLRoleAPModel[]) {
    let currentUser = this.getCurrentUserLocalStorage();
    currentUser = {
      suscriptor: currentUser.suscriptor,
      ok: currentUser.ok,
      token: currentUser.token,
      roles: roles,
      empresa: currentUser.empresa,
      usuario: currentUser.usuario
    };
    this.setCurrentUserLocalStorage(currentUser);
    this.roles = roles;
  }

  setEmpresasLocalStorage(empresa: PTLEmpresaSCModel) {
    let currentUser = this.getCurrentUserLocalStorage();
    currentUser = {
      suscriptor: currentUser.suscriptor,
      ok: currentUser.ok,
      token: currentUser.token,
      roles: currentUser.roles,
      empresa: empresa,
      usuario: currentUser.usuario
    };
    this.setCurrentUserLocalStorage(currentUser);
    this.empresa = empresa;
  }

  setTokenLocalStorage(token: any) {
    let currentUser = this.getCurrentUserLocalStorage();
    currentUser = {
      suscriptor: currentUser.suscriptor,
      ok: currentUser.ok,
      token: token,
      roles: currentUser.roles,
      empresa: currentUser.empresa,
      usuario: currentUser.usuario
    };
    this.setCurrentUserLocalStorage(currentUser);
    this.token = token;
  }

  setAplicacionLocalStorage(aplicacion: PTLAplicacionModel) {
    let navSetts = this.getNavSettingsLocalStorage();
    // console.log('===NAVSETTINGS HIJUEPUTAAAAAAAAAAAAAAAAAA', navSetts);
    navSetts = {
      aplicacion: aplicacion,
      suite: navSetts.suite,
      modulo: navSetts.modulo
    };
    this.setNavSettingsLocalStorage(navSetts);
    this.aplicacion = aplicacion;
  }

  setSuiteLocalStorage(suite: PTLSuiteAPModel) {
    let navSetts = this.getNavSettingsLocalStorage();
    // console.log('===NAVSETTINGS HIJUEPUTAAAAAAAAAAAAAAAAAA', navSetts);
    navSetts = {
      aplicacion: navSetts.aplicacion,
      suite: suite,
      modulo: navSetts.modulo
    };
    this.setNavSettingsLocalStorage(navSetts);
    this.suite = suite;
  }

  setModuloLocalStorage(modulo: PTLModuloAP) {
    let navSetts = this.getNavSettingsLocalStorage();
    // console.log('===NAVSETTINGS HIJUEPUTAAAAAAAAAAAAAAAAAA', navSetts);
    navSetts = {
      aplicacion: navSetts.aplicacion,
      suite: navSetts.suite,
      modulo: modulo
    };
    this.setNavSettingsLocalStorage(navSetts);
    this.modulo = modulo;
  }

  setLanguage(lang: string) {
    localStorage.setItem('lang', lang);
    this.lang = lang;
  }

  setFormRegistro(FormRegistro: any) {
    sessionStorage.setItem('FormRegistro', JSON.stringify(FormRegistro));
    this.FormRegistro = FormRegistro;
  }
  // #endregion SETTERS

  // #region REMOVERS
  removeFormRegistro() {
    sessionStorage.removeItem('FormRegistro');
  }

  setLogOut() {
    sessionStorage.removeItem('currentUser');
    sessionStorage.removeItem('navsettings');
  }
  // #endregion  REMOVERS
}
