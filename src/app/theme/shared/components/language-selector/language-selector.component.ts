import { Component, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-language-selector',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './language-selector.component.html',
})
export class LanguageSelectorComponent {
    lang: string = 'es';

    availableLanguages = [
        { code: 'en', label: 'English' },
        { code: 'es', label: 'Español' },
    ];

    constructor(private translate: TranslateService) {
        this.lang = localStorage.getItem('lang') || '';
        if (this.lang == '') {
            this.lang = 'es';
            localStorage.setItem('lang', 'es');
        }
        this.translate.setDefaultLang(this.lang);
        // this.changeLanguage(this.lang);
    }

    changeLanguage(lang: any) {
        console.log('nuevo lenguage', lang.target.value);
        localStorage.setItem('lang', lang.target.value);
        this.translate.setDefaultLang(lang.target.value);
    }

    get currentLang() {
        return this.translate.currentLang || this.translate.getDefaultLang();
    }
}
