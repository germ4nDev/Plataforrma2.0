import { Component, Input } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { Router, RouterModule } from '@angular/router';
import { GradientConfig } from 'src/app/app-config';
import { NavigationItem } from '../../../../../shared/_helpers/models/Navigation.model';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-nav-item',
  standalone: true,
  imports: [CommonModule, TranslateModule, RouterModule],
  templateUrl: './nav-item.component.html',
  styleUrls: ['./nav-item.component.scss']
})
export class NavItemComponent {
  @Input() item!: NavigationItem;
  gradientConfig;
  themeLayout: string;

  constructor(
    private router: Router,
    private location: Location
) {
    console.log('item nav item', this.item);

    this.gradientConfig = GradientConfig;
    this.themeLayout = GradientConfig.layout;
  }

  closeOtherMenu(event: MouseEvent) {
    if (this.themeLayout === 'vertical') {
      const target = event.target as HTMLElement;
      const menuItem = target.closest('.pcoded-hasmenu') as HTMLElement;

      const sections = document.querySelectorAll('.pcoded-hasmenu');
      sections.forEach((el) => {
        el.classList.remove('active', 'pcoded-trigger');
      });

      if (menuItem) {
        menuItem.classList.add('active', 'pcoded-trigger');
      }

      const navigation = document.querySelector('app-navigation.pcoded-navbar');
      if (navigation?.classList.contains('mob-open')) {
        navigation.classList.remove('mob-open');
      }
    } else {
      setTimeout(() => {
        const sections = document.querySelectorAll('.pcoded-hasmenu');
        sections.forEach((el) => {
          el.classList.remove('active', 'pcoded-trigger');
        });

        let current_url = this.location.path();
        // @ts-ignore
        if (this.location['_baseHref']) {
          // @ts-ignore
          current_url = this.location['_baseHref'] + this.location.path();
        }

        const link = `a.nav-link[href='${current_url}']`;
        const ele = document.querySelector(link);

        if (ele) {
          const menuItem = ele.closest('.pcoded-hasmenu');
          if (menuItem) {
            menuItem.classList.add('active');
          }
        }
      }, 500);
    }
  }
}
