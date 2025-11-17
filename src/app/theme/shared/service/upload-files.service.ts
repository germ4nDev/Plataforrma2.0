/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs';

const base_url = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class UploadFilesService {
  constructor(private http: HttpClient) {}

  uploadUserPhoto(file: File, objUpload: any) {
    const formData = new FormData();
    formData.append('foto', file);
    const url = `${base_url}/upload/${objUpload.susc}/${objUpload.tipo}/${objUpload.id}`;
    return this.http.put(url, formData);
  }

  getFilePath(susc: string, type: string, fileName: string) {
    const pathUrl = `${base_url}/upload/${susc}/${type}/${fileName}`;
    // console.log('path de la imagen', pathUrl);
    return pathUrl;
  }

  deleteFilePath(susc: string, type: string, fileName: string) {
    const pathUrl = `${base_url}/upload/delete/${susc}/${type}/${fileName}`;
    // console.log('path de la rutaAPI', pathUrl);
    return this.http.delete(pathUrl).pipe(
      map((resp: any) => {
        // console.log('data del archivo eliminado', resp);
        return {
          ok: true,
          mensaje: resp.mensaje
        };
      })
    );
  }
}
