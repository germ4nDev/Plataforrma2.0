import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { GradientConfig } from 'src/app/app-config';
import { NavigationItem } from '../../admin/navigation/navigation';
import { NavigationService } from '../../../shared/service/navigation.service';
import { CommonModule } from '@angular/common';
import { NavContentComponent } from './nav-content/nav-content.component';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {
  // public props
  windowWidth: number;
  gradientConfig;
  @Output() NavMobCollapse = new EventEmitter();

  navigationItems: NavigationItem[] = [];

  constructor(private navigationService: NavigationService) {
    this.gradientConfig = GradientConfig;
    this.windowWidth = window.innerWidth;
  }

  ngOnInit(): void {
    const appCode = localStorage.getItem('aplicacionId') || 'plataforma';
    this.navigationItems = this.navigationService.getNavigationItems(appCode);
    console.log('navigationItems', this.navigationItems);

  }

  navMobCollapse() {
    if (this.windowWidth < 992) {
      this.NavMobCollapse.emit();
    }
  }
}
