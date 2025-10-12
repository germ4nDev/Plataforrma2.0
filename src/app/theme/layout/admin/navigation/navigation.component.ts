import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { GradientConfig } from 'src/app/app-config';
import { NavigationItem } from '../../admin/navigation/navigation';
import { NavigationService } from '../../../shared/service/navigation.service';
import { CommonModule } from '@angular/common';
import { NavContentComponent } from './nav-content/nav-content.component';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [CommonModule, NavContentComponent],
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {
  // public props
  @Output() NavMobCollapse = new EventEmitter();
  windowWidth: number;
  gradientConfig;
  navigationItems!: Observable<NavigationItem[]>;

  constructor(private _navigationService: NavigationService) {
    this.gradientConfig = GradientConfig;
    this.windowWidth = window.innerWidth;
  }

  ngOnInit(): void {
    this._navigationService.getNavigationItems();
    this.navigationItems = this._navigationService.menuItems$;

    console.log('navigationItems', this.navigationItems);
  }

  navMobCollapse() {
    if (this.windowWidth < 992) {
      this.NavMobCollapse.emit();
    }
  }
}
