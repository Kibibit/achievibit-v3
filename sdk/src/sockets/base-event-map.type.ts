export interface IServerToClientEventShape {
  payload: any;
}

export interface IClientToServerEventShape {
  payload: any;
  response: any;
}

export interface IEventMapBase<T> {
  [eventName: string]: T;
}

export type EventNames<T extends IEventMapBase<any>> = {
  [K in keyof T]: K;
}[keyof T];

export type EventPayload<T extends IEventMapBase<any>, K extends EventNames<T>> = T[K]['payload'];
export type EventResponse<T extends IEventMapBase<any>, K extends EventNames<T>> = T[K]['response'];
