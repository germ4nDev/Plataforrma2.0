/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PTLUsuarioModel } from '../_helpers/models/PTLUsuario.model';

const base_url = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class PtlvaloresUnitariosService {
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
    const url = `${base_url}/valores-unitarios`;
    return this.http.get(url)
    .pipe(
      map((resp: any) => {
        console.log('servicio de valoresUnitarios', resp);
        return {
          ok: true,
          valoresUnitarios: resp.valoresUnitarios
        };
      })
    );
  }

  getRegistroById(id: number) {
    const url = `${base_url}/valores-unitarios/${id}`;
    return this.http.get(url).pipe(
      map((resp: any) => {
        console.log('data de la valorUnitario', resp);
        return {
          ok: true,
          valorUnitario: resp.valorUnitario
        };
      })
    );
  }

  postCrearRegistro(valorUnitario: any) {
    const url = `${base_url}/valores-unitarios`;
    return this.http.post(url, valorUnitario);
  }

  putModificarRegistro(valorUnitario: any, valorUnitarioId: number) {
    const url = `${base_url}/valores-unitarios/${valorUnitarioId}`;
    return this.http.put(url, valorUnitario).pipe(
      map((resp: any) => {
        console.log('data de valorUnitario modificacda', resp);
        return {
          ok: true,
          valorUnitario: resp.valorUnitario
        };
      })
    );
  }

  deleteEliminarRegistro(_id: number) {
    const url = `${base_url}/valores-unitarios/${_id}`;
    return this.http.delete(url).pipe(
      map((resp: any) => {
        console.log('data de valorUnitario eliminado', resp);
        return {
          ok: true,
          valorUnitario: resp.valorUnitario
        };
      })
    );
  }

}
