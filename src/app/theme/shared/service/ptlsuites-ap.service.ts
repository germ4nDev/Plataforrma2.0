/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { PTLUsuarioModel } from '../_helpers/models/PTLUsuario.model';
import { PTLSuiteAPModel } from '../_helpers/models/PTLSuiteAP.model';
import { environment } from 'src/environments/environment';

const base_url = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class PtlSuitesAPService {
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

  geSuitesAP() {
    return this.http.get<PTLSuiteAPModel>(`${environment.apiUrl}/suites`).pipe(
      map((resp: any) => {
        console.log('respuesta servicio', resp);
        return {
          ok: true,
          suites: resp.suites
        };
      })
    );
  }

  getSuiteAPById(id: number) {
    const url = `${base_url}/suites/${id}`;
    return this.http.get(url).pipe(
      map((resp: any) => {
        console.log('data del suite', resp);
        return {
          ok: true,
          suite: resp.suite
        };
      })
    );
  }

  crearSuiteAP(suite: PTLSuiteAPModel) {
    console.log('nueva suite', suite);

    const url = `${base_url}/suites`;
    return this.http.post(url, suite);
  }

  actualizarSuiteAP(suite: PTLSuiteAPModel) {
    const url = `${base_url}/suites/${suite.suiteId}`;
    return this.http.put(url, suite).pipe(
      map((resp: any) => {
        console.log('data de SuiteAP modificacda', resp);
        return {
          ok: true,
          suite: resp.suite
        };
      })
    );
  }

  eliminarSuiteAP(_id: number) {
    const url = `${base_url}/suites/${_id}`;
    return this.http.delete(url).pipe(
      map((resp: any) => {
        console.log('data de SuiteAP eliminado', resp);
        return {
          ok: true,
          suite: resp.suite
        };
      })
    );
  }
}
