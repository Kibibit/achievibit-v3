import { BehaviorSubject, Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { Injectable } from '@angular/core';

export interface ISocketConnectionStatus {
  connected: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket!: Socket;

  private socketConnectionStatusSubject = new BehaviorSubject<ISocketConnectionStatus>({ connected: false });
  socketConnectionStatus$ = this.socketConnectionStatusSubject.asObservable();

  constructor() {
    this.connect();

    this.socket.on('connect', () => {
      console.log('✅ Socket connected:', this.socket.id);
      this.socketConnectionStatusSubject.next({ connected: true });
    });

    this.socket.on('disconnect', () => {
      console.log('❌ Socket disconnected');
      this.socketConnectionStatusSubject.next({ connected: false });
    });

    this.socket.on('reconnect', () => {
      console.log('🔄 Socket reconnected:', this.socket.id);
      this.socketConnectionStatusSubject.next({ connected: true });
    });
  }

  getSocketConnectionStatus() {
    return this.socketConnectionStatus$;
  }

  connect() {
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

  joinAchievementRoom(userId: string) {
    this.socket.emit('join-user-achievements', userId);
  }

  leaveAchievementRoom(userId: string) {
    this.socket.emit('leave-user-achievements', userId);
  }

  joinOrganizationAchievementRoom(orgName: string) {
    this.socket.emit('join-organization-achievements', orgName);
  }

  leaveOrganizationAchievementRoom(orgName: string) {
    this.socket.emit('leave-organization-achievements', orgName);
  }

  joinRepositoryAchievementRoom(repoId: string) {
    this.socket.emit('join-repository-achievements', repoId);
  }

  leaveRepositoryAchievementRoom(repoId: string) {
    this.socket.emit('leave-repository-achievements', repoId);
  }

  onAchievement(userId: string, callback: (achievement: any) => void) {
    const eventName = `new-achievement:${ userId }`;
    this.socket.on(eventName, callback);
  }

  offAchievement(userId: string, callback: (achievement: any) => void) {
    const eventName = `new-achievement:${ userId }`;
    this.socket.off(eventName, callback);
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}
