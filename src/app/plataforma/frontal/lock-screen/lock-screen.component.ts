import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-lock-screen',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  templateUrl: './lock-screen.component.html',
  styleUrl: './lock-screen.component.scss'
})
export class LockScreenComponent {
    constructor(private router: Router) {

    }
    unlokScreen() {
        this.router.navigate(['/frontal/unlock-screen']);
    }
}
