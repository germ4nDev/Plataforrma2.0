// Angular Import
import { Component, DoCheck } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { GradientConfig } from 'src/app/app-config';

// bootstrap
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { AuthenticationService } from 'src/app/theme/shared/service';

// third party
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../../../shared/service/lenguage.service';

@Component({
    selector: 'app-nav-right',
    templateUrl: './nav-right.component.html',
    styleUrls: ['./nav-right.component.scss'],
    providers: [NgbDropdownConfig],
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
    // public props
    visibleUserList: boolean;
    chatMessage: boolean;
    friendId!: number;
    gradientConfig = GradientConfig;
    // languages = this.languageService.getLanguages();
    currentLang = this.languageService.getCurrentLanguage();

    // constructor
    constructor(
        private authenticationService: AuthenticationService,
        private translate: TranslateService,
        private languageService: LanguageService
    ) {
        this.visibleUserList = false;
        this.chatMessage = false;
    }

    // public method
    onChatToggle(friendID: number) {
        this.friendId = friendID;
        this.chatMessage = !this.chatMessage;
    }

    ngDoCheck() {
        if (document.querySelector('body')?.classList.contains('elite-rtl')) {
            this.gradientConfig.isRtlLayout = true;
        } else {
            this.gradientConfig.isRtlLayout = false;
        }
    }

    logout() {
        this.authenticationService.logout();
    }

    // user according language change of sidebar menu item
    changeLang(event: Event) {
        const lang = (event.target as HTMLSelectElement).value;
        this.languageService.setLanguage(lang);
        this.currentLang = lang;
    }

    // useLanguage(language: string) {
    //     this.translate.use(language);
    // }
}
