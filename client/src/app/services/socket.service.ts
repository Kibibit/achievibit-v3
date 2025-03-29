import { BehaviorSubject, Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { Injectable } from '@angular/core';

export interface ISocketConnectionStatus {
  connected: boolean;
}

export interface IMiniGameRoomConnectedEventData {
  isListening: boolean;
  message: string;
  roomName: string;
  error?: string;
};

export interface IMiniGameEventData {
  gameState?: Record<string, any>;
  miniGameName: string;
  eventType: string;
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
    this.socket = io(window.location.origin, {
      withCredentials: true
    });
  }

  emit(event: string, data: any, callback?: (response: any) => void) {
    this.socket.emit(event, data);
  }

  joinUserMiniGamesRoom() {
    return new Observable<IMiniGameEventData>((observer) => {
      this.socket.emit('join-user-mini-games', {}, (response: IMiniGameRoomConnectedEventData) => {
        // This is the ack from the server
        if (response?.error) {
          observer.error(response.error);
        } else {
          // could include game state, etc.
          observer.next({
            miniGameName: response.roomName,
            eventType: 'join-user-mini-games'
          });
          // observer.complete();
        }
      });

      this.socket.on('mini-game-start', (game) => {
        observer.next({
          gameState: game,
          miniGameName: game.miniGameName,
          eventType: 'mini-game-start'
        });
        console.log('🎮 Mini-game started:', game);
      });

      // If needed, handle "mini-game-state" as a separate stream
      this.socket.on('mini-game-state', (state) => {
        console.log('🎮 Mini-game state:', state);
      });

      this.socket.on('mini-game-end', (state) => {
        observer.next({
          gameState: state,
          miniGameName: state.miniGameName,
          eventType: 'mini-game-end'
        });
        console.log('🎮 Mini-game ended:', state);
      });
    });
  }

  leaveUserMiniGamesRoom() {
    this.socket.emit('leave-user-mini-games');
  }

  joinMiniGameRoom(miniGameName: string) {
    return new Observable((observer) => {
      this.socket.emit('join-mini-game', { miniGameName }, (response: any) => {
        // This is the ack from the server
        if (response?.error) {
          observer.error(response.error);
        } else {
          // could include game state, etc.
          observer.next(response);
          // observer.complete();
        }
      });

      // If needed, handle "mini-game-state" as a separate stream
      this.on('mini-game-state').subscribe((state) => {
        console.log('🎮 Mini-game state:', state);
      });
    });
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
