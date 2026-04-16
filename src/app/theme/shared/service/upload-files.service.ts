/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { HttpClient, HttpContext, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { catchError, map, throwError } from 'rxjs';
import { LocalStorageService } from './local-storage.service';
import { SKIP_TOKEN_INTERCEPTOR } from '../_helpers/http-context-keys';

const base_url = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class UploadFilesService {
  constructor(
    private http: HttpClient,
    private _localStorageService: LocalStorageService
  ) {}

  uploadUserPhoto(file: File, objUpload: any) {
    const context = new HttpContext().set(SKIP_TOKEN_INTERCEPTOR, true);
    const formData = new FormData();
    formData.append('file', file);
    const headers = new HttpHeaders({
      'x-token': this._localStorageService.getTokenLocalStorage()
    });
    // console.log('Token JWT a enviar:', this._localStorageService.getTokenLocalStorage());
    const url = `${base_url}/upload/${objUpload.susc}/${objUpload.tipo}/${objUpload.id}`;
    return this.http
      .put(url, formData, {
        context: context,
        headers: headers,
        responseType: 'text' as 'json'
      })
      .pipe(
        map((resp: any) => {
          try {
            return JSON.parse(resp);
          } catch (e) {
            console.error('Error: La respuesta no es JSON válido. Contenido de la respuesta:', resp);
            throw new Error('Respuesta no es JSON válido: ' + resp);
          }
        }),
        catchError((err) => {
          console.error('Error HTTP en la subida:', err);
          return throwError(() => err);
        })
      );
  }

  getFilePath(susc: string, type: string, fileName: string) {
    const pathUrl = `${base_url}/upload/${susc}/${type}/${fileName}`;
    return pathUrl;
  }

  setFolderSuscriptor(susc: string) {
    const url = `${base_url}/upload/folder/${susc}`;
    return this.http.get(url);
  }

  deleteFilePath(objUpload: any) {
    console.log('susc', objUpload.susc);
    console.log('tipo', objUpload.tipo);
    console.log('foto', objUpload.file);
    const pathUrl = `${base_url}/upload/delete/${objUpload.susc}/${objUpload.tipo}/${objUpload.file}`;
    console.log('path de la rutaAPI', pathUrl);
    return this.http.delete(pathUrl).pipe(
      map((resp: any) => {
        console.log('data del archivo eliminado', resp);
        return {
          ok: true,
          mensaje: resp.mensaje
        };
      })
    );
  }
}
