import { BehaviorSubject, Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';

import { EventPayload, EventResponse } from './base-event-map.type';
import { ClientToServerEvent, IClientToServerEventMap } from './client-to-server.events';
import { IServerToClientEventMap, ServerToClientEvent } from './server-to-client.events';

export interface ISocketConnectionStatus {
  connected: boolean;
}

export class SocketService {
  private socket!: Socket;

  private socketConnectionStatusSubject = new BehaviorSubject<ISocketConnectionStatus>({ connected: false });
  socketConnectionStatus$ = this.socketConnectionStatusSubject.asObservable();

  constructor(private readonly serverUrl: string) {
    this.connect();
    this.monitorConnectionStatus();
  }

  connect() {
    this.socket = io(this.serverUrl, {
      withCredentials: true
    });
  }

  private monitorConnectionStatus() {
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

  emit<EventName extends ClientToServerEvent>(
    event: EventName,
    payload: EventPayload<IClientToServerEventMap, EventName>
  ) {
    return new Observable((subscriber) => {
      this.socket.emit(event as string, payload, (response) => {
        subscriber.next(response);
        subscriber.complete();
      });
    }) as Observable<EventResponse<IClientToServerEventMap, EventName>>;
  }

  on<EventName extends ServerToClientEvent>(
    event: EventName
  ) {
    return new Observable((subscriber) => {
      const callback = (payload: any) => {
        subscriber.next(payload);
      };

      this.socket.on(event as any, callback);

      // When the observable is unsubscribed, remove the listener
      // to prevent memory leaks
      // and ensure that the callback is not called after the observable is unsubscribed
      return () => {
        this.socket.off(event as any, callback);
      };
    }) as Observable<EventPayload<IServerToClientEventMap, EventName>>;
  }

  off<EventName extends ServerToClientEvent>(
    event: EventName
  ) {
    this.socket.off(event as any);
  }


  private testThingsOut() {
    this.emit(ClientToServerEvent.JoinUserAchievementsRoom, { username: 'thatkookooguy' })
      .subscribe((response) => {
        return response.roomName;
      });
  }
}
