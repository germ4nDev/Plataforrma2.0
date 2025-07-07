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
    lang: string = 'es';

    constructor(
        private router: Router,
        private translate: TranslateService,
        private languageService: LanguageService
    ) {
        this.translate.setDefaultLang('es');
        const localLang = localStorage.getItem('lang') || 'es';
        this.translate.use(localLang);
        this.languageService.setLanguage(localLang);
    }

    ngOnInit() {
        this.router.events.subscribe((evt) => {
            if (evt instanceof NavigationEnd) {
                this.lang = this.languageService.getCurrentLanguage();
                this.translate.use(this.lang);
                localStorage.setItem('lang', this.lang);
                window.scrollTo(0, 0);
            }
        });
    }
}
