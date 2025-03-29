import { Profile, Strategy } from 'passport-bitbucket-oauth2';

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import { configService } from '@kb-config';
import { Integration, SystemEnum, User, UserSettings } from '@kb-models';
import { UsersService } from '@kb-users';

@Injectable()
export class BitBucketStrategy extends PassportStrategy(Strategy) {
  static readonly SCOPES = [
    'account',
    'email'
  ];

  constructor(
    private readonly usersService: UsersService
  ) {
    super({
      clientID: configService.config.BITBUCKET_CLIENT_ID,
      clientSecret: configService.config.BITBUCKET_CLIENT_SECRET,
      callbackURL: configService.config.BITBUCKET_CALLBACK_URL,
      // bitbucket scopes?
      scope: BitBucketStrategy.SCOPES
    });
  }

  async validate(
    accessToken: string,
    _refreshToken: string,
    profile: Profile
  ) {
    let user = await this.usersService.findOne(profile.username);

    const emails = await this.getBitbucketEmails(accessToken);

    if (!user) {
      user = await this.usersService.create({
        username: profile.username,
        avatar: profile._json.links.avatar.href,
        email: emails.primary,
        integrations: [ {
          system: SystemEnum.BITBUCKET,
          systemUsername: profile.username,
          systemAvatar: profile._json.links.avatar.href,
          accessToken: accessToken,
          refreshToken: _refreshToken,
          systemEmails: emails.all
        } ] as Integration[],
        settings: {
          avatarSystemOrigin: SystemEnum.BITBUCKET,
        } as UserSettings
      } as User);
    } else {
      await this.usersService.updateIntegrations(user.username, {
        system: SystemEnum.BITBUCKET,
        systemUsername: profile.username,
        systemAvatar: profile._json.links.avatar.href,
        accessToken: accessToken,
        refreshToken: _refreshToken,
        systemEmails: emails.all
      });
    }

    if (!user) {
      // TODO Depending on the concrete implementation of findOrCreate(), throwing the
      // UnauthorizedException here might not make sense...
      throw new UnauthorizedException();
    }
    return user;
  }

  private async getBitbucketEmails(accessToken: string) {
    const emailResponse = await fetch('https://api.bitbucket.org/2.0/user/emails', {
      headers: {
        Authorization: `Bearer ${ accessToken }`,
        'Content-Type': 'application/json'
      }
    });

    const emailData = await emailResponse.json();

    return {
      primary: emailData.values.find((email: any) => email.is_primary).email,
      all: emailData.values.map((email: any) => email.email)
    };
  }
}
