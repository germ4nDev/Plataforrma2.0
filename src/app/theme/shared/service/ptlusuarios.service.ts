/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { PTLUsuarioModel } from '../_helpers/models/PTLUsuario.model';
import { environment } from 'src/environments/environment';

const base_url = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class PTLUsuariosService {
  user: PTLUsuarioModel = new PTLUsuarioModel(0, 0, '', '', '', '', '', '', '', false, '');

  constructor(private http: HttpClient) {}

  get token(): string {
    this.user = JSON.parse(localStorage.getItem('currentUser') || '');
    if (this.user.serviceToken !== '') {
      return this.user.serviceToken || '';
    }
    return '';
  }

  get headers() {
    return {
      headers: {
        'x-token': this.token
      }
    };
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

  crearUsuario(usuario: PTLUsuarioModel) {
    const url = `${base_url}/usuarios`;
    return this.http.post(url, usuario);
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
