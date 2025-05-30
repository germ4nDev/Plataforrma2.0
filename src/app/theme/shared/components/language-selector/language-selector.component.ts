import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-language-selector',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './language-selector.component.html',
})
export class LanguageSelectorComponent {
  availableLanguages = [
    { code: 'en', label: 'English' },
    { code: 'es', label: 'Español' },
  ];

  constructor(private translate: TranslateService) {
    const lang = localStorage.getItem('lang') || '';
    if (lang == '') {
        localStorage.setItem('lang', 'es');
    }
  }

  changeLanguage(lang: any) {
    this.translate.use(lang.target.value);
    console.log('nuevo lenguage', lang.target.value);
    localStorage.setItem('lang', lang.target.value);
  }

  get currentLang() {
    return this.translate.currentLang || this.translate.getDefaultLang();
  }
}
