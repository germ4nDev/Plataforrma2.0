import { Component, DoCheck } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { animate, style, transition, trigger } from '@angular/animations';
import { GradientConfig } from 'src/app/app-config';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageSelectorComponent } from 'src/app/theme/shared/components/language-selector/language-selector.component';
import { AuthenticationService } from 'src/app/theme/shared/service';
import { ChatUserListComponent } from './chat-user-list/chat-user-list.component';
import { ChatMsgComponent } from './chat-msg/chat-msg.component';
import { NavLeftComponent } from '../nav-left/nav-left.component';
import { NavSearchComponent } from '../nav-left/nav-search/nav-search.component';

@Component({
  selector: 'app-nav-right',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NgbDropdownModule,
    TranslateModule,
    LanguageSelectorComponent,
    ChatUserListComponent,
    ChatMsgComponent,
    NavLeftComponent,
    NavSearchComponent
  ],
  templateUrl: './nav-right.component.html',
  styleUrls: ['./nav-right.component.scss'],
  animations: [
    trigger('slideInOutLeft', [
      transition(':enter', [style({ transform: 'translateX(100%)' }), animate('300ms ease-in', style({ transform: 'translateX(0%)' }))]),
      transition(':leave', [animate('300ms ease-in', style({ transform: 'translateX(100%)' }))])
    ]),
    trigger('slideInOutRight', [
      transition(':enter', [style({ transform: 'translateX(-100%)' }), animate('300ms ease-in', style({ transform: 'translateX(0%)' }))]),
      transition(':leave', [animate('300ms ease-in', style({ transform: 'translateX(-100%)' }))])
    ])
  ]
})
export class NavRightComponent implements DoCheck {
  visibleUserList: boolean = false;
  chatMessage: boolean = false;
  friendId!: number;
  gradientConfig = GradientConfig;

  constructor(
    private authenticationService: AuthenticationService,
    private translate: TranslateService
  ) {
    console.log('abriendo navbar-right');

  }

  onChatToggle(friendID: any) {
    this.friendId = friendID;
    this.chatMessage = !this.chatMessage;
  }

  ngDoCheck() {
    const isRtl = document.querySelector('body')?.classList.contains('elite-rtl') || false;
    this.gradientConfig.isRtlLayout = isRtl;
  }

  logout() {
    this.authenticationService.logout();
  }
}
