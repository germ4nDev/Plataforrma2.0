import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { GradientConfig } from 'src/app/app-config';
import { NavRightComponent } from './nav-right/nav-right.component';
import { NavSearchComponent } from './nav-left/nav-search/nav-search.component';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [CommonModule, RouterModule, NavRightComponent, NavSearchComponent],
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent {
  gradientConfig = GradientConfig;
  menuClass = false;
  collapseStyle = 'none';
  windowWidth = window.innerWidth;

  @Output() NavCollapse = new EventEmitter<void>();
  @Output() NavCollapsedMob = new EventEmitter<void>();

  constructor() {
    console.log('abriendo navbar');
  }

  toggleMobOption(): void {
    this.menuClass = !this.menuClass;
    this.collapseStyle = this.menuClass ? 'block' : 'none';
  }

  navCollapse(): void {
    if (this.windowWidth >= 992) {
      this.NavCollapse.emit();
    }
  }

  toggleSidebar() {
    this.gradientConfig.collapseMenu = !this.gradientConfig.collapseMenu;
  }
}
