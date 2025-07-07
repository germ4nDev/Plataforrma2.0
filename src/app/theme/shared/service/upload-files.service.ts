import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpEvent, HttpEventType, HttpHeaders } from '@angular/common/http';
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
    return this.http.post<{ ok: boolean, path: string }>(`${this.baseUrl}/upload-photo`, formData, objUload)
      .pipe(
        map((res: any) => res.path),
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Error en la subida de archivo:', error);
    return throwError(() => new Error('Error al subir la imagen.'));
  }
}
