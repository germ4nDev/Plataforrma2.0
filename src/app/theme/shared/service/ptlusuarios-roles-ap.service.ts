import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { PTLUsuarioModel } from '../_helpers/models/PTLUsuario.model';
import { PTLUsuarioRoleAP } from '../_helpers/models/PTLUsuarioRole.model';

const base_url = environment.apiUrl;
@Injectable({
  providedIn: 'root'
})
export class PtlusuariosRolesApService {
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
    const url = `${base_url}/usuarios-roles`;
    return this.http.get(url).pipe(
      map((resp: any) => {
        console.log('servicio de usuariosRoles', resp);
        return {
          ok: true,
          usuariosRoles: resp.usuariosRoles
        };
      })
    );
  }

  getRegistroById(id: number) {
    const url = `${base_url}/usuarios-roles/${id}`;
    return this.http.get(url).pipe(
      map((resp: any) => {
        console.log('data de usuarios-roles', resp);
        return {
          ok: true,
          usuarioRole: resp.usuarioRole
        };
      })
    );
  }

  postCrearRegistro(role: PTLUsuarioRoleAP) {
    const url = `${base_url}/usuarios-roles`;
    return this.http.post(url, role);
  }

  putModificarRegistro(role: PTLUsuarioRoleAP) {
    console.log('data usuRole', role);
    const url = `${base_url}/usuarios-roles/${role.usuarioRoleId}`;
    return this.http.put(url, role).pipe(
      map((resp: any) => {
        console.log('data de role modificacda', resp);
        return {
          ok: true,
          usuarioRole: resp.usuarioRole
        };
      })
    );
  }

  deleteEliminarRegistro(_id: number) {
    console.log('eliminar el registro id', _id);
    const url = `${base_url}/usuarios-roles/${_id}`;
    return this.http.delete(url).pipe(
      map((resp: any) => {
        console.log('data de role eliminado', resp);
        return {
          ok: true,
          usuarioRole: resp.usuarioRole
        };
      })
    );
  }

  deleteTodosRolesByAppIsSuiteId(usId:number, apId: number, suId: number) {
    const url = `${base_url}/usuarios-roles/clean/${usId}/${apId}/${suId}`;
    return this.http.delete(url).pipe(
      map((resp: any) => {
        console.log('data de role eliminado', resp);
        return {
          ok: resp.ok,
          usuarioRole: resp.usuarioRole
        };
      })
    );
  }
}
