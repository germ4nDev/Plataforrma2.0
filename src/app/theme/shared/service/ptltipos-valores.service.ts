/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PTLUsuarioModel } from '../_helpers/models/PTLUsuario.model';
import { PTLTiposValoresModel } from '../_helpers/models/PTLTiposValores.model';
import { LocalStorageService } from './local-storage.service';

const base_url = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class PtltiposValoresService {
  user: PTLUsuarioModel = new PTLUsuarioModel();

  constructor(
    private http: HttpClient,
    private _localStorageService: LocalStorageService
  ) {}

  getRegistros() {
    const url = `${base_url}/tipos-valor`;
    return this.http.get(url).pipe(
      map((resp: any) => {
        console.log('servicio de tipoValor', resp);
        return {
          ok: true,
          tiposValor: resp.tiposValor
        };
      })
    );
  }

  getRegistroById(id: number) {
    const url = `${base_url}/tipos-valor/${id}`;
    return this.http.get(url).pipe(
      map((resp: any) => {
        console.log('data de tipoValor', resp);
        return {
          ok: true,
          tipoValor: resp.tipoValor
        };
      })
    );
  }

  postCrearRegistro(tipoValor: PTLTiposValoresModel) {
    const url = `${base_url}/tipos-valor`;
    return this.http.post(url, tipoValor);
  }

  putModificarRegistro(tipoValor: PTLTiposValoresModel) {
    const url = `${base_url}/tipos-valor/${tipoValor.tipoValorId}`;
    return this.http.put(url, tipoValor).pipe(
      map((resp: any) => {
        console.log('data de tipoValor modificacda', resp);
        return {
          ok: true,
          tipoValor: resp.tipoValor
        };
      })
    );
  }

  deleteEliminarRegistro(_id: number) {
    const url = `${base_url}/tipos-valor/${_id}`;
    return this.http.delete(url).pipe(
      map((resp: any) => {
        console.log('data de tipoValor eliminado', resp);
        return {
          ok: true,
          tipoValor: resp.tipoValor
        };
      })
    );
  }
}
