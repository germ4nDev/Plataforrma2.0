/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { PTLUsuarioSCModel } from '../_helpers/models/PTLUsuarioSC.model';
import { PTLUsuarioModel } from '../_helpers/models/PTLUsuario.model';

const base_url = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class PtlusuariosScService {
  user: PTLUsuarioModel = new PTLUsuarioModel();

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

  getUsuariosSC() {
    return this.http.get<PTLUsuarioSCModel>(`${environment.apiUrl}/usuarios-sc`).pipe(
      map((resp: any) => {
        console.log('respuesta servicio usuariosSC', resp);
        return {
          ok: true,
          usuarios: resp.usuariosSC
        };
      })
    );
  }

  getUsuarioById(id: number) {
    const url = `${base_url}/usuarios-sc/${id}`;
    return this.http.get(url).pipe(
      map((resp: any) => {
        console.log('data del usuario', resp);
        return {
          ok: true,
          usuario: resp.usuarioSC
        };
      })
    );
  }

  crearUsuario(usuario: PTLUsuarioSCModel) {
    const url = `${base_url}/usuarios-sc`;
    return this.http.post(url, usuario);
  }

  actualizarUsuario(data: PTLUsuarioSCModel) {
    const url = `${base_url}/usuarios-sc/${data.codigoUsuarioSC}`;
    return this.http.put(url, data).pipe(
      map((resp: any) => {
        console.log('data de usuario modificacda', resp);
        return {
          ok: true,
          usuario: resp.usuarioSC
        };
      })
    );
  }

  actualizarUsuarioDatos(usuario: PTLUsuarioSCModel) {
    const url = `${base_url}/usuarios-sc/datos/${usuario.codigoUsuarioSC}`;
    return this.http.put(url, usuario).pipe(
      map((resp: any) => {
        console.log('data de usuario modificacda', resp);
        return {
          ok: true,
          usuario: resp.usuarioSC
        };
      })
    );
  }

  eliminarUsuairo(_id: string) {
    const url = `${base_url}/usuarios-sc/${_id}`;
    return this.http.delete(url).pipe(
      map((resp: any) => {
        console.log('data de usuario eliminado', resp);
        return {
          ok: true,
          usuario: resp.usuarioSC
        };
      })
    );
  }
}
