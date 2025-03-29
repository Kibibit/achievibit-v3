import { IClientToServerEventShape, IEventMapBase } from './base-event-map.type';

export enum ClientToServerEvent {
  /**
   * Logged in user connects to the server
   */
  JoinLoggedInUserRoom = 'join-room:logged-in-user',
  JoinUserAchievementsRoom = 'join-room:user-achievements',
  JoinOrgAchievementsRoom = 'join-room:org-achievements',
  JoinRepoAchievementsRoom = 'join-room:repo-achievements'
}

interface IJoinUserAchievementsRoomPayload {
  username: string;
}

interface IJoinOrgAchievementsRoomPayload {
  name: string;
}

interface IJoinRepoAchievementsRoomPayload {
  fullname: string;
}

interface IJoinRoomResponse {
    status: 'ok' | 'error';
    message: string;
    roomName?: string;
    error?: string;
}

export interface IClientToServerEventMap extends IEventMapBase<IClientToServerEventShape> {
  [ClientToServerEvent.JoinLoggedInUserRoom]: {
    payload: undefined;
    response: IJoinRoomResponse;
  };

  [ClientToServerEvent.JoinUserAchievementsRoom]: {
    payload: IJoinUserAchievementsRoomPayload;
    response: IJoinRoomResponse;
  };

  [ClientToServerEvent.JoinOrgAchievementsRoom]: {
    payload: IJoinOrgAchievementsRoomPayload;
    response: IJoinRoomResponse;
  };

  [ClientToServerEvent.JoinRepoAchievementsRoom]: {
    payload: IJoinRepoAchievementsRoomPayload;
    response: IJoinRoomResponse;
  };
}
