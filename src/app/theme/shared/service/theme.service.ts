/*
    Author: German Valencia
*/
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable, OnDestroy, Renderer2, RendererFactory2 } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
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
export class ThemeService implements OnDestroy {
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

    // Agrupador de suscripciones
    private subscriptions: Subscription = new Subscription();

    constructor(
        rendererFactory: RendererFactory2,
        private _localStorageService: LocalStorageService
    ) {
        console.log('ThemeService: Constructor se ESTA ejecutado.');

        this.renderer = rendererFactory.createRenderer(null, null);

        this.subscriptions.add(
            this.navbarColor$.subscribe((color) => {
                if (color) this.renderer.setStyle(document.body, '--app-navbar-color', color);
            })
        );

        this.subscriptions.add(
            this.iconosColor$.subscribe((color) => {
                if (color) this.renderer.setStyle(document.body, '--app-iconos-color', color);
            })
        );

        this.subscriptions.add(
            this.textoColor$.subscribe((color) => {
                if (color) this.renderer.setStyle(document.body, '--app-texto-color', color);
            })
        );

        this.subscriptions.add(
            this.buttonsHoverColor$.subscribe((color) => {
                if (color) this.renderer.setStyle(document.body, '--app-boton-hover-color', color);
            })
        );

        this.subscriptions.add(
            this.isDarkTheme$.subscribe((isDark) => {
                if (isDark) {
                    this.renderer.addClass(document.body, 'dark-theme');
                } else {
                    this.renderer.removeClass(document.body, 'dark-theme');
                }
            })
        );

        this.loadThemeSettings();
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    loadThemeSettings(): void {
        const savedSettings = this._localStorageService.getThemeSettings();

        if (savedSettings) {
            this.isDarkTheme.next(savedSettings.isDarkTheme);
            this.navbarColor.next(savedSettings.navbarColor);
            this.iconosColor.next(savedSettings.iconosColor);
            this.textoColor.next(savedSettings.textoColor);
            this.buttonsHoverColor.next(savedSettings.buttonsHoverColor);
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
        this._localStorageService.setThemeSettingsLocalStorage(settings);
    }

    setNavbarColor(color: string): void {
        this.navbarColor.next(color);
        this.saveThemeSettings();
    }

    setIconosColor(color: string): void {
        this.iconosColor.next(color);
        this.saveThemeSettings();
    }

    setTextoColor(color: string): void {
        this.textoColor.next(color);
        this.saveThemeSettings();
    }

    setBotonHoverColor(color: string): void {
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

    setDarkTheme(isDark: boolean): void {
        this.isDarkTheme.next(isDark);
        this.saveThemeSettings();
    }
}
