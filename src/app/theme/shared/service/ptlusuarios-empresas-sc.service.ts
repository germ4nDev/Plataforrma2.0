/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PTLUsuarioModel } from '../_helpers/models/PTLUsuario.model';
import { PTLUsuaioEmpresasSCModel } from '../_helpers/models/PTLUsuarioEmpresaSC.model';
import { LocalStorageService } from './local-storage.service';

const base_url = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class PtlusuariosEmpresasScService {
  curentUser: PTLUsuarioModel = new PTLUsuarioModel();

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
    const url = `${base_url}/usuarios-empresas-sc`;
    return this.http.get(url).pipe(
      map((resp: any) => {
        console.log('servicio de usuariosEmpresas', resp.usuariosEmpresas);
        return {
          ok: true,
          usuariosEmpresas: resp.usuariosEmpresas
        };
      })
    );
  }

  getRegistroById(id: string) {
    const url = `${base_url}/usuarios-empresas-sc/${id}`;
    return this.http.get(url).pipe(
      map((resp: any) => {
        console.log('data de usuarioEmpresa', resp);
        return {
          ok: true,
          usuarioEmpresa: resp.usuarioEmpresa
        };
      })
    );
  }

  postCrearRegistro(data: any) {
    console.log('servicio usuarioEmpresa', data);
    const url = `${base_url}/usuarios-empresas-sc`;
    return this.http.post(url, data).pipe(
      map((resp: any) => {
        return {
          ok: true,
          usuarioEmpresa: resp.usuarioEmpresa
        };
      })
    );
  }

  putModificarRegistro(usuarioEmpresa: PTLUsuaioEmpresasSCModel) {
    const url = `${base_url}/usuarios-empresas-sc/${usuarioEmpresa.codigoUsuarioEmpresaSC}`;
    return this.http.put(url, usuarioEmpresa).pipe(
      map((resp: any) => {
        console.log('data de usuarioEmpresa modificacda', resp);
        return {
          ok: true,
          usuarioEmpresa: resp.usuarioEmpresaAP
        };
      })
    );
  }

  deleteEliminarRegistro(_id: string) {
    const url = `${base_url}/usuarios-empresas-sc/${_id}`;
    return this.http.delete(url).pipe(
      map((resp: any) => {
        console.log('data de usuarioEmpresa eliminado', resp);
        return {
          ok: true,
          usuarioEmpresa: resp.usuarioEmpresa
        };
      })
    );
  }
}
