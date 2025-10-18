/* eslint-disable @typescript-eslint/no-explicit-any */
// Angular import
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { catchError, tap } from 'rxjs/operators';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { AuthenticationService } from 'src/app/theme/shared/service/authentication.service';
import { of, Subscription } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageSelectorComponent } from 'src/app/theme/shared/components/language-selector/language-selector.component';
import Swal from 'sweetalert2';
import { ThemeService } from 'src/app/theme/shared/service';
import { FullScreenSliderComponent } from 'src/app/theme/shared/components/fullscreen-slider/fullscreen-slider.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, LanguageSelectorComponent, SharedModule, TranslateModule, FullScreenSliderComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  //#region VARIABLES
  classList!: { toggle: (arg0: string) => void };
  loginForm!: FormGroup;
  loginSub?: Subscription;
  usernameValue: string = '';
  userPassword: string = '';
  returnUrl!: string;
  error: string = '';
  loading: boolean = false;
  submitted: boolean = false;
  remember: boolean = false;
  //#endregion VARIABLES

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private _themeService: ThemeService,
    private authenticationService: AuthenticationService
  ) {
    // redirect to home if already logged in
    if (this.authenticationService.currentUserValue) {
      //    this.router.navigate(['/dashboard/analytics']);
    }
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    const togglePassword = document.querySelector('#togglePassword');
    const password = document.querySelector('#password');

    togglePassword?.addEventListener('click', () => {
      // toggle the type attribute
      const type = password?.getAttribute('type') === 'password' ? 'text' : 'password';
      password?.setAttribute('type', type);
      this.classList.toggle('icon-eye-off');
    });

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'];
  }

  OnDestroy() {
    this.loginSub?.unsubscribe();
  }

  get formValues() {
    return this.loginForm.controls;
  }

  get usernameControl() {
    return this.loginForm.get('username');
  }

  get passwordControl() {
    return this.loginForm.get('password');
  }

  onLoginUserClick(): void {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }
    this.error = '';
    this.loading = true;
    const email = this.formValues?.['username']?.value;
    const password = this.formValues?.['password']?.value;

    this.loginSub = this.authenticationService
      .login(email, password)
      .pipe(
        tap((resp: any) => {
          this.loading = false;
          if (!resp.ok) {
            Swal.fire({
              title: resp.msg,
              text: 'La dirección de correo electrónico ingresada no se encuentra registrada en nuestro sistema!',
              icon: 'error',
              showCloseButton: true
            });
            return;
          }
          console.log('Login exitoso:', resp);
          this.router.navigate(['/frontal/inicio']);
        }),
        catchError((err) => {
          this.loading = false;
          this.error = err;
          Swal.fire('Error', err, 'error');
          return of(null);
        })
      )
      .subscribe();
  }

  toggleTheme() {
    this._themeService.toggleDarkTheme();
  }
}
