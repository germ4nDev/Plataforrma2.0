/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, DoCheck, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { animate, style, transition, trigger } from '@angular/animations';
import { GradientConfig } from 'src/app/app-config';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageSelectorComponent } from 'src/app/theme/shared/components/language-selector/language-selector.component';
import { AuthenticationService, LanguageService } from 'src/app/theme/shared/service';
import { ChatUserListComponent } from './chat-user-list/chat-user-list.component';
import { ChatMsgComponent } from './chat-msg/chat-msg.component';
import { ThemeService } from 'src/app/theme/shared/service/theme.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-nav-right',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NgbDropdownModule,
    TranslateModule,
    FormsModule,
    LanguageSelectorComponent,
    ChatUserListComponent,
    ChatMsgComponent
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
export class NavRightComponent implements DoCheck, OnInit {
  visibleUserList: boolean = false;
  chatMessage: boolean = false;
  friendId!: number;
  gradientConfig = GradientConfig;
  isDarkTheme: boolean = false;
  iconoTema: string = '';
  navbarColor: string = '';
  currentLanguage: string = 'es';
  colorPalette: any[] = [
    { color: '#66b5ff', iconos: '#000', texto: '#000' },
    { color: '#2c3e50', iconos: '#fff', texto: '#fff' },
    { color: '#c0392b', iconos: '#fff', texto: '#fff' },
    { color: '#27ae60', iconos: '#fff', texto: '#fff' },
    { color: '#f39c12', iconos: '#000', texto: '#000' }
  ];

  constructor(
    private authenticationService: AuthenticationService,
    private themeService: ThemeService,
    private languageService: LanguageService
  ) {
    console.log('abriendo navbar-right', this.colorPalette);
    console.log('isDarkTheme', this.isDarkTheme);
    this.iconoTema = this.isDarkTheme ? 'fas fa-sun' : 'fas fa-moon';
  }

  ngOnInit(): void {
    this.themeService.isDarkTheme$.subscribe((isDark) => {
      this.isDarkTheme = isDark;
    });
    this.themeService.navbarColor$.subscribe((color) => {
      this.navbarColor = color;
    });
    this.languageService.currentLang$.subscribe((lang) => {
      this.currentLanguage = lang;
    });
  }

  toggleTheme(): void {
    this.themeService.toggleDarkTheme();
    console.log('isDarkTheme', this.isDarkTheme);
    this.iconoTema = this.isDarkTheme ? 'fas fa-sun' : 'fas fa-moon';
  }

  onNavbarColorChange(i: number): void {
    const color = this.colorPalette[i];
    console.log('palette color', color);
    this.themeService.setNavbarColor(color.color);
    this.themeService.setIconosColor(color.iconos);
    this.themeService.setTextoColor(color.texto);
  }

  changeLanguage(event: Event): void {
    const lang = (event.target as HTMLSelectElement).value;
    this.languageService.setLanguage(lang);
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
