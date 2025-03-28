import { Server, Socket } from 'socket.io';

import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Achievement } from '@kb-models';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Logger } from '@kb-config';

@WebSocketGateway({ cors: { origin: true, credentials: true } })
export class EventsGateway {
  private readonly logger = new Logger(EventsGateway.name);
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
    this.logger.debug(`User JOINED user achievement's room`, {
      roomUsername: username,
      clientUserId: client.id
    });
    client.join(`user-achievements:${ username }`);
  }

  @SubscribeMessage('leave-user-achievements')
  handleLeaveUserAchievements(@ConnectedSocket() client: Socket, @MessageBody() username: string) {
    this.logger.debug(`User LEFT user achievement's room`, {
      roomUsername: username,
      clientUserId: client.id
    });
    client.leave(`user-achievements:${ username }`);
  }

  @SubscribeMessage('join-organization-achievements')
  handleJoinOrganizationAchievements(@ConnectedSocket() client: Socket, @MessageBody() orgName: string) {
    this.logger.debug(`User JOINED organization achievement's room`, {
      roomOrgName: orgName,
      clientUserId: client.id
    });
    client.join(`organization-achievements:${ orgName }`);
  }

  @SubscribeMessage('leave-organization-achievements')
  handleLeaveOrganizationAchievements(@ConnectedSocket() client: Socket, @MessageBody() orgName: string) {
    this.logger.debug(`User LEFT organization achievement's room`, {
      roomUsername: orgName,
      clientUserId: client.id
    });
    client.leave(`organization-achievements:${ orgName }`);
  }

  @SubscribeMessage('join-repository-achievements')
  handleJoinRepositoryAchievements(@ConnectedSocket() client: Socket, @MessageBody() repoId: string) {
    this.logger.debug(`User JOINED repository achievement's room`, {
      roomRepoId: repoId,
      clientUserId: client.id
    });
    client.join(`repository-achievements:${ repoId }`);
  }

  @SubscribeMessage('leave-repository-achievements')
  handleLeaveRepositoryAchievements(@ConnectedSocket() client: Socket, @MessageBody() repoId: string) {
    this.logger.debug(`User LEFT repository achievement's room`, {
      roomRepoId: repoId,
      clientUserId: client.id
    });
    client.leave(`repository-achievements:${ repoId }`);
  }

  async sendPingMessage() {
    if (!this.server) {
      this.logger.error('Socket server is not initialized');
      return;
    }

    this.logger.debug('Sending ping message to all clients...');
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
  @Cron(CronExpression.EVERY_10_MINUTES)
  async testAchievementEvent() {
    const username = 'thatkookooguy';
    const mockAchievement = {
      id: 'test-achievement',
      avatar: 'https://github.com/kibibit.png',
      name: `Test Achievement ${ Math.round(Math.random() * 100000000) }`,
      description: 'This is a test achievement',
    };

    this.logger.debug(`Sending test USER achievement event`, {
      username,
      mockAchievement
    });
    this.sendAchievementToUser(username, mockAchievement);
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async testAchievementEvent2() {
    const username = 'k1b1b0t';
    const mockAchievement = {
      id: 'test-another-achievement',
      avatar: 'https://github.com/k1b1b0t.png',
      name: `ANOTHER Achievement  ${ Math.round(Math.random() * 100000000) }`,
      description: 'This is a test achievement',
    };

    this.logger.debug(`Sending test USER achievement event`, {
      username,
      mockAchievement
    });
    this.sendAchievementToUser(username, mockAchievement);
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async testAchievementEvent3() {
    const orgName = 'Kibibit';
    const mockAchievement = {
      id: 'test-another-achievement',
      avatar: 'https://github.com/k1b1b0t.png',
      name: `ORG Achievement ${ Math.round(Math.random() * 100000000) }`,
      description: 'This is a test achievement',
    };

    this.logger.debug(`Sending test ORG achievement event`, {
      orgName,
      mockAchievement
    });
    this.sendAchievementToOrg(orgName, mockAchievement);
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async testAchievementEvent4() {
    const repoFullname = 'Kibibit/404';
    const mockAchievement = {
      id: 'test-another-achievement',
      avatar: 'https://picsum.photos/seed/404/100',
      name: `REPO Achievement ${ Math.round(Math.random() * 100000000) }`,
      description: 'This is a test achievement',
    };

    this.logger.debug(`Sending test REPO achievement event`, {
      repoFullname,
      mockAchievement
    });
    this.sendAchievementToRepo(repoFullname, mockAchievement);
  }
}
