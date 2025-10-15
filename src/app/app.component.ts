import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { ThemeStorageService } from './theme/shared/service/theme-storage.service';

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
