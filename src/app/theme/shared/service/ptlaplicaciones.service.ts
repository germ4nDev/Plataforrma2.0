/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { map, tap } from 'rxjs/operators';
import { PTLUsuarioModel } from '../_helpers/models/PTLUsuario.model';
import { PTLAplicacionModel } from '../_helpers/models/PTLAplicacion.model';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { SocketService } from './sockets.service';
const base_url = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class PtlAplicacionesService {
  private socket: any;
  user: PTLUsuarioModel = new PTLUsuarioModel();
  private _aplicaciones = new BehaviorSubject<PTLAplicacionModel[]>([]);
  private _aplicacionesChange = new Subject<any>();
  aplicacionesChange$ = this._aplicacionesChange.asObservable();

  constructor(
    private http: HttpClient,
    private socketService: SocketService
  ) {
    this.socketService.listen('aplicaciones-actualizadas').subscribe({
      next: (payload) => {
        console.log('Evento de Socket.IO recibido:', payload.msg);
        this._aplicacionesChange.next(payload);
        this.cargarAplicaciones().subscribe();
      },
      error: (err) => console.error('Error en la escucha de sockets:', err)
    });
  }

  get aplicaciones$(): Observable<PTLAplicacionModel[]> {
    return this._aplicaciones.asObservable();
  }

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
        //   'x-token': this.token,
        'Content-Type': 'application/json'
      }
    };
  }

  getAplicaciones() {
    console.log('aca');
    const url = `${base_url}/aplicaciones`;
    return this.http.get(url).pipe(
      map((resp: any) => {
        return {
          ok: true,
          aplicaciones: resp.aplicaciones
        };
      })
    );
  }

  cargarAplicaciones() {
    console.log('Consultando y ordenando aplicaciones del servidor...');
    const url = `${base_url}/aplicaciones`;
    return this.http.get(url, this.headers).pipe(
      map((resp: any) => resp.aplicaciones as PTLAplicacionModel[]),
      map((aplicaciones: PTLAplicacionModel[]) => {
        return aplicaciones.sort((a: any, b: any) => a.nombreAplicacion.localeCompare(b.nombreAplicacion));
      }),
      tap((aplicacionesOrdenadas) => {
        this._aplicaciones.next(aplicacionesOrdenadas);
      })
    );
  }

  getAplicacionById(id: number) {
    const url = `${base_url}/aplicaciones/${id}`;
    return this.http.get(url).pipe(
      map((resp: any) => {
        console.log('data de aplicaciones', resp);
        return {
          ok: true,
          aplicacion: resp.aplicacion
        };
      })
    );
  }

  getAplicacionByCode(code: string) {
    const url = `${base_url}/aplicaciones/code/${code}`;
    return this.http.get(url).pipe(
      map((resp: any) => {
        console.log('data de las aplicaciones', resp.aplicaciones);
        return {
          ok: true,
          aplicacion: resp.aplicacion
        };
      })
    );
  }

  crearAplicacion(data: PTLAplicacionModel) {
    const url = `${base_url}/aplicaciones`;
    return this.http.post(url, data).pipe(
      map((resp: any) => {
        return {
          ok: true,
          aplicacion: resp.aplicacion
        };
      })
    );
  }

  actualizarAplicacion(aplicacion: PTLAplicacionModel) {
    const url = `${base_url}/aplicaciones/${aplicacion.codigoAplicacion}`;
    return this.http.put(url, aplicacion).pipe(
      map((resp: any) => {
        console.log('data de aplicacion modificacda', resp);
        return {
          ok: true,
          aplicacion: resp.aplicacion
        };
      })
    );
  }

  eliminarAplicacion(_id: any) {
    console.log('eliminar aplicacion', _id);
    const url = `${base_url}/aplicaciones/${_id.id}`;
    return this.http.delete(url).pipe(
      map((resp: any) => {
        console.log('data de aplicacion eliminada', resp);
        return {
          ok: true,
          aplicacion: resp.aplicacion
        };
      })
    );
  }
}
