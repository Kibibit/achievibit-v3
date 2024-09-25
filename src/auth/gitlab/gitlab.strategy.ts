import { Profile, Strategy } from 'passport-gitlab2';
import { SystemEnum } from 'src/models/Integration.entity';

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import { configService } from '@kb-config';
import { Integration } from '@kb-models';
import { UsersService } from '@kb-users';

@Injectable()
export class GitLabStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly usersService: UsersService
  ) {
    super({
      clientID: configService.config.GITLAB_CLIENT_ID,
      clientSecret: configService.config.GITLAB_CLIENT_SECRET,
      callbackURL: configService.config.GITLAB_CALLBACK_URL
      // gitlab scopes?
      // scope: [
      //   'profile',
      //   'email',
      //   'api',
      //   'read_user',
      //   'read_repository',
      //   'write_repository'
      // ]
    });
  }

  async validate(
    accessToken: string,
    _refreshToken: string,
    profile: Profile
  ) {
    let user = await this.usersService.findOne(profile.username);

    if (!user) {
      user = await this.usersService.create({
        username: profile.username,
        avatar: profile.avatarUrl,
        email: profile.emails[0].value,
        integrations: [ {
          system: SystemEnum.GITLAB,
          systemUsername: profile.username,
          accessToken: accessToken,
          refreshToken: _refreshToken
        } ] as Integration[]
      });
    } else {
      await this.usersService.updateIntegrations(user.username, {
        system: SystemEnum.GITLAB,
        systemUsername: profile.username,
        accessToken: accessToken,
        refreshToken: _refreshToken
      });
    }

    if (!user) {
      // TODO Depending on the concrete implementation of findOrCreate(), throwing the
      // UnauthorizedException here might not make sense...
      throw new UnauthorizedException();
    }
    return user;
  }
}
