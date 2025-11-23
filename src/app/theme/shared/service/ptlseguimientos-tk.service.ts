/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PTLSeguimientoTKModel } from '../_helpers/models/PTLSeguimientoTK.model';
import { PTLUsuarioModel } from '../_helpers/models/PTLUsuario.model';
import { LocalStorageService } from './local-storage.service';

const base_url = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class PTLSeguimientosTKService {
  user: PTLUsuarioModel = new PTLUsuarioModel();

  constructor(
    private http: HttpClient,
    private _localStorageService: LocalStorageService
  ) {}

  getRegistros() {
    const url = `${base_url}/seguimientos-tk`;
    return this.http.get(url).pipe(
      map((resp: any) => {
        console.log('servicio de seguimiento', resp);
        return {
          ok: true,
          seguimientos: resp.seguimientos
        };
      })
    );
  }

  getRegistrosByTicket(id: string) {
    const url = `${base_url}/seguimientos-tk/ticket/${id}`;
    return this.http.get(url).pipe(
      map((resp: any) => {
        console.log('servicio de seguimiento by ticket', resp);
        return {
          ok: true,
          seguimientos: resp.seguimientos
        };
      })
    );
  }

  getRegistroById(id: string) {
    const url = `${base_url}/seguimientos-tk/${id}`;
    return this.http.get(url).pipe(
      map((resp: any) => {
        console.log('data de seguimiento', resp);
        return {
          ok: true,
          seguimiento: resp.seguimiento
        };
      })
    );
  }

  postCrearRegistro(data: PTLSeguimientoTKModel) {
    const url = `${base_url}/seguimientos-tk`;
    return this.http.post(url, data).pipe(
      map((resp: any) => {
        return {
          ok: true,
          seguimiento: resp.seguimiento
        };
      })
    );
  }

  putModificarRegistro(seguimiento: PTLSeguimientoTKModel) {
    const url = `${base_url}/seguimientos-tk/${seguimiento.codigoSeguimiento}`;
    return this.http.put(url, seguimiento).pipe(
      map((resp: any) => {
        console.log('data de seguimiento modificacda', resp);
        return {
          ok: true,
          seguimiento: resp.seguimiento
        };
      })
    );
  }

  deleteEliminarRegistro(_id: string) {
    const url = `${base_url}/seguimientos-tk/${_id}`;
    return this.http.delete(url).pipe(
      map((resp: any) => {
        console.log('data de seguimiento eliminado', resp);
        return {
          ok: true,
          seguimiento: resp.seguimiento
        };
      })
    );
  }
}
