import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket!: Socket;

  constructor() {
    this.connect();
  }

  connect(): void {
    this.socket = io(window.location.origin);
    this.socket.on('connect', () => {
      console.log('✅ Socket connected:', this.socket.id);
    });
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

  joinAchievementRoom(userId: string): void {
    this.socket.emit('join-user-achievements', userId);
  }

  onAchievement(callback: (achievement: any) => void): void {
    this.socket.on('new-achievement', callback);
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}
