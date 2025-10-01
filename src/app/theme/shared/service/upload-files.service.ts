/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UploadFilesService {

  private baseUrl = 'http://localhost:3000/api'; // Cambia según tu backend

  constructor(private http: HttpClient) { }

  uploadUserPhoto(file: File, objUload: any): Observable<string> {
    const formData = new FormData();
    formData.append('foto', file);
    return this.http.post<{ ok: boolean, path: string }>(`${this.baseUrl}/upload`, formData, objUload)
      .pipe(
        map((res: any) => res.path),
        catchError(this.handleError)
      );
  }

  getFilePath(type: string, fileName: string) {
    const pathUrl = `${this.baseUrl}/upload/${type}/${fileName}`;
    console.log('path de la imagen', pathUrl);
    return pathUrl;
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Error en la subida de archivo:', error);
    return throwError(() => new Error('Error al subir la imagen.'));
  }
}
