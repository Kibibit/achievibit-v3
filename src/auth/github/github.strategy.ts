import { Profile, Strategy } from 'passport-github2';

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import { configService } from '@kb-config';
import { Integration, SystemEnum, User, UserSettings } from '@kb-models';
import { UsersService } from '@kb-users';

@Injectable()
export class GitHubStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly usersService: UsersService
  ) {
    super({
      clientID: configService.config.GITHUB_CLIENT_ID,
      clientSecret: configService.config.GITHUB_CLIENT_SECRET,
      callbackURL: configService.config.GITHUB_CALLBACK_URL,
      scope: [
        'public_profile',
        'user',
        'read:packages',
        'read:project',
        'read:org',
        'repo'
      ]
    });
  }

  async validate(
    accessToken: string,
    _refreshToken: string,
    profile: Profile
  ) {
    // For each strategy, Passport will call the verify function (implemented with this
    // `validate()` method in @nestjs/passport) using an appropriate strategy-specific set of
    // parameters. For the passport-github strategy Passport expects a `validate()` method with
    // the following signature:
    //   `validate(accessToken: string, refreshToken: string, profile: Profile): any`
    // As you can see from this, `validate()` receives the access token and optional refresh
    // token, as well as profile which contains the authenticated user's GitHub profile.
    // We can pass these information to find or create the user in our system.
    // The Passport library expects this method to return a full user if the validation
    // succeeds, or a null if it fails. When returning a user, Passport will complete its tasks
    // (e.g., creating the user property on the Request object), and the request
    // handling pipeline can continue.

    let user = await this.usersService.findOne(profile.username);

    if (!user) {
      user = await this.usersService.create({
        username: profile.username,
        avatar: profile.photos[0].value,
        email: profile.emails[0].value,
        integrations: [ {
          system: SystemEnum.GITHUB,
          systemUsername: profile.username,
          systemAvatar: profile.photos[0].value,
          accessToken: accessToken,
          refreshToken: _refreshToken,
          systemEmails: profile.emails.map((email) => email.value)
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
        system: SystemEnum.GITHUB,
        systemUsername: profile.username,
        systemAvatar: profile.photos[0].value,
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
