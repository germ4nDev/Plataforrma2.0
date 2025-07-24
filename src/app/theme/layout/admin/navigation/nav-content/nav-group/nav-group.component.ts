import { Component, Input } from '@angular/core';
import { NavigationItem } from '../../../../../shared/_helpers/models/Navigation.model';
import { CommonModule } from '@angular/common';
import { NavCollapseComponent } from '../nav-collapse/nav-collapse.component';
import { NavItemComponent } from '../nav-item/nav-item.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-nav-group',
  standalone: true,
  imports: [CommonModule, NavCollapseComponent, NavItemComponent, TranslateModule],
  templateUrl: './nav-group.component.html',
  styleUrls: ['./nav-group.component.scss']
})
export class NavGroupComponent {
  @Input() item!: NavigationItem;

  constructor() {    console.log('item nav group', this.item);
}
}
