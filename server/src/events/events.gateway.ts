import { Server } from 'socket.io';

import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';

@WebSocketGateway()
export class EventsGateway {
  @WebSocketServer()
    server: Server;

  constructor() {
    setInterval(() => {
      this.sendPingMessage();
    }, 30000);
  }
  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    return 'Hello world!';
  }

  async sendPingMessage() {
    console.log('Sending ping message to all clients...');
    this.server.emit('ping', 'dev check');
  }
}
