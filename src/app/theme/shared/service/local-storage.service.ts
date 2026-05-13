/*
    Author: German Valencia
*/
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core'
import { PTLUsuarioModel } from '../_helpers/models/PTLUsuario.model'
import { PTLAplicacionModel } from '../_helpers/models/PTLAplicacion.model'
import { PTLSuiteAPModel } from '../_helpers/models/PTLSuiteAP.model'
import { PTLModuloAP } from '../_helpers/models/PTLModuloAP.model'
import { BaseSessionModel } from '../_helpers/models/BaseSession.model'
import { ThemeSettingsModel } from '../_helpers/models/ThemeSettings.model'
import { NavSettings } from '../_helpers/models/navSettings.model'
import { PTLSuscriptorModel } from '../_helpers/models/PTLSuscriptor.model'
import { CurrentUserModel } from '../_helpers/models/CurrentUser.model'
import { PTLRoleAPModel } from '../_helpers/models/PTLRoleAP.model'
import { PTLEmpresaSCModel } from '../_helpers/models/PTLEmpresaSC.model'
import { PTLActividadModel } from '../_helpers/models/PTLActividades.model'

@Injectable({
    providedIn: 'root'
})
export class LocalStorageService {
    DataModel: BaseSessionModel = new BaseSessionModel()
    navsettings: NavSettings = new NavSettings()
    public usuario: any = {}
    public token: any
    public currentUser: any
    public aplicacion: any = {}
    public suite: any = {}
    public modulo: any = {}
    public suscriptor: any = {}
    public empresa: any = {}
    public FormRegistro: any
    public lang: string = 'en'
    public themeSettings: any
    public roles: PTLRoleAPModel[] = []
    public actividades: PTLActividadModel[] = []

    constructor() { }

    // #region MÉTODOS GENÉRICOS (BASE)
    getObject<T>(key: string): T | null {
        const value = sessionStorage.getItem(key);
        if (!value) return null;
        try {
            return JSON.parse(value) as T;
        } catch (error) {
            console.error(`Error al recuperar la clave ${key}:`, error);
            return null;
        }
    }

    setObject(key: string, value: any): void {
        if (value === null || value === undefined) return;
        sessionStorage.setItem(key, JSON.stringify(value));
    }

    removeObject(key: string): void {
        sessionStorage.removeItem(key);
    }
    // #endregion

    // #region GETTERS
    getCurrentUserLocalStorage(): any {
        return this.getObject<any>('currentUser');
    }

    getUsuarioLocalStorage() {
        const currentUser = this.getCurrentUserLocalStorage();
        return currentUser ? currentUser.usuario : null;
    }

    getTokenLocalStorage() {
        const currentUser = this.getCurrentUserLocalStorage();
        return currentUser ? currentUser.token : null;
    }

    getNavSettingsLocalStorage(): NavSettings {
        return this.getObject<NavSettings>('navsettings') || new NavSettings();
    }

    getAplicaicionLocalStorage(): PTLAplicacionModel {
        const navSetts = this.getNavSettingsLocalStorage();
        return navSetts.aplicacion || new PTLAplicacionModel();
    }

    getSuiteLocalStorage(): PTLSuiteAPModel {
        const navSetts = this.getNavSettingsLocalStorage();
        return navSetts.suite || new PTLSuiteAPModel();
    }

    getModuloLocalStorage(): PTLModuloAP {
        const navSetts = this.getNavSettingsLocalStorage();
        return navSetts.modulo || new PTLModuloAP();
    }

    getSuscriptorPlataformaLocalStorage() {
        return 'plataforma'
    }

    getSuscriptorLocalStorage(): PTLSuscriptorModel | null {
        const currentUser = this.getCurrentUserLocalStorage();
        return currentUser && currentUser.suscriptor ? currentUser.suscriptor : new PTLSuscriptorModel();
    }

    getDataModelsLocalStorage() {
        // Nota: Revisa si de verdad querías hacer .aplicacion aquí, podría ser un bug de tu versión anterior
        this.usuario = this.getUsuarioLocalStorage() || new PTLUsuarioModel();
        this.aplicacion = this.getAplicaicionLocalStorage();
        this.suite = this.getSuiteLocalStorage();
        this.modulo = this.getModuloLocalStorage();

        const modelo: BaseSessionModel = {
            codigoAplicacion: this.aplicacion.codigoAplicacion,
            codigoSuite: this.suite.codigoSuite,
            codigoModulo: this.modulo.codigoModulo,
            usuarioCreacion: this.usuario.codigoUsuario,
            usuarioModificacion: this.usuario.codigoUsuario,
            fechaCreacion: new Date(),
            fechaModificacion: new Date(),
            dataLog: []
        }
        return modelo;
    }

    getLanguage(): string {
        return this.lang;
    }

    getFormRegistro() {
        this.FormRegistro = this.getObject<any>('FormRegistro') || [];
        return this.FormRegistro;
    }

    getThemeSettings() {
        const localSettings = localStorage.getItem('themeSettings');
        if (localSettings) {
            this.themeSettings = JSON.parse(localSettings);
        } else {
            this.themeSettings = {
                isDarkTheme: false,
                navbarColor: '#346BA6',
                iconosColor: '#f6f4f4',
                textoColor: '#f6f4f4',
                buttonsHoverColor: '#346BA6'
            } as ThemeSettingsModel;
        }
        return this.themeSettings;
    }

    getLanguageUrl() {
        return `//cdn.datatables.net/plug-ins/1.10.25/i18n/${this.lang === 'es' ? 'Spanish' : 'English'}.json`;
    }
    // #endregion GETTERS

    // #region SETTERS
    setNavSettingsLocalStorage(navsettings: NavSettings) {
        this.setObject('navsettings', navsettings);
        this.navsettings = navsettings;
    }

    setThemeSettingsLocalStorage(settings: ThemeSettingsModel) {
        localStorage.setItem('themeSettings', JSON.stringify(settings));
        this.themeSettings = settings;
    }

    setCurrentUserLocalStorage(data: CurrentUserModel) {
        this.setObject('currentUser', data);
        this.currentUser = data;
    }

    // Uso del spread operator (...) para mantener el código DRY y evitar typos como "acttividades"
    setUsuarioLocalStorage(usuario: PTLUsuarioModel) {
        const currentUser = { ...this.getCurrentUserLocalStorage(), usuario };
        this.setCurrentUserLocalStorage(currentUser);
        this.usuario = usuario;
    }

    setSuscriptorLocalStorage(data: PTLSuscriptorModel) {
        const currentUser = { ...this.getCurrentUserLocalStorage(), suscriptor: data };
        this.setCurrentUserLocalStorage(currentUser);
        this.suscriptor = data;
    }

    setRolesLocalStorage(roles: PTLRoleAPModel[]) {
        const currentUser = { ...this.getCurrentUserLocalStorage(), roles };
        this.setCurrentUserLocalStorage(currentUser);
        this.roles = roles;
    }

    setActividadesLocalStorage(actividades: PTLActividadModel[]) {
        const currentUser = { ...this.getCurrentUserLocalStorage(), actividades };
        this.setCurrentUserLocalStorage(currentUser);
        this.actividades = actividades;
    }

    setEmpresasLocalStorage(empresa: PTLEmpresaSCModel) {
        const currentUser = { ...this.getCurrentUserLocalStorage(), empresa };
        this.setCurrentUserLocalStorage(currentUser);
        this.empresa = empresa;
    }

    setTokenLocalStorage(token: any) {
        const currentUser = { ...this.getCurrentUserLocalStorage(), token };
        this.setCurrentUserLocalStorage(currentUser);
        this.token = token;
    }

    setAplicacionLocalStorage(aplicacion: PTLAplicacionModel) {
        const navSetts = { ...this.getNavSettingsLocalStorage(), aplicacion };
        this.setNavSettingsLocalStorage(navSetts);
        this.aplicacion = aplicacion;
    }

    setSuiteLocalStorage(suite: PTLSuiteAPModel) {
        const navSetts = { ...this.getNavSettingsLocalStorage(), suite };
        this.setNavSettingsLocalStorage(navSetts);
        this.suite = suite;
    }

    setModuloLocalStorage(modulo: PTLModuloAP) {
        const navSetts = { ...this.getNavSettingsLocalStorage(), modulo };
        this.setNavSettingsLocalStorage(navSetts);
        this.modulo = modulo;
    }

    setLanguage(lang: string) {
        localStorage.setItem('lang', lang);
        this.lang = lang;
    }

    setFormRegistro(FormRegistro: any) {
        this.setObject('FormRegistro', FormRegistro);
        this.FormRegistro = FormRegistro;
    }
    // #endregion SETTERS

    // #region REMOVERS
    removeFormRegistro() {
        this.removeObject('FormRegistro');
    }

    setLogOut() {
        this.removeObject('currentUser');
        this.removeObject('navsettings');
    }
    // #endregion  REMOVERS
}
