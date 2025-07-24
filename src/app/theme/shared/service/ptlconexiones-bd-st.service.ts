import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PTLConexionBDModel } from '../_helpers/models/PTLConexionBD.model';
import { PTLUsuarioModel } from '../_helpers/models/PTLUsuario.model';

const base_url = environment.apiUrl;
@Injectable({
  providedIn: 'root'
})
export class PTLConexionesBDSTService {

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
    const url = `${base_url}/conexiones-bd`;
    return this.http.get(url)
    .pipe(
      map((resp: any) => {
        console.log('servicio de conexion', resp);
        return {
          ok: true,
          conexiones: resp.conexiones
        };
      })
    );
  }

  getRegistroById(id: number) {
    const url = `${base_url}/conexiones-bd/${id}`;
    return this.http.get(url).pipe(
      map((resp: any) => {
        console.log('data de conexion', resp);
        return {
          ok: true,
          conexion: resp.conexion
        };
      })
    );
  }

  postCrearRegistro(conexion: PTLConexionBDModel) {
    const url = `${base_url}/conexiones-bd`;
    return this.http.post(url, conexion);
  }

  putModificarRegistro(conexion: PTLConexionBDModel) {
    const url = `${base_url}/conexiones-bd/${conexion.conexionId}`;
    return this.http.put(url, conexion).pipe(
      map((resp: any) => {
        console.log('data de conexion modificacda', resp);
        return {
          ok: true,
          conexion: resp.conexion
        };
      })
    );
  }

  deleteEliminarRegistro(_id: number) {
    const url = `${base_url}/conexiones-bd/${_id}`;
    return this.http.delete(url).pipe(
      map((resp: any) => {
        console.log('data de conexion eliminado', resp);
        return {
          ok: true,
          conexion: resp.conexion
        };
      })
    );
  }
}

