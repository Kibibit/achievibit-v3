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

  @SubscribeMessage('join-user-achievements')
  handleJoinUserAchievements(@ConnectedSocket() client: Socket, @MessageBody() username: string) {
    console.log(`User ${ client.id } joined achievements room for ${ username }`);
    client.join(`user-achievements:${ username }`);
  }

  @SubscribeMessage('leave-user-achievements')
  handleLeaveUserAchievements(@ConnectedSocket() client: Socket, @MessageBody() username: string) {
    console.log(`User ${ client.id } left achievements room for ${ username }`);
    client.leave(`user-achievements:${ username }`);
  }

  @SubscribeMessage('join-organization-achievements')
  handleJoinOrganizationAchievements(@ConnectedSocket() client: Socket, @MessageBody() orgName: string) {
    console.log(`User ${ client.id } joined achievements room for organization ${ orgName }`);
    client.join(`organization-achievements:${ orgName }`);
  }

  @SubscribeMessage('leave-organization-achievements')
  handleLeaveOrganizationAchievements(@ConnectedSocket() client: Socket, @MessageBody() orgName: string) {
    console.log(`User ${ client.id } left achievements room for organization ${ orgName }`);
    client.leave(`organization-achievements:${ orgName }`);
  }

  @SubscribeMessage('join-repository-achievements')
  handleJoinRepositoryAchievements(@ConnectedSocket() client: Socket, @MessageBody() repoId: string) {
    console.log(`User ${ client.id } joined achievements room for repository ${ repoId }`);
    client.join(`repository-achievements:${ repoId }`);
  }

  @SubscribeMessage('leave-repository-achievements')
  handleLeaveRepositoryAchievements(@ConnectedSocket() client: Socket, @MessageBody() repoId: string) {
    console.log(`User ${ client.id } left achievements room for repository ${ repoId }`);
    client.leave(`repository-achievements:${ repoId }`);
  }

  async sendPingMessage() {
    console.log('Sending ping message to all clients...');
    this.server.emit('ping', 'dev check');
  }

  sendAchievementToUser(username: string, achievement: Partial<Achievement>) {
    this.server.to(`user-achievements:${ username }`).emit(`new-achievement:${ username }`, achievement);
  }

  sendAchievementToOrg(orgName: string, achievement: Partial<Achievement>) {
    this.server.to(`organization-achievements:${ orgName }`).emit(`new-achievement:${ orgName }`, achievement);
  }

  sendAchievementToRepo(repoId: string, achievement: Partial<Achievement>) {
    this.server.to(`repository-achievements:${ repoId }`).emit(`new-achievement:${ repoId }`, achievement);
  }

  // TODO: Remove this method when done testing
  @Cron(CronExpression.EVERY_MINUTE)
  async testAchievementEvent() {
    console.log('Sending test achievement event');
    this.sendAchievementToUser('thatkookooguy', {
      id: 'test-achievement',
      avatar: 'https://github.com/kibibit.png',
      name: `Test Achievement ${ Math.round(Math.random() * 100000000) }`,
      description: 'This is a test achievement',
    });
  }

  @Cron(CronExpression.EVERY_30_SECONDS)
  async testAchievementEvent2() {
    console.log('Sending test achievement event');
    this.sendAchievementToUser('k1b1b0t', {
      id: 'test-another-achievement',
      avatar: 'https://github.com/k1b1b0t.png',
      name: `ANOTHER Achievement  ${ Math.round(Math.random() * 100000000) }`,
      description: 'This is a test achievement',
    });
  }

  @Cron(CronExpression.EVERY_10_SECONDS)
  async testAchievementEvent3() {
    console.log('Sending test achievement event');
    this.sendAchievementToOrg('Kibibit', {
      id: 'test-another-achievement',
      avatar: 'https://github.com/k1b1b0t.png',
      name: `ORG Achievement ${ Math.round(Math.random() * 100000000) }`,
      description: 'This is a test achievement',
    });
  }

  @Cron(CronExpression.EVERY_10_SECONDS)
  async testAchievementEvent4() {
    console.log('Sending test achievement event');
    this.sendAchievementToRepo('Kibibit/404', {
      id: 'test-another-achievement',
      avatar: 'https://github.com/k1b1b0t.png',
      name: `ORG Achievement ${ Math.round(Math.random() * 100000000) }`,
      description: 'This is a test achievement',
    });
  }
}
