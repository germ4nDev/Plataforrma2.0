/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { map, tap } from 'rxjs/operators';
import { PTLTiposGaleria } from '../_helpers/models/PTLTiposGaleria.model';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { SocketService } from './sockets.service';
import { LocalStorageService } from './local-storage.service';

const base_url = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class PtlTiposGaleriaService {
  private _tiposGaleria = new BehaviorSubject<PTLTiposGaleria[]>([]);
  private _tiposGaleriaChange = new Subject<any>();
  tiposGaleriaChange$ = this._tiposGaleriaChange.asObservable();

  constructor(
    private http: HttpClient,
    private socketService: SocketService,
    private _localstorageService: LocalStorageService
  ) {
    this.socketService.listen('tiposGaleria-actualizadas').subscribe({
      next: (payload) => {
        console.log('Evento de Socket.IO recibido:', payload.msg);
        this._tiposGaleriaChange.next(payload);
        this.cargarTiposGaleria().subscribe();
      },
      error: (err) => console.error('Error en la escucha de sockets:', err)
    });
  }

  get tiposGaleria$(): Observable<PTLTiposGaleria[]> {
    return this._tiposGaleria.asObservable();
  }

  getTiposGaleria() {
    console.log('Consultando tipos de galería');
    const url = `${base_url}/tiposGaleria`;
    return this.http.get(url).pipe(
      map((resp: any) => {
        return {
          ok: true,
          tiposGaleria: resp.tiposGaleria || resp.tipoGaleria || []
        };
      })
    );
  }

  cargarTiposGaleria() {
    console.log('Consultando y ordenando tipos de galería del servidor...');
    const url = `${base_url}/tiposGaleria`;
    return this.http.get(url).pipe(
      map((resp: any) => (resp.tiposGaleria || resp.tipoGaleria) as PTLTiposGaleria[]),
      map((tipos: PTLTiposGaleria[]) => {
        if (!tipos) return []; // Validación de seguridad por si el backend no trae datos
        return tipos.sort((a: any, b: any) => (a.nombreTipo || '').localeCompare(b.nombreTipo || ''));
      }),
      tap((tiposOrdenados) => {
        this._tiposGaleria.next(tiposOrdenados);
      })
    );
  }

  getTipoGaleriaById(id: number) {
    const url = `${base_url}/tiposGaleria/${id}`;
    return this.http.get(url).pipe(
      map((resp: any) => {
        console.log('data de tipo galería', resp);
        return {
          ok: true,
          tipoGaleria: resp.tipoGaleria
        };
      })
    );
  }

  getTipoGaleriaByCode(code: string) {
    const url = `${base_url}/tiposGaleria/code/${code}`;
    return this.http.get(url).pipe(
      map((resp: any) => {
        console.log('data del tipo galería', resp.tipoGaleria);
        return {
          ok: true,
          tipoGaleria: resp.tipoGaleria
        };
      })
    );
  }

  crearTipoGaleria(data: PTLTiposGaleria) {
    const url = `${base_url}/tiposGaleria`;
    return this.http.post(url, data).pipe(
      map((resp: any) => {
        return {
          ok: true,
          tipoGaleria: resp.tipoGaleria
        };
      })
    );
  }

  actualizarTipoGaleria(tipo: PTLTiposGaleria) {
    const url = `${base_url}/tiposGaleria/${tipo.codigoTipo}`;
    return this.http.put(url, tipo).pipe(
      map((resp: any) => {
        console.log('data de tipo galería modificado', resp);
        return {
          ok: true,
          tipoGaleria: resp.tipoGaleria
        };
      })
    );
  }

  eliminarTipoGaleria(id: string) {
    console.log('eliminar tipo galería', id);
    const url = `${base_url}/tiposGaleria/${id}`; // Corregido: antes era _id.id
    return this.http.delete(url).pipe(
      map((resp: any) => {
        console.log('data de tipo galería eliminada', resp);
        return {
          ok: true,
          tipoGaleria: resp.tipoGaleria
        };
      })
    );
  }
}
