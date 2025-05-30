// Angular Import
import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    // constructor
    constructor(
        private router: Router,
        private translate: TranslateService
    ) {
        translate.addLangs(['en', 'es']);
        const lang = localStorage.getItem('lang') || '';
        if (lang == '') {
            localStorage.setItem('lang', 'es');
        }
        translate.setDefaultLang(lang);
        const browserLang = translate.getBrowserLang();
        translate.use(browserLang?.match(/en|es/) ? browserLang : 'es');
    }

    // life cycle event
    ngOnInit() {

        this.router.events.subscribe((evt) => {
            if (!(evt instanceof NavigationEnd)) {
                return;
            }
            window.scrollTo(0, 0);
        });
    }

    cambiarIdioma(lang: string) {
        this.translate.use(lang);
    }
}
