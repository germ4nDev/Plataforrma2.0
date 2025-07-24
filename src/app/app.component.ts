import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { ThemeStorageService } from './theme/shared/service/theme-storage.service';

    declare var feather: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {


  constructor(
    private router: Router,
    private themeStorage: ThemeStorageService
  ) {
    // const saved = this.themeStorage.load();
    // if (saved) {
    //   Object.assign(GradientConfig, saved);
    // }
    // this.translate.setDefaultLang('es');
    // const localLang = localStorage.getItem('lang') || 'es';
    // this.translate.use(localLang);
    // this.languageService.setLanguage(localLang);
  }

  ngAfterViewInit(): void {
    feather.replace();
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
