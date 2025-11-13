/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, DoCheck, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { animate, style, transition, trigger } from '@angular/animations';
import { GradientConfig } from 'src/app/app-config';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageSelectorComponent } from 'src/app/theme/shared/components/language-selector/language-selector.component';
import { AuthenticationService, LanguageService, NavigationService, PtlColoresSettingsService, UploadFilesService } from 'src/app/theme/shared/service';
import { ChatUserListComponent } from './chat-user-list/chat-user-list.component';
import { ChatMsgComponent } from './chat-msg/chat-msg.component';
import { ThemeService } from 'src/app/theme/shared/service/theme.service';
import { FormsModule } from '@angular/forms';
import { LocalStorageService } from 'src/app/theme/shared/service/local-storage.service';
import { PTLUsuarioModel } from 'src/app/theme/shared/_helpers/models/PTLUsuario.model';
import { catchError, Observable, of, Subject, Subscription, tap } from 'rxjs';
import { PTLColorSettingModel } from 'src/app/theme/shared/_helpers/models/PTLColorSetting.model';

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
  public usuario: PTLUsuarioModel = new PTLUsuarioModel();
  public colorsettings: PTLColorSettingModel[] = [];
  public visibleUserList: boolean = false;
  public chatMessage: boolean = false;
  public friendId!: number;
  public gradientConfig = GradientConfig;
  public isDarkTheme: boolean = false;
  public themeSettings: any;
  public iconoTema: string = '';
  public avatarUsuario: string = '';
  public nombreUsuario: string = '';
  public navbarColor: string = '';
  public currentLanguage: string = 'es';
  public registrosSub?: Subscription;
  public themeTextKey: string = 'PLATAFORMA.NAVBAR.CHANGE_TO_DARK';
  public colorPalette: any[] = [];
  public lockScreenSubject = new Subject<string>();
  public lockScreenEvent$: Observable<string> = this.lockScreenSubject.asObservable();

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private themeService: ThemeService,
    private _localstorageService: LocalStorageService,
    private _uploadService: UploadFilesService,
    private _colorsettingsService: PtlColoresSettingsService,
    private _navigationService: NavigationService,
    private languageService: LanguageService
  ) {
    console.log('isDarkTheme', this.isDarkTheme);
    this.isDarkTheme = this.themeService.isDarkThemeEnabled();
    this.iconoTema = this.isDarkTheme ? 'icon feather icon-sun' : 'icon feather icon-moon';
    this.themeTextKey = this.isDarkTheme ? 'PLATAFORMA.NAVBAR.THEME_LIGHT' : 'PLATAFORMA.NAVBAR.THEME_DARK';
  }

  ngOnInit(): void {
    this.consultarColorsettings();
    this.usuario = this._localstorageService.getUsuarioLocalStorage();
    this.avatarUsuario = this._uploadService.getFilePath('0', 'usuarios', this.usuario.fotoUsuario || '');
    this.nombreUsuario = this.usuario.nombreUsuario || '';
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

  consultarColorsettings() {
    this.registrosSub = this._colorsettingsService
      .getRegistros()
      .pipe(
        tap((resp: any) => {
          if (resp.ok) {
            resp.coloresNav.forEach((color: PTLColorSettingModel) => {
              if (color.estadoColor == true) {
                const colorSetting = {
                  color: color.navbarColor,
                  iconos: color.iconosColor,
                  texto: color.textoColor,
                  hover: color.buttonsHoverColor
                };
                this.colorPalette.push(colorSetting);
              }
            });
            this.colorsettings = resp.coloresNav;
            console.log('Todos las colorSettings', this.colorPalette);
            return;
          }
        }),
        catchError((err) => {
          console.log('Ha ocurrido un error', err);
          return of(null);
        })
      )
      .subscribe();
  }

  toggleTheme(): void {
    this.themeService.toggleDarkTheme();
    this.isDarkTheme = !this.isDarkTheme;
    const settings = this._localstorageService.getThemeSettings();
    this.iconoTema = settings.isDarkTheme ? 'icon feather icon-sun' : 'icon feather icon-moon';
    this.themeTextKey = settings.isDarkTheme ? 'PLATAFORMA.NAVBAR.THEME_LIGHT' : 'PLATAFORMA.NAVBAR.THEME_DARK';
  }

  onNavbarColorChange(i: number): void {
    const color = this.colorPalette[i];
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

  perfilUsuario() {
    const user = this._localstorageService.getUsuarioLocalStorage();
    console.log('ver perfil del usuario', user.usuarioId);
    this.router.navigate(['frontal/perfil'], { queryParams: { regId: user.usuarioId } });
  }

  ngDoCheck() {
    const isRtl = document.querySelector('body')?.classList.contains('elite-rtl') || false;
    this.gradientConfig.isRtlLayout = isRtl;
  }

  lockscreen() {
    const currentUrl = this.router.url;
    console.log('ruta actual de navegacion', currentUrl);
    this._navigationService.emitLockScreen('saveForm');
    sessionStorage.setItem('locked_url', currentUrl);
    this.router.navigate(['/frontal/lock-screen']);
  }

  homeScreen() {
    this.router.navigate(['/frontal/inicio']);
  }

  suiteScreen() {
    this.router.navigate(['/frontal/launcher']);
  }

  logout() {
    this.authenticationService.logout();
  }
}
