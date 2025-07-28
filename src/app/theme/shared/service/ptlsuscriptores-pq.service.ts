import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PTLUsuarioModel } from '../_helpers/models/PTLUsuario.model';
import { PTLSuscriptoresPQModelo } from '../_helpers/models/PTLSuscriptorPQ.model';

const base_url = environment.apiUrl;
@Injectable({
  providedIn: 'root'
})
export class PTLSuscriptoresPQService {

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
    const url = `${base_url}/suscriptores-pq`;
    return this.http.get(url)
    .pipe(
      map((resp: any) => {
        console.log('servicio del suscriptorPQ', resp);
        return {
          ok: true,
          suscriptoresPQ: resp.suscriptoresPQ
        };
      })
    );
  }

  getRegistroById(id: number) {
    const url = `${base_url}/suscriptores-pq/${id}`;
    return this.http.get(url).pipe(
      map((resp: any) => {
        console.log('data de suscriptorPQ', resp);
        return {
          ok: true,
          suscriptorPQ: resp.suscriptorPQ
        };
      })
    );
  }

  postCrearRegistro(suscriptorPQ: PTLSuscriptoresPQModelo) {
    const url = `${base_url}/suscriptores-pq`;
    return this.http.post(url, suscriptorPQ);
  }

  putModificarRegistro(suscriptorPQ: PTLSuscriptoresPQModelo) {
    const url = `${base_url}/suscriptores-pq/${suscriptorPQ.suscriptoPaqueteId}`;
    return this.http.put(url, suscriptorPQ).pipe(
      map((resp: any) => {
        console.log('data de suscriptorPQ modificacda', resp);
        return {
          ok: true,
          suscriptorPQ: resp.suscriptorPQ
        };
      })
    );
  }

  deleteEliminarRegistro(_id: number) {
    const url = `${base_url}/suscriptores-pq/${_id}`;
    return this.http.delete(url).pipe(
      map((resp: any) => {
        console.log('data de suscriptorPQ eliminado', resp);
        return {
          ok: true,
          suscriptorPQ: resp.suscriptorPQ
        };
      })
    );
  }
}
