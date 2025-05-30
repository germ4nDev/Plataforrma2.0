// Angular Import
import { Component, EventEmitter, Output } from '@angular/core';
import { GradientConfig } from 'src/app/app-config';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent {
  // public props
  windowWidth: number;
  gradientConfig;
  @Output() NavMobCollapse = new EventEmitter();

  // constructor
  constructor() {
    this.gradientConfig = GradientConfig;
    this.windowWidth = window.innerWidth;
  }

  // public method
  navMobCollapse() {
    if (this.windowWidth < 992) {
      this.NavMobCollapse.emit();
    }
  }
}
