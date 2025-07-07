/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { PTLRoleAPModel } from '../_helpers/models/PTLRoleAP.model';
import { PTLUsuarioModel } from '../_helpers/models/PTLUsuario.model';

const base_url = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class PTLRolesAPService {
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
    const url = `${base_url}/roles`;
    return this.http.get(url).pipe(
      map((resp: any) => {
        console.log('servicio de roles', resp);
        return {
          ok: true,
          roles: resp.roles
        };
      })
    );
  }

  getRegistroById(id: number) {
    const url = `${base_url}/roles/${id}`;
    return this.http.get(url).pipe(
      map((resp: any) => {
        console.log('data de roles', resp);
        return {
          ok: true,
          role: resp.role
        };
      })
    );
  }

  postCrearRegistro(role: PTLRoleAPModel) {
    const url = `${base_url}/roles`;
    return this.http.post(url, role);
  }

  putModificarRegistro(role: PTLRoleAPModel) {
    const url = `${base_url}/roles/${role.roleId}`;
    return this.http.put(url, role).pipe(
      map((resp: any) => {
        console.log('data de role modificacda', resp);
        return {
          ok: true,
          role: resp.role
        };
      })
    );
  }

  deleteEliminarRegistro(_id: number) {
    const url = `${base_url}/roles/${_id}`;
    return this.http.delete(url).pipe(
      map((resp: any) => {
        console.log('data de role eliminado', resp);
        return {
          ok: true,
          role: resp.role
        };
      })
    );
  }
}
