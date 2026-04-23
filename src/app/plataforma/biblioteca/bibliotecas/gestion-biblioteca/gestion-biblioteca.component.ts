/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, EventEmitter, OnInit, Output } from '@angular/core'
import { CommonModule } from '@angular/common'
import { Router, ActivatedRoute } from '@angular/router'
import { GradientConfig } from 'src/app/app-config'
import { TextEditorComponent } from 'src/app/theme/shared/components/text-editor/text-editor.component'
import { SharedModule } from 'src/app/theme/shared/shared.module'
import {
  LocalStorageService,
  PtlAplicacionesService,
  PtllogActividadesService,
  SwalAlertService,
  UploadFilesService
} from 'src/app/theme/shared/service'
import { TranslateModule, TranslateService } from '@ngx-translate/core'
import { NavigationItem } from 'src/app/theme/shared/_helpers/models/Navigation.model'
import { PTLLogActividadAPModel } from 'src/app/theme/shared/_helpers/models/PTLlogActividadAP.model'
import { PTLBiblioteca } from 'src/app/theme/shared/_helpers/models/PTLBiblioteca.model'
import { PtlBibliotecaService } from 'src/app/theme/shared/service/ptlbiblioteca.service'
import { NavigationService } from 'src/app/theme/shared/service/navigation.service'
import { NavBarComponent } from 'src/app/theme/layout/admin/nav-bar/nav-bar.component'
import { NavContentComponent } from 'src/app/theme/layout/admin/navigation/nav-content/nav-content.component'
import { catchError, Observable, of, Subscription, tap } from 'rxjs'
import { v4 as uuidv4 } from 'uuid'
import Swal from 'sweetalert2'
import { PTLAplicacionModel } from 'src/app/theme/shared/_helpers/models/PTLAplicacion.model'

@Component({
  selector: 'app-gestion-biblioteca',
  standalone: true,
  imports: [CommonModule, SharedModule, TranslateModule, NavBarComponent, NavContentComponent, TextEditorComponent],
  templateUrl: './gestion-biblioteca.component.html',
  styleUrl: './gestion-biblioteca.component.scss'
})
export class GestionBibliotecaComponent implements OnInit {
  @Output() toggleSidebar = new EventEmitter<void>()
  FormRegistro: PTLBiblioteca = new PTLBiblioteca()
  logActividad: PTLLogActividadAPModel = new PTLLogActividadAPModel()
  menuItems$!: Observable<NavigationItem[]>
  gradientConfig: any
  navCollapsed: boolean = false
  navCollapsedMob: boolean = false
  windowWidth: number = 0
  aplicaciones: PTLAplicacionModel[] = []
  aplicacionesSub?: Subscription

  selectedFile: File | null = null
  previewUrl: string | ArrayBuffer | null = null
  userPhotoUrl: string = ''
  fileName: string | null = null
  selectedFileUrl: string | null = null

  isSubmit: boolean = false
  modoEdicion: boolean = false
  codeBiblioteca = uuidv4()
  tipoEditorTexto = 'basica'
  lockScreenSubscription: Subscription | undefined
  isLocked: boolean = false
  lockMessage: string = ''

  constructor (
    private router: Router,
    private route: ActivatedRoute,
    private translate: TranslateService,
    private _navigationService: NavigationService,
    private _localStorageService: LocalStorageService,
    private _logActividadesService: PtllogActividadesService,
    private _aplicacionesService: PtlAplicacionesService,
    private _bibliotecaService: PtlBibliotecaService,
    private _swalService: SwalAlertService,
    private _translate: TranslateService,
    private _uploadService: UploadFilesService
  ) {
    this.isSubmit = false
    GradientConfig.header_fixed_layout = true
    this.gradientConfig = GradientConfig
    this.navCollapsed = this.windowWidth >= 992 ? GradientConfig.isCollapse_menu : false
    this.navCollapsedMob = false
    this._navigationService.getNavigationItems()
    const regId = this._localStorageService.getObject<string>('regId') || ''
    if (regId !== 'nuevo') {
      this.modoEdicion = true
      this._bibliotecaService.getBibliotecaById(regId).subscribe({
        next: (resp: any) => {
          this.FormRegistro = resp.biblioteca
          this.codeBiblioteca = resp.biblioteca.codigoBiblioteca
        },
        error: () => {
          Swal.fire('Error', 'No se pudo obtener la Biblioteca', 'error')
        }
      })
    } else {
      this.FormRegistro.imagenBiblioteca = 'no-imagen.png'
    }
    this.route.queryParams.subscribe(params => {
      if (Object.keys(params).length > 0) {
      }
    })
  }

  ngOnInit () {
    this.menuItems$ = this._navigationService.menuItems$
    this.lockScreenSubscription = this._navigationService.lockScreenEvent$.subscribe({
      next: (message: string) => {
        this._localStorageService.setFormRegistro(this.FormRegistro)
        this.isLocked = true
        this.lockMessage = message
      },
      error: err => console.error('Error al suscribirse al evento de bloqueo:', err)
    })
    this.consultarAplicaciones()
    const form = this._localStorageService.getFormRegistro()
    if (form != undefined) {
      this.FormRegistro = form
      this._localStorageService.removeFormRegistro()
    }

    if (this.modoEdicion == false) {
      this.FormRegistro.codigoBiblioteca = uuidv4()
      this.FormRegistro.estadoBiblioteca = true
      console.log('FormRegistro loading', this.FormRegistro)
    }
    console.log('Inicial formregistro', this.FormRegistro)
  }

  consultarAplicaciones () {
    this.aplicacionesSub = this._aplicacionesService
      .getAplicaciones()
      .pipe(
        tap((resp: any) => {
          if (resp.ok) {
            this.aplicaciones = resp.aplicaciones
            return
          }
        }),
        catchError(err => {
          console.log('Ha ocurrido un error', err)
          return of(null)
        })
      )
      .subscribe()
  }

  onAplicacionChangeClick (event: any) {
    const value = event.target.value
    const app = this.aplicaciones.filter(x => x.codigoAplicacion == value)[0]
    this.FormRegistro.codigoAplicacion = app.codigoAplicacion || ''
  }

  actualizarDescripcionVersion (nuevoContenido: string): void {
    this.FormRegistro.descripcionBiblioteca = nuevoContenido
    console.log('Descripción actualizada:', this.FormRegistro.descripcionBiblioteca)
  }

  onFileSelectedClick (event: any) {
    const file: File = event.target.files[0]
    const objUpload = {
      susc: 'plataforma',
      tipo: 'biblioteca',
      id: '0'
    }
    console.log('archivo seleccionado', file)

    if (file) {
      const reader = new FileReader()
      reader.onload = (e: any) => {
        this.selectedFileUrl = e.target.result
      }
      reader.readAsDataURL(file)
      this._uploadService.uploadUserPhoto(file, objUpload).subscribe({
        next: (path: any) => {
          console.log('resultado', path)
          this.FormRegistro.imagenBiblioteca = path.nombreArchivo
          this.userPhotoUrl = path.nombreArchivo
        },
        error: () => {
          this._swalService.getAlertError(this._translate.instant('PLATAFORMA.UPLOADPHOTOERROR'))
        }
      })
    } else {
      this.selectedFileUrl = null
      this.userPhotoUrl = ''
    }
  }

  btnGestionarBibliotecaClick (form: any) {
    // this.isSubmit = true;
    const registroData = form.value as PTLBiblioteca
    console.log('formRegistro', form.value)
    if (this.modoEdicion) {
      registroData.codigoAplicacion = this.FormRegistro.codigoAplicacion
      registroData.codigoUsuarioCreacion = this._localStorageService.getUsuarioLocalStorage().codigoUsuario
      registroData.fechaCreacion = new Date().toISOString()
      this._bibliotecaService.actualizarBiblioteca(this.FormRegistro).subscribe({
        next: (resp: any) => {
          if (resp.ok) {
            const logData = {
              codigoTipoLog: '',
              codigoRespuesta: '201',
              descripcionLog: this.translate.instant('BIBLIOTECA.UPDATESUCCSESSFULLY')
            }
            this._logActividadesService.postCrearRegistro(logData).subscribe()
            this._swalService.getAlertSuccess(this.translate.instant('BIBLIOTECA.UPDATESUCCSESSFULLY'))
            form.resetForm()
            this.router.navigate(['/biblioteca/biblioteca'])
          }
        },
        error: (err: any) => {
          console.error(err)
          const logData = {
            codigoTipoLog: '',
            codigoRespuesta: '501',
            descripcionLog: this.translate.instant('BIBLIOTECA.UPDATEERROR')
          }
          this._logActividadesService.postCrearRegistro(logData).subscribe()
          this._swalService.getAlertError('No se pudo actualizar la Biblioteca')
        }
      })
    } else {
      console.log('imagen biblioteca', this.FormRegistro.imagenBiblioteca)

      registroData.codigoBiblioteca = this.FormRegistro.codigoBiblioteca // Mantener el UUID generado
      registroData.codigoAplicacion = this.FormRegistro.codigoAplicacion
      registroData.descripcionBiblioteca = this.FormRegistro.descripcionBiblioteca // Asegurar el texto del editor
      registroData.imagenBiblioteca = this.userPhotoUrl // Asegurar el texto del editor
      registroData.codigoUsuarioCreacion = this._localStorageService.getUsuarioLocalStorage().codigoUsuario
      registroData.fechaCreacion = new Date().toISOString()
      console.log('Crear biblioteca', registroData)

      this._bibliotecaService.crearBiblioteca(registroData).subscribe({
        next: (resp: any) => {
          if (resp.ok) {
            const logData = {
              codigoTipoLog: '',
              codigoRespuesta: '201',
              descripcionLog: this.translate.instant('BIBLIOTECA.CREATESUCCSESSFULLY')
            }
            this._logActividadesService.postCrearRegistro(logData).subscribe()
            this._swalService.getAlertSuccess(this.translate.instant('BIBLIOTECA.CREATESUCCSESSFULLY'))
            form.resetForm()
            this.router.navigate(['/biblioteca/biblioteca'])
          }
        },
        error: (err: any) => {
          console.error(err)
          const logData = {
            codigoTipoLog: '',
            codigoRespuesta: '500',
            descripcionLog: this.translate.instant('BIBLIOTECA.CREATEERROR')
          }
          this._logActividadesService.postCrearRegistro(logData).subscribe()
          this._swalService.getAlertError('No se pudo crear la Biblioteca')
        }
      })
    }
  }

  btnRegresarClick () {
    this.router.navigate(['/bibliotecas/bibliotecas'])
  }

  navMobClick () {
    if (this.windowWidth < 992) {
      if (this.navCollapsedMob && !document.querySelector('app-navigation.pcoded-navbar')?.classList.contains('mob-open')) {
        this.navCollapsedMob = !this.navCollapsedMob
        setTimeout(() => {
          this.navCollapsedMob = !this.navCollapsedMob
        }, 100)
      } else {
        this.navCollapsedMob = !this.navCollapsedMob
      }
    }
  }

  toggleNav (): void {
    this.toggleSidebar.emit()
  }
}
