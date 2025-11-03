/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { map } from 'rxjs/operators';
import { PTLUsuarioModel } from '../_helpers/models/PTLUsuario.model';
import { PTLAplicacionModel } from '../_helpers/models/PTLAplicacion.model';
import { environment } from 'src/environments/environment';

const base_url = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class PtlAplicacionesService {
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
        //   'x-token': this.token,
        'Content-Type': 'application/json'
      }
    };
  }

  getAplicaciones() {
    console.log('aca');
    const url = `${base_url}/aplicaciones`;
    return this.http.get(url).pipe(
      map((resp: any) => {
        return {
          ok: true,
          aplicaciones: resp.aplicaciones
        };
      })
    );
  }

  getAplicacionById(id: number) {
    const url = `${base_url}/aplicaciones/${id}`;
    return this.http.get(url).pipe(
      map((resp: any) => {
        console.log('data de aplicaciones', resp);
        return {
          ok: true,
          aplicacion: resp.aplicacion
        };
      })
    );
  }

  getAplicacionByCode(code: string) {
    const url = `${base_url}/aplicaciones/code/${code}`;
    return this.http.get(url).pipe(
      map((resp: any) => {
        console.log('data de las aplicaciones', resp.aplicaciones);
        return {
          ok: true,
          aplicacion: resp.aplicacion
        };
      })
    );
  }

  crearAplicacion(data: PTLAplicacionModel) {
    const url = `${base_url}/aplicaciones`;
    return this.http.post(url, data).pipe(
      map((resp: any) => {
        return {
          ok: true,
          aplicacion: resp.aplicacion
        };
      })
    );
  }

  actualizarAplicacion(aplicacion: PTLAplicacionModel) {
    const url = `${base_url}/aplicaciones/${aplicacion.codigoAplicacion}`;
    return this.http.put(url, aplicacion).pipe(
      map((resp: any) => {
        console.log('data de aplicacion modificacda', resp);
        return {
          ok: true,
          aplicacion: resp.aplicacion
        };
      })
    );
  }

  eliminarAplicacion(_id: any) {
    console.log('eliminar aplicacion', _id);
    const url = `${base_url}/aplicaciones/${_id.id}`;
    return this.http.delete(url).pipe(
      map((resp: any) => {
        console.log('data de aplicacion eliminada', resp);
        return {
          ok: true,
          aplicacion: resp.aplicacion
        };
      })
    );
  }
}
