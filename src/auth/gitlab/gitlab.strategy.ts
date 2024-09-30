import { Profile, Strategy } from 'passport-gitlab2';

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import { configService } from '@kb-config';
import { Integration, SystemEnum, User, UserSettings } from '@kb-models';
import { UsersService } from '@kb-users';

@Injectable()
export class GitLabStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly usersService: UsersService
  ) {
    super({
      clientID: configService.config.GITLAB_CLIENT_ID,
      clientSecret: configService.config.GITLAB_CLIENT_SECRET,
      callbackURL: configService.config.GITLAB_CALLBACK_URL,
      /*
        Need the ability to read user profile information,
        read user projects, and read user email addresses
      */
      scope: 'api read_user read_repository email openid profile'
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
          systemAvatar: profile.avatarUrl,
          accessToken: accessToken,
          systemEmails: profile.emails.map((email) => email.value),
          refreshToken: _refreshToken
          // tokenExpiry: new Date()
        } ] as Integration[],
        settings: {
          theme: 'light',
          timezone: 'auto',
          avatarSystemOrigin: SystemEnum.GITHUB,
          dateFormat: 'MM/DD/YYYY'
        } as UserSettings
      } as User);
    } else {
      await this.usersService.updateIntegrations(user.username, {
        system: SystemEnum.GITLAB,
        systemUsername: profile.username,
        systemAvatar: profile.avatarUrl,
        accessToken: accessToken,
        refreshToken: _refreshToken,
        systemEmails: profile.emails.map((email) => email.value)
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
