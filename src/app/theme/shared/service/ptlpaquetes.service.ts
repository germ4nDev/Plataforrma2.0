import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PTLPaquetesModel } from '../_helpers/models/PTLPaquete.model';
import { PTLUsuarioModel } from '../_helpers/models/PTLUsuario.model';


const base_url = environment.apiUrl;
@Injectable({
  providedIn: 'root'
})
export class PTLPaquetesService {
  user: PTLUsuarioModel = new PTLUsuarioModel();

  constructor(private http: HttpClient) {}

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
    };
  }

  getRegistros() {
    const url = `${base_url}/paquetes`;
    return this.http.get(url)
    .pipe(
      map((resp: any) => {
        console.log('servicio de paquetes', resp);
        return {
          ok: true,
          paquetes: resp.paquetes
        };
      })
    );
  }

  getRegistroById(id: number) {
    const url = `${base_url}/paquetes/${id}`;
    return this.http.get(url).pipe(
      map((resp: any) => {
        console.log('data de paquete', resp);
        return {
          ok: true,
          paquete: resp.paquete
        };
      })
    );
  }

  postCrearRegistro(paquete: PTLPaquetesModel) {
    const url = `${base_url}/paquetes`;
    return this.http.post(url, paquete);
  }

  putModificarRegistro(paquete: PTLPaquetesModel) {
    const url = `${base_url}/paquetes/${paquete.paqueteId}`;
    return this.http.put(url, paquete).pipe(
      map((resp: any) => {
        console.log('data de paquete modificacda', resp);
        return {
          ok: true,
          paquete: resp.paquete
        };
      })
    );
  }

  deleteEliminarRegistro(_id: number) {
    const url = `${base_url}/paquetes/${_id}`;
    return this.http.delete(url).pipe(
      map((resp: any) => {
        console.log('data de paquete eliminado', resp);
        return {
          ok: true,
          paquete: resp.paquete
        };
      })
    );
  }
}
