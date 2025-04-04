import { join } from 'path';

import { parse as parseCookie } from 'cookie';
import { readJSON } from 'fs-extra';
import * as jwt from 'jsonwebtoken';
import { chain } from 'lodash';
import { Server, Socket } from 'socket.io';

import { Cron, CronExpression } from '@nestjs/schedule';
import { ConnectedSocket, MessageBody, OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';

import { configService, Logger } from '@kb-config';
import { Achievement, ApiInfo, User } from '@kb-models';

interface IAuthenticatedEventData {
  user: User;
}

interface AuthenticatedSocket extends Socket {
  data: IAuthenticatedEventData;
}

@WebSocketGateway({ cors: { origin: true, credentials: true } })
export class EventsGateway implements OnGatewayConnection {
  private readonly logger = new Logger(EventsGateway.name);
  private apiDetails: ApiInfo;

  @WebSocketServer()
    server: Server;

  constructor() {}

  afterInit(server: Server) {
    server.use((socket: AuthenticatedSocket, next) => {
      const payload = this.getUserFromCookieOrHeaderToken(socket);

      if (!payload) {
        return next();
      }

      socket.data.user = {
        id: payload.sub,
        username: payload.username
      } as User;

      next();
    });
  }

  // on client connect, broadcast the api version
  async handleConnection(client: AuthenticatedSocket) {
    this.logger.debug('Client connected', { clientId: client.id });

    const apiDetails = await this.getApiDetails();

    // TODO: join user achievements room instead of client asking to join
    // if user is logged in and not onboarded, emit onboarding:start event
    const loggedInUser = client.data.user;

    if (loggedInUser) {
      this.logger.debug('User is logged in', { username: loggedInUser.username });
      client.join(`user-achievements:${ loggedInUser.username }`);
    }

    if (loggedInUser && !loggedInUser.isOnboarded) {
      this.logger.debug('User is not onboarded', { username: loggedInUser.username });
      client.emit('onboarding:start');
    }

    this.broadcastVersion(apiDetails.version, client);
  }

  @SubscribeMessage('join-user-achievements')
  handleJoinUserAchievements(@ConnectedSocket() client: Socket, @MessageBody() username: string) {
    this.logger.debug('User JOINED user achievement\'s room', {
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
    this.logger.debug('User LEFT user achievement\'s room', {
      roomUsername: username,
      clientUserId: client.id
    });
    client.leave(`user-achievements:${ username }`);
  }

  @SubscribeMessage('join-organization-achievements')
  handleJoinOrganizationAchievements(@ConnectedSocket() client: Socket, @MessageBody() orgName: string) {
    this.logger.debug('User JOINED organization achievement\'s room', {
      roomOrgName: orgName,
      clientUserId: client.id
    });
    client.join(`organization-achievements:${ orgName }`);
  }

  @SubscribeMessage('leave-organization-achievements')
  handleLeaveOrganizationAchievements(@ConnectedSocket() client: Socket, @MessageBody() orgName: string) {
    this.logger.debug('User LEFT organization achievement\'s room', {
      roomUsername: orgName,
      clientUserId: client.id
    });
    client.leave(`organization-achievements:${ orgName }`);
  }

  @SubscribeMessage('join-repository-achievements')
  handleJoinRepositoryAchievements(@ConnectedSocket() client: Socket, @MessageBody() repoId: string) {
    this.logger.debug('User JOINED repository achievement\'s room', {
      roomRepoId: repoId,
      clientUserId: client.id
    });
    client.join(`repository-achievements:${ repoId }`);
  }

  @SubscribeMessage('leave-repository-achievements')
  handleLeaveRepositoryAchievements(@ConnectedSocket() client: Socket, @MessageBody() repoId: string) {
    this.logger.debug('User LEFT repository achievement\'s room', {
      roomRepoId: repoId,
      clientUserId: client.id
    });
    client.leave(`repository-achievements:${ repoId }`);
  }

  @SubscribeMessage('test-test-test')
  testStartMiniGame(
    @ConnectedSocket() client: Socket
  ) {
    client.emit('test-test-test-do-it');
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
      description: 'This is a test achievement'
    };

    this.logger.debug('Sending test USER achievement event', {
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
      description: 'This is a test achievement'
    };

    this.logger.debug('Sending test USER achievement event', {
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
      description: 'This is a test achievement'
    };

    this.logger.debug('Sending test ORG achievement event', {
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
      description: 'This is a test achievement'
    };

    this.logger.debug('Sending test REPO achievement event', {
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

  private getUserFromCookieOrHeaderToken(socket: AuthenticatedSocket) {
    try {
      const cookieHeader = socket.handshake.headers.cookie;
      const cookies = cookieHeader ? parseCookie(cookieHeader) : {};
      const token: string = cookies['kibibit-jwt'] || socket.handshake.auth.token;

      if (!token) {
        // will throw an error and the socket will not be authenticated
        // return value is in catch block
        throw new Error('No token provided in cookies or headers');
      }

      return jwt.verify(token, configService.config.JWT_SECRET) as jwt.JwtPayload & User;
    } catch (error) {
      this.logger.warn('Failed to authenticate socket:', error.message);
      return null;
    }
  }
}
