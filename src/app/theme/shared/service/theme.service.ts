import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface ThemeSettings {
  isDarkTheme: boolean;
  navbarColor: string;
  iconosColor: string;
  textoColor: string;
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

  isDarkTheme$ = this.isDarkTheme.asObservable();
  navbarColor$ = this.navbarColor.asObservable();
  iconosColor$ = this.iconosColor.asObservable();
  textoColor$ = this.textoColor.asObservable();

  constructor(rendererFactory: RendererFactory2) {
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
    this.isDarkTheme$.subscribe((isDark) => {
      if (isDark) {
        document.body.classList.add('dark-theme');
      } else {
        document.body.classList.remove('dark-theme');
      }
    });
    this.loadThemeSettings();
  }

  private loadThemeSettings(): void {
    const savedSettings = localStorage.getItem('app-theme-settings');
    if (savedSettings) {
      try {
        const settings: ThemeSettings = JSON.parse(savedSettings);
        this.isDarkTheme.next(settings.isDarkTheme);
        this.navbarColor.next(settings.navbarColor);
        this.iconosColor.next(settings.iconosColor);
        this.textoColor.next(settings.textoColor);
      } catch (e) {
        console.error('Error al cargar la configuración del tema desde localStorage', e);
      }
    }
  }

  private saveThemeSettings(): void {
    const settings: ThemeSettings = {
      isDarkTheme: this.isDarkTheme.value,
      navbarColor: this.navbarColor.value,
      textoColor: this.textoColor.value,
      iconosColor: this.iconosColor.value
    };
    console.log('save settings', settings);
    localStorage.setItem('app-theme-settings', JSON.stringify(settings));
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

  toggleDarkTheme(): void {
    const newTheme = !this.isDarkTheme.value;
    this.isDarkTheme.next(newTheme);
    this.saveThemeSettings();
  }
}
