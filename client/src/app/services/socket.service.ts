import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: Socket;

  constructor() {
    this.socket = io(window.location.origin);
  }

  emit(event: string, data: any) {
    this.socket.emit(event, data);
  }

  on(event: string): Observable<any> {
    return new Observable((observer) => {
      this.socket.on(event, (data) => {
        observer.next(data);
      });

      // Handle cleanup
      return () => {
        this.socket.off(event);
      };
    });
  }
}
