/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  constructor(private socket: Socket) {
    console.log('SocketService inicializado.');

    this.socket.on('connect', () => {
      console.log('Socket.IO conectado al servidor.');
    });

    this.socket.on('disconnect', () => {
      console.warn('Socket.IO desconectado.');
    });
  }

  public listen(eventName: string): Observable<any> {
    return this.socket.fromEvent(eventName);
  }

  public emit(eventName: string, data?: any): void {
    this.socket.emit(eventName, data);
  }
}
