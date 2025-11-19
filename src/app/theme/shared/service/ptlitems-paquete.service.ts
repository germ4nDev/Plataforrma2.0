/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PTLItemPaquete } from '../_helpers/models/PTLItemPaquete.model';
import { PTLUsuarioModel } from '../_helpers/models/PTLUsuario.model';
import { LocalStorageService } from './local-storage.service';

const base_url = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class PtlItemsPaqueteService {
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
    const url = `${base_url}/items-itemPaquete`;
    return this.http.get(url).pipe(
      map((resp: any) => {
        console.log('servicio de itemsPaquete', resp);
        return {
          ok: true,
          itemsPaquete: resp.itemsPaquete
        };
      })
    );
  }

  getRegistroById(id: number) {
    const url = `${base_url}/items-itemPaquete/${id}`;
    return this.http.get(url).pipe(
      map((resp: any) => {
        console.log('data de itemPaquete', resp);
        return {
          ok: true,
          itemPaquete: resp.itemPaquete
        };
      })
    );
  }

  postCrearRegistro(itemPaquete: PTLItemPaquete) {
    const url = `${base_url}/items-paquete`;
    return this.http.post(url, itemPaquete);
  }

  putModificarRegistro(itemPaquete: PTLItemPaquete) {
    const url = `${base_url}/items-itemPaquete/${itemPaquete.itemId}`;
    return this.http.put(url, itemPaquete).pipe(
      map((resp: any) => {
        console.log('data de itemPaquete modificacdo', resp);
        return {
          ok: true,
          itemPaquete: resp.itemPaquete
        };
      })
    );
  }

  deleteEliminarRegistro(_id: number) {
    const url = `${base_url}/items-itemPaquete/${_id}`;
    return this.http.delete(url).pipe(
      map((resp: any) => {
        console.log('data de itemPaquete eliminado', resp);
        return {
          ok: true,
          itemPaquete: resp.itemPaquete
        };
      })
    );
  }
}
