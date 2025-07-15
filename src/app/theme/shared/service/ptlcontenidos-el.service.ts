import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { PTLUsuarioModel } from '../_helpers/models/PTLUsuario.model';
import { PTLContenidoELModel } from '../_helpers/models/PTLContenidoEL.model';

const base_url = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class PTLContenidosELService {
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

  getContenido() {
    return this.http.get<PTLContenidoELModel>(`${environment.apiUrl}/contenidos-el`).pipe(
      map((resp: any) => {
        console.log('respuesta servicio', resp);
        return {
          ok: true,
          contenido: resp.contenido
        };
      })
    );
  }

  getContenidoById(id: number) {
    const url = `${base_url}/contenidos-el/${id}`;
    return this.http.get(url).pipe(
      map((resp: any) => {
        console.log('data de contenidos', resp);
        return {
          ok: true,
          contenido: resp.contenido
        };
      })
    );
  }

  insertarContenido(contenido: PTLContenidoELModel) {
    const url = `${base_url}/contenidos-el`;
    return this.http.post(url, contenido);
  }

  modificarContenido(contenido: PTLContenidoELModel) {
    const url = `${base_url}/contenidos-el/${contenido.contenidoId}`;
    console.log('URL a enviar:', url);
    return this.http.put(url, contenido).pipe(
      map((resp: any) => {
        console.log('data del contenido modificada', resp);
        return {
          ok: true,
          contenido: resp.contenido
        };
      })
    );
  }

  eliminarContenido(id: number) {
    const url = `${base_url}/contenidos-el/${id}`;
    return this.http.delete(url).pipe(
      map((resp: any) => {
        console.log('data del contenido modificada', resp);
        return {
          ok: true,
          contenido: resp.contenido
        };
      })
    );
  }
}
