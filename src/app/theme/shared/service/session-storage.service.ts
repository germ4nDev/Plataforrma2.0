import { Injectable } from '@angular/core';
import { BaseSessionModel } from '../_helpers/models/BaseSession.model';

@Injectable({
    providedIn: 'root'
})
export class SessionStorageService {
    DataModel: BaseSessionModel = new BaseSessionModel()

    constructor() { }

    // #region SETTERS
    setObject(key: string, value: any): void {
        if (value === null || value === undefined) return;

        try {
            const json = JSON.stringify(value);
            sessionStorage.setItem(key, json);
        } catch (error) {
            console.error('Error guardando en session:', error);
        }
    }
    // #endregion GETTERS

    // #region GETTERS
    getObject<T>(key: string): T | null {
        const value = sessionStorage.getItem(key);

        if (!value) return null;

        try {
            return JSON.parse(value) as T;
        } catch (error) {
            console.error(`Error deserializando la clave ${key}:`, error);
            return null;
        }
    }
    // #endregion GETTERS

    // #region REMOVERS
    removeObject(key: string): void {
        sessionStorage.removeItem(key);
    }

    clearAll(): void {
        sessionStorage.clear();
    }
    // #endregion
}
