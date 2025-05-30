/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { PTLUsuarioModel } from '../_helpers/models/PTLUsuario.model';
import { PTLRolesAP } from '../_helpers/models/PTLRolesAP.model';

const base_url = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class PTLRolesAPService {
  user: PTLUsuarioModel = new PTLUsuarioModel(0, 0, '', '', '', '', '', '', '', false);

  constructor(private http: HttpClient) {}

  get token(): string {
    this.user = JSON.parse(localStorage.getItem('currentUser') || '');
    if (this.user.serviceToken !== '') {
      return this.user.serviceToken;
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

  getRoles() {
    const url = `${base_url}/api/PTLRolesAP/GetListRoles`;
    return this.http.get<PTLRolesAP[]>(url, this.headers).pipe(
      map((resp: PTLRolesAP[]) => {
        console.log('respuesta servicio', resp);
        return {
          ok: true,
          resp
        };
      })
    );
  }

  getRolesById(id: number) {
    const url = `${base_url}/api/PTLRolesAP/GetRolesById/${id}`;
    return this.http.get(url, this.headers).pipe(
      map((resp: any) => {
        console.log('respuesta servicio Id', resp);
        return resp;
      })
    );
  }

  insertarRoles(roles: PTLRolesAP) {
    const url = `${base_url}/api/PTLRolesAP/PostInsertarRoles`;
    return this.http.post<{ ok: boolean; mensaje: string }>(url, roles, this.headers).pipe(
      map((resp) => {
        console.log('respuesta servicio insertar', resp);
        return {
          ok: true,
          resp
        };
      })
    );
  }

  modificarRoles(roles: PTLRolesAP) {
    const url = `${base_url}/api/PTLRolesAP/PutModificarRoles`;
    return this.http.put<{ ok: boolean; mensaje: string }>(url, roles, this.headers).pipe(
      map((resp) => {
        console.log('respuesta servicio modificar', resp);
        return {
          ok: true,
          resp
        };
      })
    );
  }

  eliminarRoles(id: number) {
    const url = `${base_url}/api/PTLRolesAP/DeleteRoles/${id}`;
    return this.http.delete<{ ok: boolean; mensaje: string }>(url, this.headers).pipe(
      map((resp) => {
        console.log('respuesta servicio eliminar', resp);
        return resp;
      })
    );
  }
}
