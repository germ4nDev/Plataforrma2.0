/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PTLSuscriptorModel } from '../_helpers/models/PTLSuscriptor.model';
import { PTLUsuarioModel } from '../_helpers/models/PTLUsuario.model';

const base_url = environment.apiUrl;
@Injectable({
  providedIn: 'root'
})
export class PTLSuscriptoresService {
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

  getSuscriptores() {
    const url = `${base_url}/suscriptores`;
    return this.http.get(url)
    .pipe(
      map((resp: any) => {
        console.log('respuesta servicio suscriptores', resp);
        return {
          ok: true,
          suscriptores: resp.suscriptores
        };
      })
    );
  }

  getSuscriptorById(id: PTLSuscriptorModel) {
    const url = `${base_url}/suscriptores/${id}`;
    return this.http.get(url)
    .pipe(
      map((resp: any) => {
        console.log('data de suscriptores', resp);
        return {
          ok: true,
          suscriptor: resp.suscriptor
        };
      })
    );
  }

  crearSuscriptor(data: PTLSuscriptorModel) {
    console.log('data servicio', data);
    const url = `${base_url}/suscriptores`;
    return this.http.post(url, data).pipe(
      map((resp: any) => {
        return {
          ok: true,
          suscriptor: resp.suscriptor
        };
      })
    );
  }

  actualizarSuscriptor(suscriptor: PTLSuscriptorModel) {
    const url = `${base_url}/suscriptores/${suscriptor.suscriptorId}`;
    return this.http.put(url, suscriptor)
    .pipe(
      map((resp: any) => {
        console.log('data de suscriptor modificada', resp);
        return {
          ok: true,
          suscriptor: resp.suscriptor
        };
      })
    );
  }

  eliminarSuscripctor(_id: number) {
    const url = `${base_url}/suscriptores/${_id}`;
    return this.http.delete(url)
    .pipe(
      map((resp: any) => {
        console.log('data de suscriptor modificacda', resp);
        //TODO al eliminar el suscriptor se debe eliminar toda su descendencia, usuariosSC, empresas, paquetes...
        return {
          ok: true,
          suscriptor: resp.suscriptor
        };
      })
    );
  }
}
