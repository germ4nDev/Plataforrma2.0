/* eslint-disable @typescript-eslint/no-explicit-any */
// Angular import
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { catchError, tap } from 'rxjs/operators';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { LanguageSelectorComponent } from 'src/app/theme/shared/components/language-selector/language-selector.component';
import { FullScreenSliderComponent } from 'src/app/theme/shared/components/fullscreen-slider/fullscreen-slider.component';
import { PTLSuscriptorModel } from 'src/app/theme/shared/_helpers/models/PTLSuscriptor.model';
import { PTLUsuarioSCModel } from 'src/app/theme/shared/_helpers/models/PTLUsuarioSC.model';
import { PTLEmpresaSCModel } from 'src/app/theme/shared/_helpers/models/PTLEmpresaSC.model';
import { PTLUsuarioModel } from 'src/app/theme/shared/_helpers/models/PTLUsuario.model';
import { of, Subscription } from 'rxjs';
// import Swal from 'sweetalert2';
import {
  AuthenticationService,
  LocalStorageService,
  //   LocalStorageService,
  PtllogActividadesService,
  //   PtlEmpresasScService,
  //   PTLSuscriptoresService,
  //   PtlusuariosScService,
  //   PTLUsuariosService,
  SwalAlertService,
  ThemeService
} from 'src/app/theme/shared/service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, LanguageSelectorComponent, SharedModule, TranslateModule, FullScreenSliderComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  //#region VARIABLES
  classList!: { toggle: (arg0: string) => void };
  registrosSub?: Subscription;
  registros: PTLSuscriptorModel[] = [];
  usuariosSCSub?: Subscription;
  usuariosSC: PTLUsuarioSCModel[] = [];
  usuariosSub?: Subscription;
  usuarios: PTLUsuarioModel[] = [];
  empresasSCSub?: Subscription;
  empresasSC: PTLEmpresaSCModel[] = [];
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
    private translate: TranslateService,
    private _logActividadesService: PtllogActividadesService,
    private _localstorageService: LocalStorageService,
    private _swalService: SwalAlertService,
    private _themeService: ThemeService,
    private _authenticationService: AuthenticationService
  ) {
    if (this._authenticationService.currentUserValue) {
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
      const type = password?.getAttribute('type') === 'password' ? 'text' : 'password';
      password?.setAttribute('type', type);
      this.classList.toggle('icon-eye-off');
    });
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
    const userName = this.formValues?.['username']?.value;
    const password = this.formValues?.['password']?.value;
    this.loginSub = this._authenticationService
      .login(userName, password)
      .pipe(
        tap((resp: any) => {
          this.loading = false;
          console.log('resp login', resp);
          if (!resp.ok) {
            this._localstorageService.setTokenLocalStorage(resp.token);
            this._swalService.getAlertError(this.translate.instant('PLATAFORMA.USERNOTFOUND'));
            return;
          }

          const currentUser = this._localstorageService.getCurrentUserLocalStorage();
          console.log('++++++++ usuario activo', currentUser);
            if (currentUser === null) {
              console.log('el usuario no tiene roles asignados');
              this._swalService.getAlertError(this.translate.instant('PLATAFORMA.NOROLESASIGN'));
              this._localstorageService.setLogOut();
            } else {
              this.router.navigate(['/starter/inicio-suscriptores']);
            }

          console.log('Login exitoso:', resp.usuario.codigoUsuario);
          //   const logData = {
          //     codigoTipoLog: '',
          //     codigoRespuesta: '201',
          //     descripcionLog: this.translate.instant('PLATAFORMA.LOGINSUCCESS')
          //   };
          //   this._logActividadesService.postCrearRegistro(logData).subscribe(() => console.log('log creado exitosamente'));
          //   this._swalService.getAlertSuccess(this.translate.instant('PLATAFORMA.LOGINSUCCESS'));
          //   this._localStorageService.setSuscriptorLocalStorage(dataSuscriptor);
        }),
        catchError((err) => {
          this.loading = false;
          this.error = err;
          //   const logData = {
          //     codigoTipoLog: '',
          //     codigoRespuesta: '501',
          //     codigoUsuairo: userName,
          //     descripcionLog: this.translate.instant('PLATAFORMA.LOGINFAILED')
          //   };
          //   this._logActividadesService.postCrearRegistro(logData).subscribe(() => console.log('log creado exitosamente'));
          this._swalService.getAlertError(this.translate.instant('PLATAFORMA.LOGINFAILED'));
          return of(null);
        })
      )
      .subscribe();
    //   }
    // } else {
    //   const logData = {
    //     codigoTipoLog: '',
    //     codigoRespuesta: '501',
    //     descripcionLog: this.translate.instant('PLATAFORMA.USERNOTSUPSCRIPTOR')
    //   };
    //   this._logActividadesService.postCrearRegistro(logData).subscribe(() => console.log('log creado exitosamente'));
    //   this._swalService.getAlertError(this.translate.instant('PLATAFORMA.USERNOTSUPSCRIPTOR'));
    // }
  }

  toggleTheme() {
    this._themeService.toggleDarkTheme();
  }
}
