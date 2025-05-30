/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { PTLUsuarioModel } from '../_helpers/models/PTLUsuario.model';

const base_url = environment.apiUrl;

@Injectable({
    providedIn: 'root'
})
export class PTLUsuarioModelService {
    user: PTLUsuarioModel = new PTLUsuarioModel(0, 0, '', '', '', '', '', '', '', false);

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

    getUsuarios() {
        return this.http.get<PTLUsuarioModel>(`${environment.apiUrl}/usuarios`).pipe(
            map((resp: any) => {
                console.log('respuesta servicio', resp);
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                return {
                    ok: true,
                    usuarios: resp.usuarios
                };
            })
        );
    }

    getUsuarioById(id: number) {
        return this.http.get<PTLUsuarioModel>(`${environment.apiUrl}/usuarios/${id}`).pipe(
            map((resp: any) => {
                console.log('respuesta servicio', resp);
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                return {
                    ok: true,
                    usuario: resp.usuario
                };
            })
        );
    }

    insertarUsuarios(usuario: PTLUsuarioModel) {
        return this.http.post<PTLUsuarioModel>(`${environment.apiUrl}/usuarios`, usuario, this.headers).pipe(
            map((resp: any) => {
                console.log('respuesta servicio', resp);
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                return {
                    ok: true,
                    usuario: resp.usuario
                };
            })
        );
    }

    modificarUsuarios(usuario: PTLUsuarioModel) {
        return this.http.put<PTLUsuarioModel>(`${environment.apiUrl}/usuarios`, usuario, this.headers).pipe(
            map((resp: any) => {
                console.log('respuesta servicio', resp);
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                return {
                    ok: true,
                    usuario: resp.usuario
                };
            })
        );
    }

    eliminarUsuarios(id: number) {
        return this.http.delete<PTLUsuarioModel>(`${environment.apiUrl}/usuarios/${id}`, this.headers).pipe(
            map((resp: any) => {
                console.log('respuesta servicio', resp);
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                return {
                    ok: true,
                    usuario: resp.usuario
                };
            })
        );
    }
}
