/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { PTLEmpresaSCModel } from '../_helpers/models/PTLEmpresaSC.model';
import { PTLUsuarioModel } from '../_helpers/models/PTLUsuario.model';

const base_url = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class PtlEmpresasScService {
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

  getEmpresasSC() {
    return this.http.get<PTLEmpresaSCModel>(`${environment.apiUrl}/empresas-sc`).pipe(
      map((resp: any) => {
        console.log('respuesta servicio empresas', resp);
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        return {
          ok: true,
          empresas: resp.empresasSC
        };
      })
    );
  }

  getEmpresaById(id: number) {
    const url = `${base_url}/empresas-sc/${id}`;
    return this.http.get(url).pipe(
      map((resp: any) => {
        console.log('data del empresa', resp);
        return {
          ok: true,
          empresa: resp.empresaSC
        };
      })
    );
  }

  crearEmpresa(empresa: PTLEmpresaSCModel) {
    const url = `${base_url}/empresas-sc`;
    return this.http.post(url, empresa);
  }

  actualizarEmpresa(data: PTLEmpresaSCModel) {
    const url = `${base_url}/empresas-sc/${data.codigoEmpresaSC}`;
    return this.http.put(url, data).pipe(
      map((resp: any) => {
        console.log('data de empresa modificacda', resp);
        return {
          ok: true,
          empresa: resp.empresaSC
        };
      })
    );
  }

  eliminarEmpresa(_id: string) {
    const url = `${base_url}/empresas-sc/${_id}`;
    return this.http.delete(url).pipe(
      map((resp: any) => {
        console.log('data de empresa eliminado', resp);
        return {
          ok: true,
          empresa: resp.empresaSC
        };
      })
    );
  }
}
