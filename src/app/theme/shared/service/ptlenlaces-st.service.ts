import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { PTLUsuarioModel } from '../_helpers/models/PTLUsuario.model';
import { PTLEnlaceSTModel } from '../_helpers/models/PTLEnlaceST.model';

const base_url = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class PTLEnlacesSTService {
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

  getEnlaces() {
    return this.http.get<PTLEnlaceSTModel>(`${environment.apiUrl}/enlaces-st`).pipe(
      map((resp: any) => {
        console.log('respuesta servicio', resp);
        return {
          ok: true,
          enlace: resp.enlace
        };
      })
    );
  }

  getEnlaceById(id: number) {
    const url = `${base_url}/enlaces-st/${id}`;
    return this.http.get(url).pipe(
      map((resp: any) => {
        console.log('data de enlaces', resp);
        return {
          ok: true,
          enlace: resp.enlace
        };
      })
    );
  }

  insertarEnlace(enlace: PTLEnlaceSTModel) {
    const url = `${base_url}/enlaces-st`;
    return this.http.post(url, enlace);
  }

  modificarEnlaces(enlace: PTLEnlaceSTModel) {
      const url = `${base_url}/enlaces-st/${enlace.enlaceId}`;
      console.log('URL a enviar:', url);
    return this.http.put(url, enlace).pipe(
      map((resp: any) => {
        console.log('data del enlace modificada', resp);
        return {
          ok: true,
          enlace: resp.enlace
        };
      })
    );
  }

  eliminarEnlace(id: number) {
    const url = `${base_url}/enlaces-st/${id}`;
    return this.http.delete(url).pipe(
      map((resp: any) => {
        console.log('data del enlace modificada', resp);
        return {
          ok: true,
          enlace: resp.enlace
        };
      })
    );
  }
}
