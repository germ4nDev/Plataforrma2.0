/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LocalStorageService } from './local-storage.service';

interface ThemeSettings {
  isDarkTheme: boolean;
  navbarColor: string;
  iconosColor: string;
  textoColor: string;
  buttonsHoverColor: string;
}

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private renderer: Renderer2;
  private isDarkTheme = new BehaviorSubject<boolean>(false);
  private navbarColor = new BehaviorSubject<string>('');
  private iconosColor = new BehaviorSubject<string>('');
  private textoColor = new BehaviorSubject<string>('');
  private buttonsHoverColor = new BehaviorSubject<string>('');

  isDarkTheme$ = this.isDarkTheme.asObservable();
  navbarColor$ = this.navbarColor.asObservable();
  iconosColor$ = this.iconosColor.asObservable();
  textoColor$ = this.textoColor.asObservable();
  buttonsHoverColor$ = this.buttonsHoverColor.asObservable();

  constructor(
    rendererFactory: RendererFactory2,
    private _loclaStorageService: LocalStorageService
  ) {
    console.log('ThemeService: Constructor se ha ejecutado.');
    this.renderer = rendererFactory.createRenderer(null, null);
    this.navbarColor$.subscribe((color) => {
      document.body.style.setProperty('--app-navbar-color', color);
    });
    this.iconosColor$.subscribe((color) => {
      document.body.style.setProperty('--app-iconos-color', color);
    });
    this.textoColor$.subscribe((color) => {
      document.body.style.setProperty('--app-texto-color', color);
    });
    this.buttonsHoverColor$.subscribe((color) => {
      document.body.style.setProperty('--app-boton-hover-color', color);
    });
    this.isDarkTheme$.subscribe((isDark) => {
      if (isDark) {
        document.body.classList.add('dark-theme');
      } else {
        document.body.classList.remove('dark-theme');
      }
    });
    this.loadThemeSettings();
  }

  loadThemeSettings(): void {
    const savedSettings = this._loclaStorageService.getThemeSettings();
    if (savedSettings) {
      try {
        this.isDarkTheme.next(savedSettings.isDarkTheme);
        this.navbarColor.next(savedSettings.navbarColor);
        this.iconosColor.next(savedSettings.iconosColor);
        this.textoColor.next(savedSettings.textoColor);
        this.buttonsHoverColor.next(savedSettings.buttonsHoverColor);
      } catch (e) {
        console.error('Error al cargar la configuración del tema desde localStorage', e);
      }
    }
  }

  saveThemeSettings(): void {
    const settings: ThemeSettings = {
      isDarkTheme: this.isDarkTheme.value,
      navbarColor: this.navbarColor.value,
      textoColor: this.textoColor.value,
      iconosColor: this.iconosColor.value,
      buttonsHoverColor: this.buttonsHoverColor.value
    };
    console.log('save settings', settings);
    this._loclaStorageService.setThemeSettingsLocalStorage(settings);
  }

  setNavbarColor(color: any): void {
    console.log('ThemeService: setNavbarColor se ha llamado con el color:', color);
    this.navbarColor.next(color);
    this.saveThemeSettings();
  }

  setIconosColor(color: any): void {
    console.log('ThemeService: setIconosColor se ha llamado con el color:', color);
    this.iconosColor.next(color);
    this.saveThemeSettings();
  }

  setTextoColor(color: any): void {
    console.log('ThemeService: setTextoColor se ha llamado con el color:', color);
    this.textoColor.next(color);
    this.saveThemeSettings();
  }

  setBotonHoverColor(color: any): void {
    console.log('ThemeService: setTextoColor se ha llamado con el color:', color);
    this.buttonsHoverColor.next(color);
    this.saveThemeSettings();
  }

  isDarkThemeEnabled(): boolean {
    return this.isDarkTheme.value;
  }

  toggleDarkTheme(): void {
    const newTheme = !this.isDarkTheme.value;
    this.isDarkTheme.next(newTheme);
    this.saveThemeSettings();
  }
}
