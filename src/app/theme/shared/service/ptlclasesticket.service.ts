/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { PTLUsuarioModel } from '../_helpers/models/PTLUsuario.model';
import { PTLClaseTicketModel } from '../_helpers/models/PTLClaseTicket.model';
import { LocalStorageService } from './local-storage.service';

const base_url = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class PtlclasesticketService {
  user: PTLUsuarioModel = new PTLUsuarioModel();

  constructor(
    private http: HttpClient,
    private _localStorageService: LocalStorageService
) {}

  getRegistros() {
    const url = `${base_url}/clases-ticket`;
    return this.http.get(url)
    .pipe(
      map((resp: any) => {
        console.log('servicio de clases-ticket', resp);
        return {
          ok: true,
          clasesTicket: resp.clasesTicket
        };
      })
    );
  }

  getRegistroById(id: number) {
     const url = `${base_url}/clases-ticket/${id}`;
     return this.http.get(url).pipe(
       map((resp: any) => {
         console.log('data de claseTicket', resp);
         return {
           ok: true,
           claseTicket: resp.claseTicket
         };
       })
     );
   }

   postCrearRegistro(claseTicket: PTLClaseTicketModel) {
     const url = `${base_url}/clases-ticket`;
     return this.http.post(url, claseTicket);
   }

   putModificarRegistro(claseTicket: PTLClaseTicketModel, codigoClase: string) {
     const url = `${base_url}/clases-ticket/${codigoClase}`;
     return this.http.put(url, claseTicket).pipe(
       map((resp: any) => {
         console.log('data de claseTicket modificacda', resp);
         return {
           ok: true,
           claseTicket: resp.claseTicket
         };
       })
     );
   }

   deleteEliminarRegistro(codigoClase: string) {
     const url = `${base_url}/clases-ticket/${codigoClase}`;
     return this.http.delete(url).pipe(
       map((resp: any) => {
         console.log('data de claseTicket eliminado', resp);
         return {
           ok: true,
           claseTicket: resp.claseTicket
         };
       })
     );
   }
}
