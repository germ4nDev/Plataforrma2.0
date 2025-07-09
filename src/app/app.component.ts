import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(
    private router: Router
  ) {
    // this.translate.setDefaultLang('es');
    // const localLang = localStorage.getItem('lang') || 'es';
    // this.translate.use(localLang);
    // this.languageService.setLanguage(localLang);
  }

  ngOnInit() {
    this.router.events.subscribe((evt) => {
      if (evt instanceof NavigationEnd) {
        // this.lang = this.languageService.getCurrentLanguage();
        // this.translate.use(this.lang);
        // localStorage.setItem('lang', this.lang);
        window.scrollTo(0, 0);
      }
    });
  }
}
