/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, Subject, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PTLModuloAP } from '../_helpers/models/PTLModuloAP.model';
import { PTLUsuarioModel } from '../_helpers/models/PTLUsuario.model';
import { LocalStorageService } from './local-storage.service';
import { SocketService } from './sockets.service';

const base_url = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class PtlmodulosApService {
  user: PTLUsuarioModel = new PTLUsuarioModel();
  private _modulos = new BehaviorSubject<PTLModuloAP[]>([]);
  private _modulosChange = new Subject<any>();
  modulosChange$ = this._modulosChange.asObservable();

  constructor(
    private http: HttpClient,
    private socketService: SocketService,
    private _localstorageService: LocalStorageService
  ) {
    this.socketService.listen('aplicaciones-actualizadas').subscribe({
      next: (payload) => {
        console.log('Evento de Socket.IO recibido:', payload.msg);
        this._modulosChange.next(payload);
        this.cargarRegistros().subscribe();
      },
      error: (err) => console.error('Error en la escucha de sockets:', err)
    });
  }

  get modulos$(): Observable<PTLModuloAP[]> {
    return this._modulos.asObservable();
  }

  getRegistros() {
    // console.log('4');
    const url = `${base_url}/modulos`;
    return this.http.get(url).pipe(
      map((resp: any) => {
        // console.log('5');
        // console.log('servicio de modulos', resp);
        return {
          ok: true,
          modulos: resp.modulos
        };
      })
    );
  }

  cargarRegistros() {
    console.log('Consultando y ordenando modulos del servidor...');
    const url = `${base_url}/modulos`;
    return this.http.get(url).pipe(
      map((resp: any) => resp.modulos as PTLModuloAP[]),
      map((modulos: PTLModuloAP[]) => {
        return modulos.sort((a: any, b: any) => a.nombreModulo.localeCompare(b.nombreModulo));
      }),
      tap((modulosOrdenadas) => {
        console.log('modulos servicio', modulosOrdenadas);
        this._modulos.next(modulosOrdenadas);
      })
    );
  }

  getRegistroById(id: number) {
    const url = `${base_url}/modulos/${id}`;
    return this.http.get(url).pipe(
      map((resp: any) => {
        // // console.log('data de modulo', resp);
        return {
          ok: true,
          modulo: resp.modulo
        };
      })
    );
  }

  postCrearRegistro(data: PTLModuloAP) {
    const url = `${base_url}/modulos`;
    console.log('data del modulo', data);
    // return this.http.post(url, modulo);
    return this.http.post(url, data).pipe(
      map((resp: any) => {
        return {
          ok: true,
          modulo: resp.modulo
        };
      })
    );
  }

  putModificarRegistro(modulo: PTLModuloAP, moduloId: number) {
    const url = `${base_url}/modulos/${moduloId}`;
    return this.http.put(url, modulo).pipe(
      map((resp: any) => {
        // // console.log('data de modulo modificacda', resp);
        return {
          ok: true,
          modulo: resp.modulo
        };
      })
    );
  }

  deleteEliminarRegistro(_id: number) {
    const url = `${base_url}/modulos/${_id}`;
    return this.http.delete(url).pipe(
      map((resp: any) => {
        // // console.log('data de modulo eliminado', resp);
        return {
          ok: true,
          modulo: resp.modulo
        };
      })
    );
  }
}
