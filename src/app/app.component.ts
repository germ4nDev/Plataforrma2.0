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
    lang: string = '';
    // constructor
    constructor(
        private router: Router,
        private translate: TranslateService
    ) {
        localStorage.setItem('lang', 'es');
        translate.addLangs(['en', 'es']);
        this.lang = localStorage.getItem('lang') || '';
        const browserLang = translate.getBrowserLang();
        translate.use(browserLang?.match(/en|es/) ? browserLang : 'es');
    }

    // life cycle event
    ngOnInit() {
        this.translate.use('es');
        this.router.events.subscribe((evt) => {
            if (!(evt instanceof NavigationEnd)) {
                return;
            }
            // this.cambiarIdioma(this.lang);
            window.scrollTo(0, 0);
        });
    }

    cambiarIdioma(lang: string) {
        console.log('default lang', lang);
        // this.translate.setDefaultLang(this.lang);
        this.translate.use(lang);
    }
}
