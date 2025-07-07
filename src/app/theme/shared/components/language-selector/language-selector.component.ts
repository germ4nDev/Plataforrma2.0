import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../service/lenguage.service';

@Component({
  selector: 'app-language-selector',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './language-selector.component.html',
})
export class LanguageSelectorComponent {
  availableLanguages = [
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'es', label: 'Español', flag: '🇪🇸' },
  ];

  selectedLang = 'es';

  constructor(
    private translate: TranslateService,
    private languageService: LanguageService
  ) {
    const lang = localStorage.getItem('lang') || 'es';
    this.selectedLang = lang;
    this.languageService.setLanguage(lang);
  }

  changeLanguage(event: Event) {
    const selected = (event.target as HTMLSelectElement).value;
    this.selectedLang = selected;
    this.languageService.setLanguage(selected);
  }
}
