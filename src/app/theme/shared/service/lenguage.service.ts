import { Injectable } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { BehaviorSubject, map, Observable, Subject, tap } from 'rxjs'
import { PTLIdioma } from '../_helpers/models/PTLIdioma.model'
import { HttpClient } from '@angular/common/http'
import { LocalStorageService } from './local-storage.service'
import { SocketService } from './sockets.service'
import { environment } from 'src/environments/environment'
const base_url = environment.apiUrl

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private _idiomas = new BehaviorSubject<PTLIdioma[]>([])
  private _idiomasChange = new Subject<any>()
  idiomasChange$ = this._idiomasChange.asObservable()

  private currentLangSubject = new BehaviorSubject<string>(localStorage.getItem('lang') || 'es')
  currentLang$ = this.currentLangSubject.asObservable()

  constructor (
    private http: HttpClient,
    private _socketService: SocketService,
    private _localStorageService: LocalStorageService,
    private translate: TranslateService
  ) {
    // const savedLang = localStorage.getItem('lang') || 'es';
    console.log('localLanguage', localStorage.getItem('lang') || 'es')
    this._socketService.listen('idiomas-actualizadas').subscribe({
      next: payload => {
        console.log('Evento de Socket.IO recibido:', payload.msg)
        this._idiomasChange.next(payload)
        this.cargarRegistros().subscribe()
      },
      error: err => console.error('Error en la escucha de sockets:', err)
    })
    // this.setLanguage(savedLang);
  }

  setLanguage (lang: string) {
    this.translate.use(lang)
    localStorage.setItem('lang', lang)
    console.log('New localLanguage', lang)
    this.currentLangSubject.next(lang)
  }

  getCurrentLanguage (): string {
    return this.currentLangSubject.getValue()
  }

  get idiomas$ (): Observable<PTLIdioma[]> {
    return this._idiomas.asObservable()
  }

  cargarRegistros () {
    console.log('Consultando y ordenando actividadesRoles del servidor...')
    const url = `${base_url}/idiomas`
    return this.http.get(url).pipe(
      map((resp: any) => resp.idiomas as PTLIdioma[]),
      tap(idiomasOrder => {
        this._idiomas.next(idiomasOrder)
      })
    )
  }
}
