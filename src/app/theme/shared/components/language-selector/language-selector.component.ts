import { Component, OnDestroy, OnInit } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { LanguageService } from '../../service/lenguage.service'
import { NgSelectModule } from '@ng-select/ng-select'
import { FormsModule } from '@angular/forms'
import { CommonModule } from '@angular/common'
import { catchError, combineLatest, map, Observable, of, startWith, Subscription, switchMap, tap } from 'rxjs'
import { PTLIdioma } from '../../_helpers/models/PTLIdioma.model'
import { LocalStorageService, PtlidiomasService, UploadFilesService } from '../../service'

@Component({
  selector: 'app-language-selector',
  standalone: true,
  imports: [CommonModule, NgSelectModule, FormsModule],
  templateUrl: './language-selector.component.html',
  styleUrl: './language-selector.component.scss'
})
export class LanguageSelectorComponent implements OnInit, OnDestroy {
  selectedLang: string = ''
  languagesTransformadas$: Observable<PTLIdioma[]> = of([])
  languagesFiltradas$: Observable<PTLIdioma[]> = of([])
  languages: PTLIdioma[] = []
  suscPlataforma = ''
  defaultLang: PTLIdioma = new PTLIdioma()
  registrosSub = new Subscription()
  //   availableLanguages = [
  //     { code: 'en', label: 'English', flag: 'assets/flags/united-states.png' },
  //     { code: 'es', label: 'Español', flag: 'assets/flags/colombia.png' }
  //   ];

  constructor (
    private translate: TranslateService,
    private _localStorageService: LocalStorageService,
    private _uploadService: UploadFilesService,
    private languageService: LanguageService
  ) {
    this.suscPlataforma = this._localStorageService.getSuscriptorPlataformaLocalStorage()
  }

  ngOnInit (): void {
    this.selectedLang = localStorage.getItem('lang') || 'es';
    this.languageService.setLanguage(this.selectedLang);

    this.setupLanguagesStream();
  }

  ngOnDestroy (): void {
    this.registrosSub.unsubscribe()
  }

  //   setupLanguagesStream (): void {
  //     this.languages = this.languageService.getRegistrosActuales()
  //     this.languages.forEach(lang => {
  //       lang.flagIdioma = this._uploadService.getFilePath(this.suscPlataforma, 'idiomas', lang.flagIdioma || '')
  //     })
  //     console.log('Array de idiomas activos listo para usar:', this.languages)
  //   }

  setupLanguagesStream(): void {
    // Usamos el observable idiomas$ para "esperar" a que el servicio tenga los datos
    const sub = this.languageService.idiomas$.subscribe({
      next: (apps: PTLIdioma[]) => {
        // Solo procesamos si el array trae datos (cuando el backend responde)
        if (apps && apps.length > 0) {

          // Obtenemos el suscriptor en este momento por seguridad
          const plataforma = this._localStorageService.getSuscriptorPlataformaLocalStorage();

          this.languages = apps.map(lang => {
            // Creamos una copia para no modificar el objeto original del servicio
            return {
              ...lang,
              flagIdioma: this._uploadService.getFilePath(plataforma, 'idiomas', lang.flagIdioma || '')
            };
          });

          console.log('Idiomas cargados reactivamente en el Navbar:', this.languages);
        }
      },
      error: (err) => console.error('Error en el stream del Navbar:', err)
    });

    this.registrosSub.add(sub);
  }

  changeLanguage (langCode: string) {
    this.translate.use(langCode)
    this.languageService.setLanguage(langCode)
    this.selectedLang = langCode
    localStorage.setItem('lang', langCode)
    console.log('nuevo idioa hp', langCode)
  }

  get oppositeLanguage (): PTLIdioma | null {
    if (!this.languages || this.languages.length === 0) {
      return null
    }
    const currentLangCode = this.selectedLang || localStorage.getItem('lang') || 'es'
    const opposite = this.languages.find(lang => lang.siglaIdioma !== currentLangCode)
    return opposite || null
  }

  toggleLanguage (): void {
    const nextLang = this.oppositeLanguage
    if (nextLang && nextLang.siglaIdioma) {
      this.changeLanguage(nextLang.siglaIdioma)
    }
  }
}
