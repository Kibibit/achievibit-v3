/* eslint-disable line-comment-position */
import { User } from '../generated';
import { IEventMapBase, IServerToClientEventShape } from './base-event-map.type';
import { IAnnouncementPayload } from './payloads/announcement.payload';
import { IGameUpdatePayload } from './payloads/game-update.payload';
import { ILivesUpdatePayload } from './payloads/lives-update.payload';
import { IMessageReceivedPayload } from './payloads/message-recieved.payload';
import { IXPUpdatePayload } from './payloads/xp-update.payload';

export enum ServerToClientEvent {
  Connect = 'connect',
  Disconnect = 'disconnect',
  Reconnect = 'reconnect',
  MessageReceived = 'message:received',
  SystemAnnouncement = 'system:announcement'
}

function createUserEventMap(userId: string) {
  return {
    LivesUpdate: `user:${ userId }:update:lives`,
    LevelUpdate: `user:${ userId }:update:level`,
    XPUpdate: `user:${ userId }:update:update`,,
    MiniGameEntered: `user:${ userId }:mini-game:entered`,
    MiniGameLeft: `user:${ userId }:mini-game:left`,
    Updated: `user:${ userId }:updated`
  } as const;
}

export const SessionUserEvents = createUserEventMap('me');

export enum MiniGameEvents {
  MiniGameStarted = 'mini-game:started',
  MiniGameFinished = 'mini-game:finished',
  MiniGameUpdated = 'mini-game:updated',
  MiniGameAction = 'mini-game:action'
}

export interface IServerToClientEventMap extends IEventMapBase<IServerToClientEventShape> {
  [ServerToClientEvent.MessageReceived]: {
    payload: IMessageReceivedPayload;
  };

  [ServerToClientEvent.SystemAnnouncement]: {
    payload: IAnnouncementPayload;
  };

  [SessionUserEvents.LivesUpdate]: {
    payload: ILivesUpdatePayload;
  };

  [SessionUserEvents.LevelUpdate]: {
    payload: IXPUpdatePayload;
  };

  [SessionUserEvents.XPUpdate]: {
    payload: IXPUpdatePayload;
  };

  [SessionUserEvents.MiniGameEntered]: {
    payload: IGameUpdatePayload;
  };

  [SessionUserEvents.MiniGameLeft]: {
    payload: IGameUpdatePayload;
  };

  [SessionUserEvents.Updated]: {
    payload: User;
  };
}
