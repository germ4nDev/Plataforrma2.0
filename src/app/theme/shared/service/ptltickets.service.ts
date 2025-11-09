/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PTLUsuarioModel } from '../_helpers/models/PTLUsuario.model';
import { PTLTicketAPModel } from '../_helpers/models/PTLTicketAP.model';

const base_url = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class PTLTicketsService {
  user: PTLUsuarioModel = new PTLUsuarioModel();

  constructor(private http: HttpClient) {}

  get token(): string {
    this.user = JSON.parse(localStorage.getItem('currentUser') || '');
    return this.user.serviceToken || '';
  }

  get headers() {
    return {
      headers: {
        'x-token': this.token
      }
    };
  }

  getRegistros() {
    const url = `${base_url}/tickets-ap`;
    return this.http.get(url)
    .pipe(
      map((resp: any) => {
        console.log('servicio de ticket', resp);
        return {
          ok: true,
          tickets: resp.tickets
        };
      })
    );
  }

  getRegistroById(id: number) {
    const url = `${base_url}/tickets-ap/${id}`;
    return this.http.get(url).pipe(
      map((resp: any) => {
        console.log('data de ticket', resp);
        return {
          ok: true,
          ticket: resp.ticketAP
        };
      })
    );
  }

  postCrearRegistro(data: any) {
    console.log('servicio tickets', data);
    const url = `${base_url}/tickets-ap`;
    return this.http.post(url, data).pipe(
      map((resp: any) => {
        return {
          ok: true,
          ticket: resp.ticketAP
        };
      })
    );
  }

  putModificarRegistro(ticket: PTLTicketAPModel) {
    const url = `${base_url}/tickets-ap/${ticket.ticketId}`;
    return this.http.put(url, ticket).pipe(
      map((resp: any) => {
        console.log('data de ticket modificacda', resp);
        return {
          ok: true,
          ticket: resp.ticketAP
        };
      })
    );
  }

  deleteEliminarRegistro(_id: number) {
    const url = `${base_url}/tickets-ap/${_id}`;
    return this.http.delete(url).pipe(
      map((resp: any) => {
        console.log('data de ticket eliminado', resp);
        return {
          ok: true,
          ticket: resp.ticket
        };
      })
    );
  }
}
