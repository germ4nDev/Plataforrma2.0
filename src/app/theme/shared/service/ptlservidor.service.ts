import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from "rxjs";
import { environment } from "src/environments/environment";
import { PTLServidorModel } from "../_helpers/models/PTLServidor.model";
import { PTLUsuarioModel } from "../_helpers/models/PTLUsuario.model";

const base_url = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class PTLServidorService {
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
    const url = `${base_url}/servidores`;
    return this.http.get(url)
    .pipe(
      map((resp: any) => {
        console.log('servicio de servidores', resp);
        return {
          ok: true,
          servidores: resp.servidores
        };
      })
    );
  }

  getRegistroById(id: number) {
    const url = `${base_url}/servidores/${id}`;
    return this.http.get(url)
    .pipe(
      map((resp: any) => {
        console.log('data de servidor', resp);
        return {
          ok: true,
          servidor: resp.servidor
        };
      })
    );
  }

  postCrearRegistro(servidor: PTLServidorModel) {
    const url = `${base_url}/servidores`;
    return this.http.post(url, servidor);
  }

  putModificarRegistro(servidor: PTLServidorModel) {
    const url = `${base_url}/servidores/${servidor.servidorId}`;
    return this.http.put(url, servidor)
    .pipe(
      map((resp: any) => {
        console.log('data de servidor modificacda', resp);
        return {
          ok: true,
          servidor: resp.servidor
        };
      })
    );
  }

  deleteEliminarRegistro(_id: number) {
    const url = `${base_url}/servidores/${_id}`;
    return this.http.delete(url)
    .pipe(
      map((resp: any) => {
        console.log('data de servidor eliminado', resp);
        return {
          ok: true,
          servidor: resp.servidor
        };
      })
    );
  }
}
