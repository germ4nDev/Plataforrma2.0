// // Angular Import
// import { Component, Input } from '@angular/core';
// import { NavigationItem } from '../../navigation';
// import { animate, style, transition, trigger } from '@angular/animations';
// import { GradientConfig } from 'src/app/app-config';

// @Component({
//   selector: 'app-nav-collapse',
//   templateUrl: './nav-collapse.component.html',
//   styleUrls: ['./nav-collapse.component.scss'],
//   animations: [
//     trigger('slideInOut', [
//       transition(':enter', [
//         style({ transform: 'translateY(-100%)', display: 'block' }),
//         animate('250ms ease-in', style({ transform: 'translateY(0%)' }))
//       ]),
//       transition(':leave', [animate('250ms ease-in', style({ transform: 'translateY(-100%)' }))])
//     ])
//   ]
// })
// export class NavCollapseComponent {
//   // public props
//   visible;
//   @Input() item!: NavigationItem;
//   gradientConfig;
//   themeLayout: string;

//   // constructor
//   constructor() {
//     this.visible = false;
//     this.gradientConfig = GradientConfig;
//     this.themeLayout = GradientConfig.layout;
//   }

//   // public method
//   navCollapse(e: MouseEvent) {
//     this.visible = !this.visible;

//     let parent = e.target as HTMLElement;
//     if (this.themeLayout === 'vertical') {
//       parent = (parent as HTMLElement).parentElement as HTMLElement;
//     }

//     const sections = document.querySelectorAll('.pcoded-hasmenu');
//     for (let i = 0; i < sections.length; i++) {
//       if (sections[i] !== parent) {
//         sections[i].classList.remove('pcoded-trigger');
//       }
//     }

//     let firstParent = parent.parentElement;
//     let preParent = ((parent as HTMLElement).parentElement as HTMLElement).parentElement as HTMLElement;
//     if (firstParent?.classList.contains('pcoded-hasmenu')) {
//       do {
//         firstParent?.classList.add('pcoded-trigger');
//         firstParent = ((firstParent as HTMLElement).parentElement as HTMLElement).parentElement as HTMLElement;
//       } while (firstParent.classList.contains('pcoded-hasmenu'));
//     } else if (preParent.classList.contains('pcoded-submenu')) {
//       do {
//         preParent?.parentElement?.classList.add('pcoded-trigger');
//         preParent = (((preParent as HTMLElement).parentElement as HTMLElement).parentElement as HTMLElement).parentElement as HTMLElement;
//       } while (preParent.classList.contains('pcoded-submenu'));
//     }
//     parent.classList.toggle('pcoded-trigger');
//   }
// }

import { Component, Input } from '@angular/core';
import { NavigationItem } from '../../../../../shared/_helpers/models/Navigation.model';
import { animate, style, transition, trigger } from '@angular/animations';
import { GradientConfig } from 'src/app/app-config';
import { CommonModule } from '@angular/common';
import { NavItemComponent } from '../nav-item/nav-item.component';
import { TranslateModule } from '@ngx-translate/core';
import { Router, RouterModule } from '@angular/router';
import { NavGroupComponent } from '../nav-group/nav-group.component';

@Component({
  selector: 'app-nav-collapse',
  standalone: true,
  imports: [CommonModule, NavItemComponent, NavGroupComponent, TranslateModule, RouterModule],
  templateUrl: './nav-collapse.component.html',
  styleUrls: ['./nav-collapse.component.scss'],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [style({ height: 0, overflow: 'hidden' }), animate('250ms ease-in', style({ height: '*', overflow: 'auto' }))]),
      transition(':leave', [animate('250ms ease-out', style({ height: 0, overflow: 'hidden' }))])
    ])
  ]
})
export class NavCollapseComponent {
  @Input() item!: NavigationItem;

  visible = false;
  gradientConfig = GradientConfig;
  themeLayout = GradientConfig.layout;

  navCollapse(event: MouseEvent): void {
    this.visible = !this.visible;
    const parent = (event.target as HTMLElement).closest('.pcoded-hasmenu');
    document.querySelectorAll('.pcoded-hasmenu').forEach((el) => {
      if (el !== parent) {
        el.classList.remove('pcoded-trigger');
      }
    });
    if (parent) {
      parent.classList.toggle('pcoded-trigger');
    }
  }

  //   navCollapse(event: MouseEvent): void {
  //     this.visible = !this.visible;

  //     let parent = event.target as HTMLElement;
  //     if (this.themeLayout === 'vertical') {
  //       parent = parent.parentElement as HTMLElement;
  //     }

  //     const sections = document.querySelectorAll('.pcoded-hasmenu');
  //     sections.forEach((el) => {
  //       if (el !== parent) el.classList.remove('pcoded-trigger');
  //     });

  //     let firstParent = parent.parentElement;
  //     let preParent = parent.parentElement?.parentElement as HTMLElement;

  //     if (firstParent?.classList.contains('pcoded-hasmenu')) {
  //       do {
  //         firstParent.classList.add('pcoded-trigger');
  //         firstParent = firstParent.parentElement?.parentElement as HTMLElement;
  //       } while (firstParent?.classList.contains('pcoded-hasmenu'));
  //     } else if (preParent?.classList.contains('pcoded-submenu')) {
  //       do {
  //         preParent.parentElement?.classList.add('pcoded-trigger');
  //         preParent = preParent.parentElement?.parentElement?.parentElement as HTMLElement;
  //       } while (preParent?.classList.contains('pcoded-submenu'));
  //     }

  //     parent.classList.toggle('pcoded-trigger');
  //   }
}
