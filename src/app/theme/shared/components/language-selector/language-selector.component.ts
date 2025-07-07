import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../service/lenguage.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-language-selector',
  standalone: true,
  imports: [CommonModule, NgSelectModule, FormsModule],
  templateUrl: './language-selector.component.html',
  styleUrl: './language-selector.component.scss'
})
export class LanguageSelectorComponent {
  selectedLang = 'es';

  availableLanguages = [
    { code: 'en', label: 'English', flag: 'assets/flags/united-states.png' },
    { code: 'es', label: 'Español', flag: 'assets/flags/colombia.png' }
  ];

  defaultLang = { code: 'es', label: 'Español', flag: 'assets/flags/colombia.png' };

  constructor(
    private translate: TranslateService,
    private languageService: LanguageService
  ) {
    // const storedLang = localStorage.getItem('lang') || 'es';
    this.selectedLang = this.translate.currentLang || 'es';
    // this.selectedLang = storedLang;
    this.languageService.setLanguage(this.selectedLang);
  }

  changeLanguage(langCode: string) {
    this.translate.use(langCode);
    this.languageService.setLanguage(langCode);
    this.selectedLang = langCode;
    localStorage.setItem('lang', langCode);
  }

  get oppositeLanguage() {
    return this.availableLanguages.find((lang: any) => lang.code !== this.translate.currentLang) || this.defaultLang;
  }
}
