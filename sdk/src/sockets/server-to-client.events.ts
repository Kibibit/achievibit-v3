import { IEventMapBase, IServerToClientEventShape } from './base-event-map.type';

export enum ServerToClientEvent {
  Connect = 'connect',
  Disconnect = 'disconnect',
  Reconnect = 'reconnect',
  MessageReceived = 'message:received',
  SystemAlert = 'system:alert',
  MiniGameStarted = 'mini-game:started',
  MiniGameEnded = 'mini-game:ended',
  MiniGameUpdated = 'mini-game:updated'
}

export interface IServerToClientEventMap extends IEventMapBase<IServerToClientEventShape> {
  [ServerToClientEvent.MessageReceived]: {
    payload: { from: string; content: string };
  };
  [ServerToClientEvent.SystemAlert]: {
    payload: { message: string; type: 'info' | 'warning' | 'error' };
  };
}
