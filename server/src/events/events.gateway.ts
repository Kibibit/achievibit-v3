import { Server, Socket } from 'socket.io';

import { ConnectedSocket, MessageBody, OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Achievement, ApiInfo } from '@kb-models';
import { Cron, CronExpression } from '@nestjs/schedule';
import { configService, Logger } from '@kb-config';
import { OnModuleInit } from '@nestjs/common';
import { AppService } from '../app.service';
import { readJSON } from 'fs-extra';
import { join } from 'path';
import { chain } from 'lodash';

@WebSocketGateway({ cors: { origin: true, credentials: true } })
export class EventsGateway implements OnGatewayConnection {
  private readonly logger = new Logger(EventsGateway.name);
  private apiDetails: ApiInfo;

  @WebSocketServer()
    server: Server;

  constructor() {
    setInterval(() => {
      this.sendPingMessage();
    }, 30000);
  }

  // on client connect, broadcast the api version
  async handleConnection(client: Socket) {
    this.logger.debug('Client connected', { clientId: client.id });

    const apiDetails = await this.getApiDetails();

    this.broadcastVersion(apiDetails.version, client);
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

    return {
      status: 'ok',
      message: `Joined user achievements room: ${ username }`,
      roomName: `user-achievements:${ username }`
    };
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
  @Cron(CronExpression.EVERY_MINUTE)
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

  // whenever we are at *:40 of every minute
  @Cron('40 * * * * *')
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

  @Cron('40 * * * * *')
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

  @Cron('40 * * * * *')
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

  async broadcastVersion(apiVersion: string, client?: Socket) {
    if (client) {
      return client.emit('version-update', { apiVersion });
    }

    this.server.emit('version-update', { apiVersion });
  }

  private async getApiDetails() {
    if (!this.apiDetails) {
      const packageInfo = await readJSON(
        join(configService.appRoot, './package.json')
      );
      this.apiDetails = new ApiInfo(
        chain(packageInfo)
          .pick([
            'name',
            'description',
            'version',
            'license',
            'repository',
            'author',
            'bugs'
          ])
          .mapValues((val) => val.url ? val.url : val)
          .value()
      );
    }

    return this.apiDetails;
  }
}
