/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PTLModuloAP } from '../_helpers/models/PTLModuloAP.model';
import { PTLUsuarioModel } from '../_helpers/models/PTLUsuario.model';
import { LocalStorageService } from './local-storage.service';

const base_url = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class PtlmodulosApService {
  user: PTLUsuarioModel = new PTLUsuarioModel();

  constructor(
    private http: HttpClient,
    private _localStorageService: LocalStorageService
  ) {}

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
        'x-token': this.token
      }
    };
  }

  getRegistros() {
    // console.log('4');
    const url = `${base_url}/modulos`;
    return this.http.get(url).pipe(
      map((resp: any) => {
        // console.log('5');
        // console.log('servicio de modulos', resp);
        return {
          ok: true,
          modulos: resp.modulos
        };
      })
    );
  }

  getRegistroById(id: number) {
    const url = `${base_url}/modulos/${id}`;
    return this.http.get(url).pipe(
      map((resp: any) => {
        // // console.log('data de modulo', resp);
        return {
          ok: true,
          modulo: resp.modulo
        };
      })
    );
  }

  postCrearRegistro(data: PTLModuloAP) {
    const url = `${base_url}/modulos`;
    console.log('data del modulo', data);
    // return this.http.post(url, modulo);
    return this.http.post(url, data).pipe(
      map((resp: any) => {
        return {
          ok: true,
          modulo: resp.modulo
        };
      })
    );
  }

  putModificarRegistro(modulo: PTLModuloAP, moduloId: number) {
    const url = `${base_url}/modulos/${moduloId}`;
    return this.http.put(url, modulo).pipe(
      map((resp: any) => {
        // // console.log('data de modulo modificacda', resp);
        return {
          ok: true,
          modulo: resp.modulo
        };
      })
    );
  }

  deleteEliminarRegistro(_id: number) {
    const url = `${base_url}/modulos/${_id}`;
    return this.http.delete(url).pipe(
      map((resp: any) => {
        // // console.log('data de modulo eliminado', resp);
        return {
          ok: true,
          modulo: resp.modulo
        };
      })
    );
  }
}
