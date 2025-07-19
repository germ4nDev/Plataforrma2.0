// Angular Import
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavSearchComponent } from './nav-search/nav-search.component';

@Component({
  selector: 'app-nav-left',
  standalone: true,
  imports: [CommonModule, NavSearchComponent],
  templateUrl: './nav-left.component.html',
  styleUrls: ['./nav-left.component.scss']
})
export class NavLeftComponent {}
