import { Component, EventEmitter, Output, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { Router } from '@angular/router'
import { BehaviorSubject, Observable, Subscription, combineLatest, of } from 'rxjs'
import { catchError, map, startWith, switchMap, tap, shareReplay } from 'rxjs/operators'
import { GradientConfig } from 'src/app/app-config'

import { SharedModule } from 'src/app/theme/shared/shared.module'
import { TranslateModule, TranslateService } from '@ngx-translate/core'
import { DatatableComponent } from 'src/app/theme/shared/components/data-table/data-table.component'
import { NavBarComponent } from 'src/app/theme/layout/admin/nav-bar/nav-bar.component'
import { NavContentComponent } from 'src/app/theme/layout/admin/navigation/nav-content/nav-content.component'
import { NavigationService } from 'src/app/theme/shared/service/navigation.service'
import { NavigationItem } from 'src/app/theme/shared/_helpers/models/Navigation.model'
import { PTLUsuariosService } from 'src/app/theme/shared/service/ptlusuarios.service'
import { PTLSuscriptoresService, PtlusuariosScService } from 'src/app/theme/shared/service'
import { BaseSessionModel } from 'src/app/theme/shared/_helpers/models/BaseSession.model'
import { PTLLogActividadAPModel } from 'src/app/theme/shared/_helpers/models/PTLlogActividadAP.model'
import { PTLUsuarioSCModel } from 'src/app/theme/shared/_helpers/models/PTLUsuarioSC.model'
import { LocalStorageService, PtllogActividadesService } from 'src/app/theme/shared/service'
import { PTLUsuarioModel } from 'src/app/theme/shared/_helpers/models/PTLUsuario.model'
import { PTLSuscriptorModel } from 'src/app/theme/shared/_helpers/models/PTLSuscriptor.model'
import Swal from 'sweetalert2'

@Component({
  selector: 'app-usuarios-suscriptor',
  standalone: true,
  imports: [CommonModule, SharedModule, TranslateModule, DatatableComponent, NavBarComponent, NavContentComponent],
  templateUrl: './usuarios-suscriptor.component.html',
  styleUrl: './usuarios-suscriptor.component.scss'
})
export class UsuariosSuscriptorComponent implements OnInit {
  @Output() toggleSidebar = new EventEmitter<void>()
  DataModel: BaseSessionModel = new BaseSessionModel()
  DataLogActividad: PTLLogActividadAPModel = new PTLLogActividadAPModel()
  moduloTituloExcel: string = ''
  hasFiltersSlot: boolean = false
  gradientConfig
  lang = localStorage.getItem('lang')
  menuItems$!: Observable<NavigationItem[]>
  activeTab: 'menu' | 'filters' | 'main' = 'menu'
  codigoSuscriptor: string = ''

  subscriptions = new Subscription()
  filtroNombreSubject = new BehaviorSubject<string>('todos')
  filtroEstadoSubject = new BehaviorSubject<string>('todos')

  usuariosSCTransformados$: Observable<PTLUsuarioSCModel[]> = of([])
  usuariosSCFiltrados$: Observable<PTLUsuarioSCModel[]> = of([])
  usuarios: PTLUsuarioModel[] = []
  suscriptores: PTLSuscriptorModel[] = []
  usuariosSC: PTLUsuarioSCModel[] = []
  registrosSub?: Subscription

  constructor (
    private _usuariosService: PTLUsuariosService,
    private _usuariosSCService: PtlusuariosScService,
    private _suscriptoresService: PTLSuscriptoresService,
    private _navigationService: NavigationService,
    private _localStorageService: LocalStorageService,
    private _logActividadesService: PtllogActividadesService,
    private router: Router,
    private translate: TranslateService
  ) {
    this.gradientConfig = GradientConfig
  }

  ngOnInit () {
    this._navigationService.getNavigationItems()
    this.menuItems$ = this._navigationService.menuItems$
    this.hasFiltersSlot = true
    this.moduloTituloExcel = this.lang == 'es' ? 'Listado de Suitees' : 'List of Aplications'
    this.consultarUsuarios()
    this.consultarSuscriptores()
    //this.consultarRegistros()
    setTimeout(() => {
      this.setupRegistrosStream()
    }, 100)
    this.subscriptions.add(
      this._usuariosSCService.cargarRegistros().subscribe(
        () => console.log('Modulos cargadas y guardadas en el servicio'),
        err => console.error('Error al cargar aplicaciones:', err)
      )
    )
  }

  consultarUsuarios () {
    this.subscriptions.add(
      this._usuariosService.getUsuarios().subscribe((resp: any) => {
        if (resp.ok) {
          this.usuarios = resp.usuarios
          console.log('Todos las usuarios', this.usuarios)
          return
        }
      })
    )
  }

  consultarSuscriptores () {
    this.subscriptions.add(
      this._suscriptoresService.getRegistros().subscribe((resp: any) => {
        if (resp.ok) {
          this.suscriptores = resp.suscriptores
          console.log('Todos las suscriptores', this.suscriptores)
          return
        }
      })
    )
  }

  consultarRegistros (): void {
    this.registrosSub = this._usuariosSCService
      .cargarRegistros()
      .pipe(
        tap((resp: any) => {
          if (resp.ok) {
            resp.usuariosSC.forEach((reg: any) => {
              reg.nomEstado = reg.estadoPaquete ? 'Activo' : 'Inactivo'
              reg.nomPromocion = reg.promocion ? 'Si' : 'No'
            })
            console.log('todos los paquetes', resp)
            this.usuariosSC = resp.usuariosSC
          }
        }),
        catchError(err => {
          console.error(err)
          return of([])
        })
      )
      .subscribe()
  }

  //   setupRegistrosStream1 (): void {
  //     this.usuariosSCTransformados$ = this._usuariosSCService.usuariosSC$.pipe(
  //       switchMap((paqs: PTLUsuarioSCModel[]) => {
  //         if (!paqs) return of([])
  //         console.log('todos los usuarios sc', paqs)
  //         const transformed = paqs.map((usu: any) => {
  //           const susc = this.suscriptores.filter(x => x.codigoSuscriptor == usu.codigoSuscriptor)[0]
  //           const usus = this.usuarios.filter(x => x.codigoUsuario == usu.codigoUsuario)[0]
  //           usu.nombreUsuario = usus.nombreUsuario
  //           usu.nombreSuscriptor = susc.nombreSuscriptor
  //           usu.nomEstado = usu.estadoUsuario ? 'Activo' : 'Inactivo'
  //           this.codigoSuscriptor = usu.codigoSuscriptor
  //           return usu as PTLUsuarioSCModel
  //         })
  //         this.usuariosSC = transformed
  //         return of(transformed)
  //       }),
  //       catchError(err => {
  //         console.error('Error en el stream de aplicaciones:', err)
  //         return of([])
  //       })
  //     )

  //     this.usuariosSCFiltrados$ = combineLatest([
  //       this.usuariosSCTransformados$.pipe(startWith([])),
  //       this.filtroNombreSubject,
  //       this.filtroEstadoSubject
  //     ]).pipe(
  //       map(([paqs, nombre, estado]) => {
  //         let filteredusuariosSC = paqs

  //         if (nombre) {
  //           const textoFiltro = nombre.toLowerCase()
  //           filteredusuariosSC = filteredusuariosSC.filter((mod: any) => (mod.nombreUusario || '').toLowerCase().includes(textoFiltro))
  //         }

  //         if (estado !== 'todos') {
  //           const estadoBoolean = estado === 'true'
  //           filteredusuariosSC = filteredusuariosSC.filter((mod: any) => mod.estadoUsuarioSC === estadoBoolean)
  //         }

  //         return filteredusuariosSC
  //       })
  //     )
  //   }

  setupRegistrosStream (): void {
    this.usuariosSCTransformados$ = this._usuariosSCService.usuariosSC$.pipe(
      map((paqs: PTLUsuarioSCModel[]) => {
        if (!paqs) return []
        const suscrMap = new Map(this.suscriptores.map(s => [s.codigoSuscriptor, s]))
        const userMap = new Map(this.usuarios.map(u => [u.codigoUsuario, u]))

        return paqs.map(usu => {
          const susc = suscrMap.get(usu.codigoSuscriptor)
          const usus = userMap.get(usu.codigoUsuario)

          return {
            ...usu,
            nombreUsuario: usus?.nombreUsuario || 'N/A',
            nombreSuscriptor: susc?.nombreSuscriptor || 'N/A',
            nomEstado: usu.estadoUsuario ? 'Activo' : 'Inactivo'
          } as PTLUsuarioSCModel
        })
      }),
      tap(transformed => (this.usuariosSC = transformed)),
      catchError(err => {
        console.error('Error en el stream:', err)
        return of([])
      }),
      shareReplay(1)
    )

    this.usuariosSCFiltrados$ = combineLatest([
      this.usuariosSCTransformados$.pipe(startWith([])),
      this.filtroNombreSubject.pipe(
        startWith(''),
        map(n => n.toLowerCase())
      ),
      this.filtroEstadoSubject.pipe(startWith('todos'))
    ]).pipe(
      map(([usuarios, nombre, estado]) => {
        return usuarios.filter(usu => {
          const matchesNombre = !nombre || (usu.nombreUsuario || '').toLowerCase().includes(nombre)
          const matchesEstado = estado === 'todos' || usu.estadoUsuario === (estado === 'true')
          return matchesNombre && matchesEstado
        })
      })
    )
  }

  columnasUsuarios = [
    { name: 'colCodigoUsuarioSC', header: 'USUARIOSSC.CODIGO_SUARIOSC', type: 'text' },
    { name: 'colCodigoUsuario', header: 'USUARIOSSC.CODIGO_USUARIO', type: 'text' },
    { name: 'colCodigoSuscriptor', header: 'USUARIOSSC.CODIGO_SUSCRIPTOR', type: 'text' },
    { name: 'nomEstado', header: 'PLATAFORMA.STATUS', type: 'estado' }
  ]

  onFiltroNombreChange (event: any) {
    this.filtroNombreSubject.next(event.target.value || '')
  }

  onFiltroEstadoChange (event: any) {
    this.filtroEstadoSubject.next(event.target.value || 'todos')
  }

  OnNuevoRegistroClick () {
    this._localStorageService.setObject('codId', this.codigoSuscriptor)
    this._localStorageService.setObject('regId', 'nuevo')
    this.router.navigate(['/suscriptor/gestion-usuario'])
  }

  OnEditarRegistroClick (event: any) {
    const id = event.id || event
    this._localStorageService.setObject('regId', 'nuevo')
    this.router.navigate(['/suscriptor/gestion-usuario'])
  }

  OnEliminarRegistroClick (id: string): void {
    const nombre = this.usuariosSC.filter(x => x.codigoUsuarioSC == id)[0]
    Swal.fire({
      title: this.translate.instant('APLICACIONES.ELIMINARTITULO'),
      text: this.translate.instant('APLICACIONES.ELIMINARTEXTO') + `"${nombre.nombreUsuario}".`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: this.translate.instant('PLATAFORMA.DELETE'),
      cancelButtonText: this.translate.instant('PLATAFORMA.CANCEL')
    }).then(result => {
      if (result.isConfirmed) {
        this._usuariosSCService.eliminarUsuairo(id).subscribe({
          next: (resp: any) => {
            const logData = {
              codigoTipoLog: '',
              codigoRespuesta: '201',
              descripcionLog: this.translate.instant('APLICACIONES.ELIMINAREXITOSA') + ' ' + resp.mensaje
            }
            this._logActividadesService.postCrearRegistro(logData).subscribe(() => console.log('log creado exitosamente'))
            Swal.fire(this.translate.instant('APLICACIONES.ELIMINAREXITOSA'), resp.mensaje, 'success')
            this.setupRegistrosStream()
          },
          error: err => {
            const logData = {
              codigoTipoLog: '',
              codigoRespuesta: '501',
              descripcionLog: this.translate.instant('APLICACIONES.ELIMINARERROR') + ' ' + err.mensaje
            }
            this._logActividadesService.postCrearRegistro(logData).subscribe(() => console.log('log creado exitosamente'))
            Swal.fire('Error', this.translate.instant('APLICACIONES.ELIMINARERROR'), 'error')
          }
        })
      }
    })
  }

  toggleNav (): void {
    this.toggleSidebar.emit()
  }
}
