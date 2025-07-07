// Angular Import
import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from './theme/shared/service/lenguage.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    lang: string = '';
    // constructor
    constructor(
        private router: Router,
        private translate: TranslateService,
        private languageService: LanguageService

    ) {
        this.translate.setDefaultLang('es');
        const lang = localStorage.getItem('lang') || 'es';
        this.translate.use(lang);
        // const browserLang = translate.getBrowserLang();
        // translate.use(browserLang?.match(/es|en/) ? browserLang : 'es');
    }

    // life cycle event
    ngOnInit() {
        this.router.events.subscribe((evt) => {
            if (!(evt instanceof NavigationEnd)) {
                return;
            }
            // this.cambiarIdioma(this.lang);
            this.lang = this.languageService.getCurrentLanguage();
            this.translate.use(this.lang);
            console.log('default lang', this.lang);
            localStorage.setItem('lang', this.lang);
            window.scrollTo(0, 0);
        });
    }

    cambiarIdioma(lang: string) {
        this.translate.use(lang);
        localStorage.setItem('lang', lang);
    }
}
