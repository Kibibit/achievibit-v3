import { JwtService } from '@kb-auth';
import { configService, Logger } from '@kb-config';
import { User } from '@kb-models';
import { ConnectedSocket, MessageBody, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { parse as parseCookie } from 'cookie';
import * as jwt from 'jsonwebtoken';
import { Cron, CronExpression } from '@nestjs/schedule';

class MiniGame {
  name: string;
  lives: number;
  state: string;
  score: number;
}

interface IAuthenticatedEventData {
  user: User;
}

interface IMiniGameEventData {
  miniGame: MiniGame;
}

interface MiniGameSocket extends Socket {
  data: IAuthenticatedEventData & IMiniGameEventData;
}

@WebSocketGateway({ cors: { origin: true, credentials: true } })
export class MiniGamesGateway implements OnGatewayInit {
  private readonly logger = new Logger(MiniGamesGateway.name);

  @WebSocketServer()
      server: Server;

  afterInit(server: Server) {
    server.use((socket: MiniGameSocket, next) => {
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

  private getUserFromCookieOrHeaderToken(socket: MiniGameSocket) {
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

  // join user mini-games room that will be used to send mini-game events
  // including starting the mini-game, updating lives, etc.
  @SubscribeMessage('join-user-mini-games')
  handleJoinUserMiniGames(@ConnectedSocket() client: MiniGameSocket) {
    this.logger.debug(`User JOINED user mini-games room`, {
      clientUserId: client.id,
      username: client.data?.user?.username || 'unauthenticated'
    });
    if (!client.data.user) {
      return { error: 'Authentication required to join this room.' };
    }

    client.join(this.getUserMiniGameRoomName(client.data.user.username));

    // acknowledge the event
    return {
      isListening: true,
      message: 'User mini-games room joined successfully',
      roomName: this.getUserMiniGameRoomName(client.data.user.username)
    };
  }

  // leave user mini-games room
  @SubscribeMessage('leave-user-mini-games')
  handleLeaveUserMiniGames(@ConnectedSocket() client: MiniGameSocket) {
    this.logger.debug(`User LEFT user mini-games room`, {
      clientUserId: client.id,
      username: client.data?.user?.username || 'unauthenticated'
    });
    if (!client.data.user) {
      return { error: 'Authentication required to leave this room.' };
    }

    client.leave(this.getUserMiniGameRoomName(client.data.user.username));
  }

  // mini game started
  startMiniGameForUser(user: User, miniGameName: string) {
    this.logger.debug(`User mini-game start sent!`, {
      roomMiniGameName: miniGameName,
      username: user.username
    });

    const miniGame = {
      name: miniGameName,
      lives: mockGetPlayerLives(),
      state: 'playing',
      score: 0,
      iframeUrl: `${ configService.config.BASE_BACKEND_URL }/mini-game/${ miniGameName }`
    };

    const roomName = this.getUserMiniGameRoomName(user.username);
    this.server.to(roomName).emit('mini-game-start', miniGame);
  }

  @SubscribeMessage('player-hit')
  handlePlayerHit(@ConnectedSocket() client: Socket, @MessageBody() livesToRemove: number) {
    // update lives for the player. this is not persistent, it's just for the mini-game
    const newLivesValue = mockGetPlayerLives() - livesToRemove;

    // update the client about the new lives value
    client.emit('lives-change', newLivesValue);
  }

  @SubscribeMessage('player-heal')
  handlePlayerHeal(@ConnectedSocket() client: Socket, @MessageBody() livesToAdd: number) {
    // update lives for the player. this is not persistent, it's just for the mini-game
    const newLivesValue = (mockGetPlayerLives() + livesToAdd) > mockGetMaxLives() ?
      mockGetMaxLives() :
      mockGetPlayerLives() + livesToAdd;

    // update the client about the new lives value
    client.emit('lives-change', newLivesValue);
  }

  // player got extra lives from a power-up
  @SubscribeMessage('player-extra-lives')
  handlePlayerExtraLives(@ConnectedSocket() client: Socket, @MessageBody() extraLives: number) {
    // update lives for the player. this is not persistent, it's just for the mini-game
    const newLivesValue = mockGetPlayerLives() + extraLives;

    // update the client about the new lives value
    client.emit('lives-change', newLivesValue);
  }

  // join mini-game
  @SubscribeMessage('join-mini-game')
  handleJoinMiniGame(
    @ConnectedSocket() client: MiniGameSocket,
    @MessageBody() data: { miniGameName: string; }
  ) {
    this.logger.debug(`User JOINED mini-game room`, {
      roomMiniGameName: data.miniGameName,
      clientUserId: client.id,
      username: client.data?.user?.username || 'unauthenticated'
    });
    if (!client.data.user) {
      return { error: 'Authentication required to join this room.' };
    }

    client.data.miniGame = {
      name: data.miniGameName,
      lives: mockGetPlayerLives(),
      state: 'playing',
      score: 0
    }
    client.join(`mini-game:${ data.miniGameName }:${ client.data.user.username }`);
    // emit the current mini-game state to the client
    client
      .emit('mini-game-state', client.data.miniGame);

      return client.data.miniGame;
  }

  // leave mini-game
  @SubscribeMessage('leave-mini-game')
  handleLeaveMiniGame(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { username: string; miniGameName: string; }
  ) {
    client.leave(`mini-game:${ data.miniGameName }:${ data.username }`);
  }

  // emit game started event to the client for testing every minute.
  // specifically for 'pizza-delivery' mini-game
  // and thatkookooguy user
  @Cron(CronExpression.EVERY_MINUTE)
  handleCron() {
    const user = {
      id: 'test-user-id',
      username: 'thatkookooguy'
    } as User;

    this.startMiniGameForUser(user, 'pizza-delivery');
  }

  private getUserMiniGameRoomName(username: string) {
    return `mini-game:${ username }`;
  }
}

function mockGetPlayerLives() {
  return 4;
}

function mockGetMaxLives() {
  return 4;
}