/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { PTLUsuarioModel } from '../_helpers/models/PTLUsuario.model';
import { PTLSlierInicioModel } from '../_helpers/models/PTLSliderInicio.model';
import { LocalStorageService } from './local-storage.service';

const base_url = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class PtlSlidersInicioService {
  user: PTLUsuarioModel = new PTLUsuarioModel();

  constructor(
    private http: HttpClient,
    private _localStorageService: LocalStorageService
) {}

  get token(): string {
    this.user = JSON.parse(this._localStorageService.getUsuarioLocalStorage() || '');
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
    };
  }

  getRegistros() {
    const url = `${base_url}/sliders`;
    return this.http.get(url)
    .pipe(
      map((resp: any) => {
        console.log('servicio de sliders', resp);
        return {
          ok: true,
          slidersInicio: resp.slidersInicio
        };
      })
    );
  }

  getRegistroById(id: number) {
     const url = `${base_url}/sliders/${id}`;
     return this.http.get(url).pipe(
       map((resp: any) => {
         console.log('data de colorNav', resp);
         return {
           ok: true,
           sliderInicio: resp.sliderInicio
         };
       })
     );
   }

   postCrearRegistro(slider: PTLSlierInicioModel) {
     const url = `${base_url}/sliders`;
     return this.http.post(url, slider);
   }

   putModificarRegistro(sliderInicio: PTLSlierInicioModel, sliderId:number) {
     const url = `${base_url}/sliders/${sliderId}`;
     return this.http.put(url, sliderInicio).pipe(
       map((resp: any) => {
         console.log('data de sliderInicio modificacda', resp);
         return {
           ok: true,
           sliderInicio: resp.sliderInicio
         };
       })
     );
   }

   deleteEliminarRegistro(_id: number) {
     const url = `${base_url}/sliders/${_id}`;
     return this.http.delete(url).pipe(
       map((resp: any) => {
         console.log('data de sliderInicio eliminado', resp);
         return {
           ok: true,
           sliderInicio: resp.sliderInicio
         };
       })
     );
   }
}
