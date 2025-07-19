import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PTLUsuarioModel } from '../_helpers/models/PTLUsuario.model';
import { PTLRequerimientoTKModel } from '../_helpers/models/PTLRequerimientoTK.model';

const base_url = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class PTLRequerimientosTkService {
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
    const url = `${base_url}/requerimientos-tk`;
    return this.http.get(url)
    .pipe(
      map((resp: any) => {
        console.log('servicio de requerimiento', resp);
        return {
          ok: true,
          requerimientos: resp.requerimientos
        };
      })
    );
  }

  getRegistroById(id: number) {
    const url = `${base_url}/requerimientos-tk/${id}`;
    return this.http.get(url).pipe(
      map((resp: any) => {
        console.log('data de requerimientos', resp);
        return {
          ok: true,
          requerimiento: resp.requerimiento
        };
      })
    );
  }

  postCrearRegistro(requerimiento: PTLRequerimientoTKModel) {
    const url = `${base_url}/requerimientos-tk`;
    return this.http.post(url, requerimiento);
  }

  putModificarRegistro(requerimiento: PTLRequerimientoTKModel) {
    const url = `${base_url}/requerimientos-tk/${requerimiento.requerimientoId}`;
    return this.http.put(url, requerimiento).pipe(
      map((resp: any) => {
        console.log('data de requerimiento modificacda', resp);
        return {
          ok: true,
          requerimiento: resp.requerimiento
        };
      })
    );
  }

  deleteEliminarRegistro(_id: number) {
    const url = `${base_url}/requerimientos-tk/${_id}`;
    return this.http.delete(url).pipe(
      map((resp: any) => {
        console.log('data de requerimiento eliminado', resp);
        return {
          ok: true,
          requerimiento: resp.requerimiento
        };
      })
    );
  }
}
