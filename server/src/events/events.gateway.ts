import { Server, Socket } from 'socket.io';

import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Achievement } from '@kb-models';
import { Cron, CronExpression } from '@nestjs/schedule';

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

  @SubscribeMessage('join-user-achievements')
  handleJoinAchievementsRoom(
    @MessageBody() userId: string,
    @ConnectedSocket() socket: Socket,
  ) {
    const room = `achievement:${ userId }`;
    socket.join(room);
    console.log(`Socket ${ socket.id } joined room: ${ room }`);
  }

  sendAchievementToUser(username: string, achievement: Partial<Achievement>) {
    this.server.to(`achievement:${ username }`).emit('new-achievement', achievement);
  }

  // TODO: Remove this method when done testing
  @Cron(CronExpression.EVERY_MINUTE)
  async testAchievementEvent() {
    console.log('Sending test achievement event');
    this.sendAchievementToUser('thatkookooguy', {
      id: 'test-achievement',
      avatar: 'https://github.com/kibibit.png',
      name: 'Test Achievement',
      description: 'This is a test achievement',
    });
  }
}
