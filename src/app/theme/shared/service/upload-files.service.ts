/*
    Author: German Valencia
*/
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { HttpClient, HttpContext, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { catchError, map, throwError } from 'rxjs';
import { LocalStorageService } from './local-storage.service';
import { SKIP_TOKEN_INTERCEPTOR } from '../_helpers/http-context-keys';

const base_url = environment.apiUrl;

export interface UploadParams {
    susc: string;
    tipo: string;
    id?: string;
    file?: string;
}

@Injectable({
    providedIn: 'root'
})
export class UploadFilesService {
    constructor(
        private http: HttpClient,
        private _localStorageService: LocalStorageService
    ) { }

    uploadUserPhoto(file: File, objUpload: UploadParams) {
        const context = new HttpContext().set(SKIP_TOKEN_INTERCEPTOR, true);
        const formData = new FormData();
        formData.append('file', file);

        const headers = new HttpHeaders({
            'x-token': this._localStorageService.getTokenLocalStorage()
        });

        const url = `${base_url}/upload/${objUpload.susc}/${objUpload.tipo}/${objUpload.id}`;

        return this.http.put(url, formData, { context, headers }).pipe(
            map((resp: any) => {
                return {
                    ok: true,
                    data: resp
                };
            }),
            catchError((err) => {
                console.error('Error HTTP en la subida de archivo:', err);
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

    deleteFilePath(objUpload: UploadParams) {
        const pathUrl = `${base_url}/upload/delete/${objUpload.susc}/${objUpload.tipo || ''}/${objUpload.file}`;

        return this.http.delete(pathUrl).pipe(
            map((resp: any) => {
                return {
                    ok: true,
                    msg: resp.msg
                };
            })
        );
    }
}

