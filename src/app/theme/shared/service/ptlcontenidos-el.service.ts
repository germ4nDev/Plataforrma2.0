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
    user : PTLUsuarioModel = new PTLUsuarioModel();

    constructor(private http: HttpClient) { }

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
        }
    }

    getContenido() {
        const url = `${ base_url }/api/PTLContenidosEL/ListaContenidos`;
        return this.http.get<PTLContenidoELModel[]>( url, this.headers )
        .pipe(
            map((resp: PTLContenidoELModel[]) => {
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


    insertarContenido(contenido: PTLContenidoELModel) {
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

    modificarContenido(contenido: PTLContenidoELModel) {
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
