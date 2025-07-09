import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private currentLangSubject = new BehaviorSubject<string>(localStorage.getItem('lang') || 'es');
  currentLang$ = this.currentLangSubject.asObservable();

  constructor(private translate: TranslateService) {
    // const savedLang = localStorage.getItem('lang') || 'es';
    console.log('localLanguage', localStorage.getItem('lang') || 'es');
    // this.setLanguage(savedLang);
  }

  setLanguage(lang: string) {
    this.translate.use(lang); // 👈 actualiza el idioma en ngx-translate
    localStorage.setItem('lang', lang);
    console.log('New localLanguage', lang);
    this.currentLangSubject.next(lang); // 👈 emite el cambio para los componentes suscritos
  }

  getCurrentLanguage(): string {
    return this.currentLangSubject.getValue();
  }
}
