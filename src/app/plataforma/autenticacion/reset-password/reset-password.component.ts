import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FullScreenSliderComponent } from "src/app/theme/shared/components/fullscreen-slider/fullscreen-slider.component";
import { LanguageSelectorComponent } from "src/app/theme/shared/components/language-selector/language-selector.component";

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [RouterModule, FullScreenSliderComponent, LanguageSelectorComponent, TranslateModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent {

    constructor() {}

}
