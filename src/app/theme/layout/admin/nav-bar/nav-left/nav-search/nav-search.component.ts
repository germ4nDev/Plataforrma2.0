// Angular Import
import { Component } from '@angular/core';

@Component({
  selector: 'app-nav-search',
  templateUrl: './nav-search.component.html',
  styleUrls: ['./nav-search.component.scss']
})
export class NavSearchComponent {
  // public props
  searchOn: boolean;

  // constructor
  constructor() {
    this.searchOn = false;
  }
}
