/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { PTLUsuarioModel } from '../../../../theme/shared/_helpers/models/PTLUsuario.model';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { PTLUsuariosService } from 'src/app/theme/shared/service/ptlusuarios.service';
import { UploadFilesService } from 'src/app/theme/shared/service/upload-files.service';
import { NavBarComponent } from 'src/app/theme/layout/admin/nav-bar/nav-bar.component';
import { NavContentComponent } from 'src/app/theme/layout/admin/navigation/nav-content/nav-content.component';
import { NavigationService } from 'src/app/theme/shared/service/navigation.service';
import {
  AuthenticationService,
  PtllogActividadesService,
  PTLRolesAPService,
  PtlusuariosRolesApService
} from 'src/app/theme/shared/service';
import { SwalAlertService } from 'src/app/theme/shared/service/swal-alert.service';
import { LocalStorageService } from 'src/app/theme/shared/service/local-storage.service';
import { v4 as uuidv4 } from 'uuid';
import Swal from 'sweetalert2';
import { TextEditorComponent } from 'src/app/theme/shared/components/text-editor/text-editor.component';
import { Observable, Subscription } from 'rxjs';
import { NavigationItem } from 'src/app/theme/shared/_helpers/models/Navigation.model';

@Component({
  selector: 'app-gestion-usuario',
  standalone: true,
  imports: [CommonModule, SharedModule, TranslateModule, NavBarComponent, NavContentComponent, TextEditorComponent],
  templateUrl: './gestion-usuario.component.html',
  styleUrl: './gestion-usuario.component.scss'
})
export class GestionUsuarioComponent implements OnInit {
  @Output() toggleSidebar = new EventEmitter<void>();
  usuario: PTLUsuarioModel = new PTLUsuarioModel();
  FormRegistro: PTLUsuarioModel = new PTLUsuarioModel();
  form: undefined;
  isSubmit: boolean = false;
  menuItems!: Observable<NavigationItem[]>;
  modoEdicion: boolean = false;
  codeRegistro = uuidv4();
  claveUsuario: string = '';
  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;
  userPhotoUrl: string = '';
  fileName: string = '';
  selectedFileUrl: string | null = null;
  isClaveActual: boolean = true;
  claveActual: string = '';
  tipoEditorTexto = 'basica';
  lockScreenSubscription: Subscription | undefined;
  isLocked: boolean = false;
  isUserRole: boolean = true;
  lockMessage: string = '';
  suscPlataforma: string = '';
  roles: any[] = [];
  todosLosRoles: any[] = [];
  tipoRolSeleccionado: string = '';
  rolesAsignadosAlUsuario: any[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private translate: TranslateService,
    private _logActividadesService: PtllogActividadesService,
    private _navigationService: NavigationService,
    private _registrosService: PTLUsuariosService,
    private _authService: AuthenticationService,
    private _swalAlertService: SwalAlertService,
    private _translate: TranslateService,
    private _localStorageService: LocalStorageService,
    private _usuariosRolesService: PtlusuariosRolesApService,
    private _rolesService: PTLRolesAPService,
    private _uploadService: UploadFilesService
  ) {
    this.isSubmit = false;
    this.suscPlataforma = this._localStorageService.getSuscriptorPlataformaLocalStorage();
    // console.log('datos del suscriptor', this.suscPlataforma);
    this.route.queryParams.subscribe((params) => {
      const registroId = params['regId'];
      if (registroId) {
        // console.log('me llena el Id', registroId);
        this.modoEdicion = true;
        this._registrosService.getUsuarioById(registroId).subscribe({
          next: (resp: any) => {
            this.usuario = resp.usuario;
            this.FormRegistro = resp.usuario;
            this.claveUsuario = resp.usuario.claveUsuario;
            this.selectedFileUrl = this._uploadService.getFilePath(this.suscPlataforma, 'usuarios', resp.usuario.fotoUsuario);
            this.FormRegistro.claveUsuario = '';
            this.FormRegistro.claveNew = '';
            this.FormRegistro.claveConfirm = '';
            this._usuariosRolesService.getRegistroByCodigoUsuario(registroId).subscribe((respRel: any) => {
              if (this.modoEdicion) {
                this.cargarRolesAsociados(registroId);
              } else {
                this.tipoRolSeleccionado = 'plataforma';
                this.consultarRoles();
              }
            });
          },
          error: () => {
            Swal.fire('Error', 'No se pudo obtener la Aplicación', 'error');
          }
        });
      } else {
        // console.log('no llena el Id', registroId);
        this.modoEdicion = false;
        this.consultarRoles();
        // this.FormRegistro.codigoAplicacion = uuidv4();
      }
    });
  }

  ngOnInit() {
    this.consultarRolesAplicacion();
    this.consultarRoles();
    this._navigationService.getNavigationItems();
    this.menuItems = this._navigationService.menuItems$;
    this.lockScreenSubscription = this._navigationService.lockScreenEvent$.subscribe({
      next: (message: string) => {
        this._localStorageService.setFormRegistro(this.FormRegistro);
        this.isLocked = true;
        this.lockMessage = message;
      },
      error: (err) => console.error('Error al suscribirse al evento de bloqueo:', err)
    });
    const form = this._localStorageService.getFormRegistro();
    if (form != undefined) {
      this.FormRegistro = form;
      this._localStorageService.removeFormRegistro();
    }
    if (!this.modoEdicion) {
      this.FormRegistro.codigoUsuario = uuidv4();
      this.FormRegistro.fotoUsuario = 'no-imagen.jpg';
      this.FormRegistro.usuarioAdministrador = false;
    //   console.log('formRegistro original', this.FormRegistro);
    }
  }

  consultarRolesAplicacion() {
    const navSettings = this._localStorageService.getNavSettingsLocalStorage();
    const codigo = navSettings.aplicacion?.codigoAplicacion || '';
    // console.log('aca hijuepuuuuuuuuuuuuuuuu', codigo);
    this._rolesService.getRegistroByCodeApp(codigo).subscribe((resp: any) => {
    //   console.log('roles de la aplicacion', resp);
      if (resp.roles.length > 0) {
        // console.log('yuppppiiiii');
      }
    });
  }

  validarClaveActual(claveActual: any) {
    // console.log('validar la clave', claveActual);
    const userName = this.FormRegistro.userNameUsuario || '';
    // console.log('validar el usuario', userName, claveActual);
    // console.log('data el usuario', this.FormRegistro);
    this._authService.verificarClaveActual(userName, claveActual).subscribe((data: any) => {
    //   console.log('data', data);
      if (data.ok == true) {
        if (this.FormRegistro.usuarioId === data.usuario.usuarioId) {
          this.isClaveActual = false;
        //   console.log('respuesta perfil', data);
        }
      } else {
        this.FormRegistro.claveNew = '';
        this.FormRegistro.claveConfirm = '';
        this.isClaveActual = true;
      }
    });
  }

  actualizarDescripcionRegistro(nuevoContenido: string): void {
    this.FormRegistro.descripcionUsuario = nuevoContenido;
    // console.log('Descripción de versión actualizada:', this.FormRegistro.descripcionUsuario);
    // if (this.validationForm && this.isSubmit) {
    // }
  }

  onFileSelectedClick(event: any) {
    const file: File = event.target.files[0];
    const codigo =
      this._localStorageService.getSuscriptorLocalStorage()?.codigoSuscriptor ||
      this._localStorageService.getSuscriptorPlataformaLocalStorage();
    const objUpload = {
      susc: codigo,
      tipo: 'usuarios',
      id: '0'
    };
    // console.log('objUpload', objUpload);
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.selectedFileUrl = e.target.result;
      };
      reader.readAsDataURL(file);
      this._uploadService.uploadUserPhoto(file, objUpload).subscribe({
        next: (path: any) => {
        //   console.log('resultado++++++++++++++++', path);
          this.fileName = path.nombreArchivo;
          this.FormRegistro.fotoUsuario = path.nombreArchivo;
        },
        error: () => {
          this._swalAlertService.getAlertError(this._translate.instant('PLATAFORMA.UPLOADPHOTOERROR'));
        }
      });
    } else {
      this.selectedFileUrl = null;
      this.userPhotoUrl = '';
    }
  }

  consultarRoles() {
    this._rolesService.getRoles().subscribe((resp: any) => {
      if (resp.ok) {
        this.todosLosRoles = resp.roles;

        // 1. Filtrar según el radio button seleccionado
        if (this.tipoRolSeleccionado === 'plataforma') {
          this.roles = this.todosLosRoles.filter((r: any) => !r.codigoAplicacion || r.codigoAplicacion === '');
        } else {
          this.roles = this.todosLosRoles.filter((r: any) => r.codigoAplicacion && r.codigoAplicacion !== '');
        }

        // 2. Mapear y marcar como 'checked' si el ID está en nuestra lista de "rolesAsignadosAlUsuario"
        this.roles = this.roles.map((r: any) => ({
          ...r,
          checked: this.rolesAsignadosAlUsuario.includes(r.codigoRole)
        }));
      }
    });
  }

  cargarRolesAsociados(codigoUsuario: string) {
    this._usuariosRolesService.getRegistroByCodigoUsuario(codigoUsuario).subscribe({
      next: (resp: any) => {
        if (resp.ok && Array.isArray(resp.usuarioRole)) {
          // Guardamos solo los IDs de los roles que el usuario ya tiene en la DB
          this.rolesAsignadosAlUsuario = resp.usuarioRole.map((ur: any) => ur.codigoRole);

          // Por defecto, al entrar a modificar, queremos ver Plataforma
          this.tipoRolSeleccionado = 'plataforma';
          this.consultarRoles(); // Esto dibujará la lista filtrada y marcará los checks
        }
      }
    });
  }

  btnAsociarTodosRolesClick() {
    const todosSeleccionados = this.roles.every((r: any) => r.checked);
    this.roles.forEach((r: any) => (r.checked = !todosSeleccionados));
  }

  btnGestionarUsuarioClick(form: any) {
    this.isSubmit = true;
    // if (!form.valid) {
    //   return;
    // }
    if (this.rolesAsignadosAlUsuario.length === 0) {
        this._swalAlertService.getAlertError('Debe seleccionar al menos un rol.');
        return;
    }

    const registroData = form.value as PTLUsuarioModel;

    if (this.modoEdicion) {
      // MODIFICAR REGISTRO
      if (this.FormRegistro.claveUsuario != '') {
        if (this.FormRegistro.claveNew == this.FormRegistro.claveConfirm) {
          registroData.claveUsuario = this.FormRegistro.claveNew;
          registroData.fotoUsuario = this.fileName;
          registroData.codigoUsuarioModificacion = this._localStorageService.getUsuarioLocalStorage().codigoUsuario;
          registroData.fechaModificacion = new Date().toISOString();
          this._registrosService.actualizarUsuarioClave(registroData).subscribe({
            next: (resp: any) => {
              if (resp.ok) {
                this.procesarRelaciones(registroData.codigoUsuario!);
                const logData = {
                  codigoTipoLog: '',
                  codigoRespuesta: '201',
                  descripcionLog: this.translate.instant('PLATAFORMA.MODIFICAR') + ', ' + resp.mensaje
                };
                this._logActividadesService.postCrearRegistro(logData).subscribe(() => console.log('log creado exitosamente'));
                this._swalAlertService.getAlertSuccess(this._translate.instant('PLATAFORMA.UPDATEUSERSUCCESS'));
                this.router.navigate(['/autenticacion/login']);
              } else {
                const logData = {
                  codigoTipoLog: '',
                  codigoRespuesta: '501',
                  descripcionLog: this.translate.instant('PLATAFORMA.NOMODIFICO') + ', ' + resp.mensaje
                };
                this._logActividadesService.postCrearRegistro(logData).subscribe(() => console.log('log creado exitosamente'));
                this._swalAlertService.getAlertError(resp.message || this._translate.instant('PLATAFORMA.UPDATEUSERERROR'));
              }
            },
            error: (err: any) => {
              console.error(err);
              const logData = {
                codigoTipoLog: '',
                codigoRespuesta: '501',
                descripcionLog: this.translate.instant('PLATAFORMA.NOMODIFICO') + ', ' + err.mensaje
              };
              this._logActividadesService.postCrearRegistro(logData).subscribe(() => console.log('log creado exitosamente'));
              this._swalAlertService.getAlertError(this._translate.instant('PLATAFORMA.UPDATEUSERERROR'));
            }
          });
        } else {
          const logData = {
            codigoTipoLog: '',
            codigoRespuesta: '501',
            descripcionLog: this.translate.instant('PLATAFORMA.NOMODIFICO')
          };
          this._logActividadesService.postCrearRegistro(logData).subscribe(() => console.log('log creado exitosamente'));
          this._swalAlertService.getAlertError(this._translate.instant('PLATAFORMA.PASSWORDSERROR'));
        }
      } else {
        if (this.FormRegistro.claveUsuario == '') {
          this.FormRegistro.claveUsuario = this.claveUsuario;
        }
        // console.log('************* fotoUsuario', this.FormRegistro.fotoUsuario);
        registroData.claveUsuario = this.FormRegistro.claveUsuario;
        registroData.fotoUsuario = this.FormRegistro.fotoUsuario;
        registroData.codigoUsuarioModificacion = this._localStorageService.getUsuarioLocalStorage().codigoUsuario;
        registroData.fechaModificacion = new Date().toISOString();
        this._registrosService.actualizarUsuarioDatos(registroData).subscribe({
          next: (resp: any) => {
            this.procesarRelaciones(registroData.codigoUsuario!);
            if (resp.ok) {
              const logData = {
                codigoTipoLog: '',
                codigoRespuesta: '201',
                descripcionLog: this.translate.instant('PLATAFORMA.MODIFICAR')
              };
              this._logActividadesService.postCrearRegistro(logData).subscribe(() => console.log('log creado exitosamente'));
              this._swalAlertService.getAlertSuccess(this._translate.instant('PLATAFORMA.UPDATEUSERSUCCESS'));
              this.router.navigate(['/usuarios/usuarios']);
            }
          },
          error: (err: any) => {
            console.error(err);
            const logData = {
              codigoTipoLog: '',
              codigoRespuesta: '501',
              descripcionLog: this.translate.instant('PLATAFORMA.NOMODIFICO') + ', ' + err.mensaje
            };
            this._logActividadesService.postCrearRegistro(logData).subscribe(() => console.log('log creado error'));
            this._swalAlertService.getAlertError(this._translate.instant('PLATAFORMA.UPDATEUSERERROR'));
          }
        });
      }
    } else {
      // INSERTAR REGISTRO
      registroData.claveUsuario = this.FormRegistro.claveUsuario;
      registroData.codigoUsuario = uuidv4();
      registroData.fotoUsuario = this.fileName !== '' ? this.fileName : 'no-imagen.png';
      registroData.fechaCreacion = new Date().toISOString();
      registroData.codigoUsuarioCreacion = this._localStorageService.getUsuarioLocalStorage().codigoUsuario;
      this._registrosService.crearUsuario(registroData).subscribe({
        next: (resp: any) => {
          if (resp.ok) {
            this.procesarRelaciones(registroData.codigoUsuario || '');
            const logData = {
              codigoTipoLog: '',
              codigoRespuesta: '201',
              descripcionLog: this.translate.instant('PLATAFORMA.INSERTAR')
            };
            this._logActividadesService.postCrearRegistro(logData).subscribe(() => console.log('log creado exitosamente'));
            this._swalAlertService.getAlertSuccess(this._translate.instant('PLATAFORMA.INSERTUSERSUCCESS'));
            form.resetForm();
            this.isSubmit = false;
            this.router.navigate(['/usuarios/usuarios']);
          }
        },
        error: (err: any) => {
          console.error(err);
          const logData = {
            codigoTipoLog: '',
            codigoRespuesta: '501',
            descripcionLog: this.translate.instant('PLATAFORMA.NOINSERTO') + ', ' + err.mensaje
          };
          this._logActividadesService.postCrearRegistro(logData).subscribe(() => console.log('log creado error'));
          const objUpload = {
            susc: this._localStorageService.getSuscriptorLocalStorage()?.codigoSuscriptor,
            tipo: 'usuarios',
            file: this.fileName
          };
          this._uploadService.deleteFilePath(objUpload).subscribe(() => console.log('Foto eliminada'));
          this._swalAlertService.getAlertError(this._translate.instant('PLATAFORMA.INSERTUSERERROR'));
        }
      });
    }
  }

  procesarRelaciones(codigoUsuario: string) {
    this._usuariosRolesService.deleteRolesPorUsuario(codigoUsuario).subscribe({
      next: () => {
          // Usamos los IDs que tenemos en la lista global de pestañas
            const rolesSeleccionados = this.todosLosRoles.filter((r) =>
                this.rolesAsignadosAlUsuario.includes(r.codigoRole)
            );
        // console.log('++++++QUEMETRAEEE++++', rolesSeleccionados)
        rolesSeleccionados.forEach((role) => {
          const nuevaRelacion = {
            codigoUsuarioSC: codigoUsuario,
            codigoRole: role.codigoRole,
            codigoEmpresaSC: '',
            codigoAplicacion: role.codigoAplicacion || '',
            codigoSuite: role.codigoSuite || '',
            tipoRol: role.tipoRol || 'Suscriptor',
            estadoUsuarioRole: true,
            codigoUsuarioCreacion: this._localStorageService.getUsuarioLocalStorage().codigoUsuario,
            fechaCreacion: new Date().toISOString(),
            codigoUsuarioModificacion: this._localStorageService.getUsuarioLocalStorage().codigoUsuario,
            fechaModificacion: new Date().toISOString()
          };

          this._usuariosRolesService.postUsuarioRole(nuevaRelacion).subscribe({
            next: () => console.log(`Rol ${role.nombreRole} asignado correctamente`),
            error: (err) => console.error('Error asociando rol', err)
          });
        });
      }
    });
  }

  toggleRolSeleccionado(rol: any) {
    if (rol.checked) {
      // Si lo marca y no estaba en la lista, lo agregamos
      if (!this.rolesAsignadosAlUsuario.includes(rol.codigoRole)) {
        this.rolesAsignadosAlUsuario.push(rol.codigoRole);
      }
    } else {
      // Si lo desmarca, lo quitamos de la lista global
      this.rolesAsignadosAlUsuario = this.rolesAsignadosAlUsuario.filter((id) => id !== rol.codigoRole);
    }
  }

  btnRegresarClick() {
    this.router.navigate(['/usuarios/usuarios']);
  }

  toggleNav(): void {
    this.toggleSidebar.emit();
  }
}
