import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { PTLUsuarioAP } from '../_helpers/models/PTLUsuarioAP.model';
import { PTLEnlaceST } from '../_helpers/models/PTLEnlacesST.model';

const base_url = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class PTLEnlacesSTService {
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

    getEnlaces() {
        const url = `${ base_url }/api/PTLEnlacesST/ListaEnlaces`;
        return this.http.get<PTLEnlaceST[]>( url, this.headers )
        .pipe(
            map((resp: PTLEnlaceST[]) => {
                console.log('respuesta servicio', resp);
                return {
                    ok: true,
                    resp
                };
            })
        );
    }

    getEnlaceById(id: number) {
        const url = `${base_url}/api/PTLEnlacesST/GetEnlaceById/${id}`;
        return this.http.get(url, this.headers)
        .pipe(
            map((resp: any) => {
                console.log('respuesta servicio Id', resp);
                return resp;
            })
        );
        }


    insertarEnlace(enlace: PTLEnlaceST) {
        const url = `${base_url}/api/PTLEnlacesST/PostInsertarEnlace`;
        return this.http.post<{ ok: boolean, mensaje: string }>(url, enlace, this.headers)
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

    modificarEnlaces(enlace: PTLEnlaceST) {
        const url = `${base_url}/api/PTLEnlacesST/PutModificarEnlace`;
        return this.http.put<{ ok: boolean, mensaje: string }>(url, enlace, this.headers)
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

    eliminarEnlace(id: number) {
        const url = `${base_url}/api/PTLEnlacesST/DeleteEnlace/${id}`;
        return this.http.delete<{ ok: boolean, mensaje: string }>(url, this.headers)
          .pipe(
            map(resp => {
              console.log('respuesta servicio eliminar', resp);
              return resp;
            })
          );
      }


}
