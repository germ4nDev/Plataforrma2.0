/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { PTLUsuarioModel } from '../_helpers/models/PTLUsuario.model';
import { PTLSitiosAPModel } from '../_helpers/models/PTLSitioAP.model';

const base_url = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class PTLSitiosAPService {
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

  getSitios() {
    return this.http.get<PTLSitiosAPModel>(`${environment.apiUrl}/sitios-ap`).pipe(
      map((resp: any) => {
        console.log('respuesta servicio', resp);
        return {
          ok: true,
          sitios: resp.sitios
        };
      })
    );
  }

  getSitioById(id: number) {
    const url = `${base_url}/sitios-ap/${id}`;
    return this.http.get(url).pipe(
      map((resp: any) => {
        console.log('data de sitios', resp);
        return {
          ok: true,
          sitio: resp.sitio
        };
      })
    );
  }

  insertarSitio(sitio: PTLSitiosAPModel) {
    const url = `${base_url}/sitios-ap`;
    return this.http.post(url, sitio);
  }

  modificarSitio(sitio: PTLSitiosAPModel) {
    const url = `${base_url}/sitios-ap/${sitio.sitioId}`;
    return this.http.put(url, sitio).pipe(
      map((resp: any) => {
        console.log('data de sitio modificada', resp);
        return {
          ok: true,
          sitio: resp.sitio
        };
      })
    );
  }

  eliminarSitio(_id: number) {
    const url = `${base_url}/sitios-ap/${_id}`;
    return this.http.delete(url).pipe(
      map((resp: any) => {
        console.log('data de sitio modificacda', resp);
        return {
          ok: true,
          sitio: resp.sitio
        };
      })
    );
  }
}
