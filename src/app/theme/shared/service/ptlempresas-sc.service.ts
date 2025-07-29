import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PTLEmpresasSCModel } from '../_helpers/models/PTLEmpresaSC.model';
import { PTLUsuarioModel } from '../_helpers/models/PTLUsuario.model';

const base_url = environment.apiUrl;
@Injectable({
  providedIn: 'root'
})
export class PTLEmpresasSCService {
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
    const url = `${base_url}/empresas-sc`;
    return this.http.get(url)
    .pipe(
      map((resp: any) => {
        console.log('servicio de empresa', resp);
        return {
          ok: true,
          empresas: resp.empresas
        };
      })
    );
  }

  getRegistroById(id: number) {
    const url = `${base_url}/empresas-sc/${id}`;
    return this.http.get(url).pipe(
      map((resp: any) => {
        console.log('data de empresa', resp);
        return {
          ok: true,
          empresa: resp.empresa
        };
      })
    );
  }

  postCrearRegistro(empresa: PTLEmpresasSCModel) {
    const url = `${base_url}/empresas-sc`;
    return this.http.post(url, empresa);
  }

  putModificarRegistro(empresa: PTLEmpresasSCModel) {
    const url = `${base_url}/empresas-sc/${empresa.empresaId}`;
    return this.http.put(url, empresa).pipe(
      map((resp: any) => {
        console.log('data de empresa modificacda', resp);
        return {
          ok: true,
          empresa: resp.empresa
        };
      })
    );
  }

  deleteEliminarRegistro(_id: number) {
    const url = `${base_url}/empresas-sc/${_id}`;
    return this.http.delete(url).pipe(
      map((resp: any) => {
        console.log('data de empresa eliminado', resp);
        return {
          ok: true,
          empresa: resp.empresa
        };
      })
    );
  }
}
