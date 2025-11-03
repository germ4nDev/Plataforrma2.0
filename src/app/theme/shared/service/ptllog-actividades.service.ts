/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { PTLUsuarioModel } from '../_helpers/models/PTLUsuario.model';
import { PTLLogActividadAPModel } from './../_helpers/models/PTLlogActividadAP.model';
import { NavSettings } from '../_helpers/models/navSettings.model';
import { LocalStorageService } from './local-storage.service';
import { PTLTiposLogsService } from './ptltipos-logs.service';
import { map } from 'rxjs';

const base_url = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class PtllogActividadesService {
  user: PTLUsuarioModel = new PTLUsuarioModel();
  navSettings: NavSettings = new NavSettings();
  tipos: any[] = [];

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

  get getLogBody() {
    const navs = this._localStorageSercice.getNavSettingsLocalStorage();
    const codigoAplicacion = navs.aplicacion ? navs.aplicacion.codigoAplicacion : '';
    const codigoSuite = navs.suite ? navs.suite.codigoSuite : '';
    const codigoModulo = navs.modulo ? navs.modulo.codigoModulo : '';
    const usuario = this._localStorageSercice.getUsuarioLocalStorage();
    const dataLog = {
      codigoAplicacion: codigoAplicacion,
      codigoSuite: codigoSuite,
      codigoModulo: codigoModulo,
      codigoSuscriptor: '',
      codigoTipoLog: '',
      codigoRespuesta: '',
      descripcionLog: '',
      codigoUsuarioCreacion: usuario.codigoUsuario,
      fechaLog: new Date().toISOString(),
      fechaCreacion: new Date().toISOString()
    };
    return dataLog;
  }

  constructor(
    private http: HttpClient,
    private _localStorageSercice: LocalStorageService,
    private _tiposLogsService: PTLTiposLogsService
  ) {
  }

  getRegistros() {
    const url = `${base_url}/logs-actividades`;
    return this.http.get(url).pipe(
      map((resp: any) => {
        console.log('servicio de log_actividads', resp);
        return {
          ok: true,
          log_actividades: resp.log_actividades
        };
      })
    );
  }

  getRegistroById(id: number) {
    const url = `${base_url}/logs-actividades/${id}`;
    return this.http.get(url).pipe(
      map((resp: any) => {
        console.log('data de log_actividad', resp);
        return {
          ok: true,
          log_actividad: resp.log_actividad
        };
      })
    );
  }

  postCrearRegistro(data: any) {
    // console.log('tipos logs', this.TiposLog);
    // AQUI ES DONDE NECESITARIA TENER LA LISTA DE TIPOS DE LOGS <-------------------
    const body = this.getLogBody;
    body.codigoTipoLog = data.codigoTipoLog || '';
    body.codigoRespuesta = data.codigoRespuesta || '';
    body.descripcionLog = data.descripcionLog || '';
    console.log('log actividad', data);
    const logactividad = body as PTLLogActividadAPModel;
    const url = `${base_url}/logs-actividades`;
    // return this.http.post(url, log_actividad);
    return this.http.post(url, logactividad).pipe(
      map((resp: any) => {
        return {
          ok: true,
          logActividad: resp.log
        };
      })
    );
  }
}
