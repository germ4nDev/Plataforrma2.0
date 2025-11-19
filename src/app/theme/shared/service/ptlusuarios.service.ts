/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';
import { PTLUsuarioModel } from '../_helpers/models/PTLUsuario.model';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { SocketService } from './sockets.service';
import { LocalStorageService } from './local-storage.service';

const base_url = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class PTLUsuariosService {
  user: PTLUsuarioModel = new PTLUsuarioModel();
  private _registros = new BehaviorSubject<PTLUsuarioModel[]>([]);
  private _registrosChange = new Subject<any>();
  _registrosChange$ = this._registrosChange.asObservable();

  constructor(
    private http: HttpClient,
    private socketService: SocketService,
    private _localStorageService: LocalStorageService
  ) {
    console.log('******* Servicio de usuarios iniciado correctamente');
    this.socketService.listen('usuarios-actualizada=os').subscribe({
      next: (payload) => {
        console.log('Evento de Socket.IO recibido:', payload.msg);
        this._registrosChange.next(payload);
        this.cargarRegistros().subscribe();
      },
      error: (err) => console.error('Error en la escucha de sockets:', err)
    });
  }

  get token(): string {
    const current = this._localStorageService.getCurrentUserLocalStorage();
    if (current.token !== '') {
      return current.token || '';
    }
    return '';
  }

  get headers() {
    return {
      headers: {
        // 'x-token': this.token
        'Content-Type': 'application/json'
      }
    };
  }

  get usuarios$(): Observable<PTLUsuarioModel[]> {
    return this._registros.asObservable();
  }

  cargarRegistros() {
    console.log('Consultando y ordenando usuarios del servidor...');
    const url = `${base_url}/usuarios`;
    return this.http.get(url, this.headers).pipe(
      map((resp: any) => resp.usuarios as PTLUsuarioModel[]),
      map((regs: PTLUsuarioModel[]) => {
        console.log('respuesta usuarios', regs);
        return regs.sort((a: any, b: any) => a.nombreUsuario.localeCompare(b.nombreUsuario));
      }),
      tap((RegistrosOrdenadas) => {
        this._registros.next(RegistrosOrdenadas);
      })
    );
  }

  getUsuarios() {
    return this.http.get<PTLUsuarioModel>(`${environment.apiUrl}/usuarios`).pipe(
      map((resp: any) => {
        console.log('respuesta servicio', resp);
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        return {
          ok: true,
          usuarios: resp.usuarios
        };
      })
    );
  }

  getUsuarioById(id: number) {
    const url = `${base_url}/usuarios/${id}`;
    return this.http.get(url).pipe(
      map((resp: any) => {
        console.log('data del usuario', resp);
        return {
          ok: true,
          usuario: resp.usuario
        };
      })
    );
  }

  crearUsuario(data: PTLUsuarioModel) {
    const url = `${base_url}/usuarios`;
    console.log('servicio tickets', data);
    return this.http.post(url, data).pipe(
      map((resp: any) => {
        return {
          ok: true,
          usurio: resp.usurio
        };
      })
    );
  }

  actualizarUsuario(usuario: PTLUsuarioModel) {
    const url = `${base_url}/usuarios/${usuario.usuarioId}`;
    return this.http.put(url, usuario).pipe(
      map((resp: any) => {
        console.log('data de usuario modificacda', resp);
        return {
          ok: true,
          usuario: resp.usuario
        };
      })
    );
  }

  actualizarUsuarioDatos(usuario: PTLUsuarioModel) {
    const url = `${base_url}/usuarios/datos/${usuario.usuarioId}`;
    return this.http.put(url, usuario).pipe(
      map((resp: any) => {
        console.log('data de usuario modificacda', resp);
        return {
          ok: true,
          usuario: resp.usuario
        };
      })
    );
  }

  actualizarUsuarioClave(usuario: PTLUsuarioModel) {
    const url = `${base_url}/usuarios/clave/${usuario.usuarioId}`;
    return this.http.put(url, usuario).pipe(
      map((resp: any) => {
        console.log('data de usuario modificacda', resp);
        return {
          ok: true,
          usuario: resp.usuario
        };
      })
    );
  }

  eliminarUsuairo(_id: number) {
    const url = `${base_url}/usuarios/${_id}`;
    return this.http.delete(url).pipe(
      map((resp: any) => {
        console.log('data de usuario eliminado', resp);
        return {
          ok: true,
          usuario: resp.usuario
        };
      })
    );
  }
}
