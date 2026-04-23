import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../service/lenguage.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { catchError, combineLatest, map, Observable, of, startWith, switchMap } from 'rxjs';
import { PTLIdioma } from '../../_helpers/models/PTLIdioma.model';
import { LocalStorageService, UploadFilesService } from '../../service';

@Component({
  selector: 'app-language-selector',
  standalone: true,
  imports: [CommonModule, NgSelectModule, FormsModule],
  templateUrl: './language-selector.component.html',
  styleUrl: './language-selector.component.scss'
})
export class LanguageSelectorComponent implements OnInit {
  selectedLang: string = '';
  languagesTransformadas$: Observable<PTLIdioma[]> = of([])
  languagesFiltradas$: Observable<PTLIdioma[]> = of([])
  languages: PTLIdioma[] = []
suscPlataforma = ''
defaultLang: PTLIdioma = new PTLIdioma()
//   availableLanguages = [
//     { code: 'en', label: 'English', flag: 'assets/flags/united-states.png' },
//     { code: 'es', label: 'Español', flag: 'assets/flags/colombia.png' }
//   ];


  constructor(
    private translate: TranslateService,
    private _localStorageService: LocalStorageService,
    private _uploadService: UploadFilesService,
    private languageService: LanguageService
  ) {
        this.suscPlataforma = this._localStorageService.getSuscriptorPlataformaLocalStorage()
    this.selectedLang = localStorage.getItem('lang') || 'es';
    this.languageService.setLanguage(this.selectedLang);
    console.log('current idioma hp', this.selectedLang)
  }

  ngOnInit(): void {
    this.setupAplicacionesStream()
  }

    setupAplicacionesStream (): void {
      // const suscriptor = this._localStorageService.getSuscriptorLocalStorage() ? this._localStorageService.getSuscriptorLocalStorage()  : {};
      // if (!suscriptor || !suscriptor.codigoSuscriptor) {
      //   console.error('Error: No se pudo obtener el suscriptor o su código. Operación de carga de registros abortada.');
      //   return;
      // }
      this.languagesTransformadas$ = this.languageService.idiomas$.pipe(
        switchMap((apps: PTLIdioma[]) => {
          if (!apps) return of([])
          const transformedApps = apps.map((app: any) => {
            app.nomEstado = app.estadoAplicacion ? 'Activo' : 'Inactivo'
              app.flagIdioma = this._uploadService.getFilePath(this.suscPlataforma, 'idiomas', app.flagIdioma)
            return app as PTLIdioma
          })
          this.languages = transformedApps
          console.log('todas las languages', this.languages)
          return of(transformedApps)
        }),
        catchError(err => {
          console.error('Error en el stream de languages:', err)
          return of([])
        })
      )
    }


  changeLanguage(langCode: string) {
    this.translate.use(langCode);
    this.languageService.setLanguage(langCode);
    this.selectedLang = langCode;
    localStorage.setItem('lang', langCode);
    console.log('nuevo idioa hp', langCode)
  }

  get oppositeLanguage() {
    const newLang = this.languages.find((lang: any) => lang.nombreIdioma !== this.translate.currentLang) || this.languages.find((lang: any) => lang.siglaIdioma == 'es')
    return newLang;
  }
}
