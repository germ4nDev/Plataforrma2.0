/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PTLUsuarioModel } from '../_helpers/models/PTLUsuario.model';
import { PTLLogActividadAPModel } from './../_helpers/models/PTLlogActividadAP.model';

const base_url = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class PtllogActividadesService {
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
    const url = `${base_url}/logs-actividades`;
    return this.http.get(url)
    .pipe(
      map((resp: any) => {
        console.log('servicio de log_actividads', resp);
        return {
          ok: true,
          log_actividades: resp.log_actividades
        };
      })
    );
  }

  getRegistroById(id: number) {
    const url = `${base_url}/logs-actividades/${id}`;
    return this.http.get(url).pipe(
      map((resp: any) => {
        console.log('data de log_actividad', resp);
        return {
          ok: true,
          log_actividad: resp.log_actividad
        };
      })
    );
  }

  postCrearRegistro(log_actividad: PTLLogActividadAPModel) {
    const url = `${base_url}/logs-actividades`;
    return this.http.post(url, log_actividad);
  }

  putModificarRegistro(log_actividad: PTLLogActividadAPModel) {
    const url = `${base_url}/logs-actividades/${log_actividad.logId}`;
    return this.http.put(url, log_actividad).pipe(
      map((resp: any) => {
        console.log('data de log_actividad modificacda', resp);
        return {
          ok: true,
          log_actividad: resp.log_actividad
        };
      })
    );
  }

  deleteEliminarRegistro(_id: number) {
    const url = `${base_url}/logs-actividades/${_id}`;
    return this.http.delete(url).pipe(
      map((resp: any) => {
        console.log('data de log_actividad eliminado', resp);
        return {
          ok: true,
          log_actividad: resp.log_actividad
        };
      })
    );
  }
}
