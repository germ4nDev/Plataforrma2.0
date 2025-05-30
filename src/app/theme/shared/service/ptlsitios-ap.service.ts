/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'src/environments/environment';
import { PTLSitiosAP } from '../_helpers/models/PTLSitioAP.model';
import { map } from 'rxjs/operators';
import { PTLUsuarioAP } from '../_helpers/models/PTLUsuarioAP.model';

const base_url = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class PTLSitiosAPService {
    user : PTLUsuarioAP = new PTLUsuarioAP(0, 0, '', '', '', false, '');

    constructor(private http: HttpClient) { }

    get token(): string {
        this.user = JSON.parse(localStorage.getItem('currentUser') || '');
        if (this.user.serviceToken !== '') {
            return this.user.serviceToken;
        }
        return '';
    }

    get headers() {
        return {
            headers: {
                'x-token': this.token
            }
        }
    }

    getSitios() {
        const url = `${ base_url }/api/PTLSitiosAP/ListaSitios`;
        return this.http.get<PTLSitiosAP[]>( url, this.headers )
        .pipe(
            map((resp: PTLSitiosAP[]) => {
                console.log('respuesta servicio', resp);
                return {
                    ok: true,
                    resp
                };
            })
        );
    }

    getSitioById(id: number) {
        const url = `${base_url}/api/PTLSitiosAP/GetSitioById/${id}`;
        return this.http.get(url, this.headers)
        .pipe(
            map((resp: any) => {
                console.log('respuesta servicio Id', resp);
                return resp;
            })
        );
        }


    insertarSitio(sitio: PTLSitiosAP) {
        const url = `${base_url}/api/PTLSitiosAP/PostInsertarSitios`;
        return this.http.post<{ ok: boolean, mensaje: string }>(url, sitio, this.headers)
            .pipe(
                map(resp => {
                    console.log('respuesta servicio insertar', resp);
                    return {
                        ok: true,
                        resp
                    };
                })
            );
        }

    modificarSitio(sitio: PTLSitiosAP) {
        const url = `${base_url}/api/PTLSitiosAP/PutModificarSitio`;
        return this.http.put<{ ok: boolean, mensaje: string }>(url, sitio, this.headers)
        .pipe(
            map(resp => {
            console.log('respuesta servicio modificar', resp);
            return {
                ok: true,
                resp
            };
            })
        );
    }

    eliminarSitio(id: number) {
        const url = `${base_url}/api/PTLSitiosAP/DeleteSitio/${id}`;
        return this.http.delete<{ ok: boolean, mensaje: string }>(url, this.headers)
          .pipe(
            map(resp => {
              console.log('respuesta servicio eliminar', resp);
              return resp;
            })
          );
      }
}
