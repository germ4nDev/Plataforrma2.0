import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { PTLUsuarioAP } from '../_helpers/models/PTLUsuarioAP.model';
import { PTLContenidosEL } from '../_helpers/models/PTLContenidosEL.model';

const base_url = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class PTLContenidosELService {
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

    getContenido() {
        const url = `${ base_url }/api/PTLContenidosEL/ListaContenidos`;
        return this.http.get<PTLContenidosEL[]>( url, this.headers )
        .pipe(
            map((resp: PTLContenidosEL[]) => {
                console.log('respuesta servicio', resp);
                return {
                    ok: true,
                    resp
                };
            })
        );
    }

    getContenidoById(id: number) {
        const url = `${base_url}/api/PTLContenidosEL/GetContenidoById/${id}`;
        return this.http.get(url, this.headers)
        .pipe(
            map((resp: any) => {
                console.log('respuesta servicio Id', resp);
                return resp;
            })
        );
        }


    insertarContenido(contenido: PTLContenidosEL) {
        const url = `${base_url}/api/PTLContenidosEL/PostInsertarContenido`;
        return this.http.post<{ ok: boolean, mensaje: string }>(url, contenido, this.headers)
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

    modificarContenido(contenido: PTLContenidosEL) {
        const url = `${base_url}/api/PTLContenidosEL/PutModificarContenido`;
        return this.http.put<{ ok: boolean, mensaje: string }>(url, contenido, this.headers)
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

    eliminarContenido(id: number) {
        const url = `${base_url}/api/PTLContenidosEL/DeleteContenido/${id}`;
        return this.http.delete<{ ok: boolean, mensaje: string }>(url, this.headers)
          .pipe(
            map(resp => {
              console.log('respuesta servicio eliminar', resp);
              return resp;
            })
          );
      }


}
