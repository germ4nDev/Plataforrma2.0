import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PTLSeguimientoRQModel } from '../_helpers/models/PTLSeguimientoTK.model';
import { PTLUsuarioModel } from '../_helpers/models/PTLUsuario.model';

const base_url = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class PTLSeguimientosRqService {
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
    const url = `${base_url}/seguimientos-tk`;
    return this.http.get(url)
    .pipe(
      map((resp: any) => {
        console.log('servicio de seguimiento', resp);
        return {
          ok: true,
          seguimientos: resp.seguimientos
        };
      })
    );
  }

  getRegistroById(id: number) {
    const url = `${base_url}/seguimientos-tk/${id}`;
    return this.http.get(url)
    .pipe(
      map((resp: any) => {
        console.log('data de seguimiento', resp);
        return {
          ok: true,
          seguimiento: resp.seguimiento
        };
      })
    );
  }

  postCrearRegistro(seguimiento: PTLSeguimientoRQModel) {
    const url = `${base_url}/seguimientos-tk`;
    return this.http.post(url, seguimiento);
  }

  putModificarRegistro(seguimiento: PTLSeguimientoRQModel) {
    const url = `${base_url}/seguimientos-tk/${seguimiento.seguimientoId}`;
    return this.http.put(url, seguimiento)
    .pipe(
      map((resp: any) => {
        console.log('data de seguimiento modificacda', resp);
        return {
          ok: true,
          seguimiento: resp.seguimiento
        };
      })
    );
  }

  deleteEliminarRegistro(_id: number) {
    const url = `${base_url}/seguimientos-tk/${_id}`;
    return this.http.delete(url)
    .pipe(
      map((resp: any) => {
        console.log('data de seguimiento eliminado', resp);
        return {
          ok: true,
          seguimiento: resp.seguimiento
        };
      })
    );
  }
}
