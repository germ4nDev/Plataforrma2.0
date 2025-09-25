/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PTLModuloAP } from '../_helpers/models/PTLModuloAP.model';
import { PTLUsuarioModel } from '../_helpers/models/PTLUsuario.model';

const base_url = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class PTLPaquetesAplicacionesService {
  user: PTLUsuarioModel = new PTLUsuarioModel();

  constructor(private http: HttpClient) {}

  get token(): string {
    this.user = JSON.parse(localStorage.getItem('currentUser') || '');
    return this.user.serviceToken || '';
  }

  get headers() {
    return {
      headers: {
        'x-token': this.token
      }
    };
  }

  getRegistros() {
    const url = `${base_url}/modulos-ap`;
    return this.http.get(url)
    .pipe(
      map((resp: any) => {
        console.log('servicio de modulo', resp);
        return {
          ok: true,
          modulos: resp.modulos
        };
      })
    );
  }

  getRegistroById(id: number) {
    const url = `${base_url}/modulos-ap/${id}`;
    return this.http.get(url).pipe(
      map((resp: any) => {
        console.log('data de modulo', resp);
        return {
          ok: true,
          modulo: resp.modulo
        };
      })
    );
  }

  postCrearRegistro(modulo: PTLModuloAP) {
    const url = `${base_url}/modulos-ap`;
    return this.http.post(url, modulo);
  }

  putModificarRegistro(modulo: PTLModuloAP) {
    const url = `${base_url}/modulos-ap/${modulo.ModuloId}`;
    return this.http.put(url, modulo).pipe(
      map((resp: any) => {
        console.log('data de modulo modificacda', resp);
        return {
          ok: true,
          modulo: resp.modulo
        };
      })
    );
  }

  deleteEliminarRegistro(_id: number) {
    const url = `${base_url}/modulos-ap/${_id}`;
    return this.http.delete(url).pipe(
      map((resp: any) => {
        console.log('data de modulo eliminado', resp);
        return {
          ok: true,
          modulo: resp.modulo
        };
      })
    );
  }
}
