import { instanceToPlain } from 'class-transformer';

import { Injectable } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';

import { configService } from '@kb-config';
import { SystemEnum, User } from '@kb-models';
import { UsersService } from '@kb-users';

@Injectable()
export class JwtService {
  constructor(
    private usersService: UsersService,
    private nestJwtService: NestJwtService
  ) {}

  generateAccessToken(user: User) {
    const sanitizedUser = instanceToPlain(new User(user));

    return {
      accessToken: this.nestJwtService.sign(sanitizedUser, {
        secret: configService.config.JWT_SECRET
      })
    };
  }

  async validateOauthUser(username: string, system: SystemEnum = SystemEnum.GITHUB) {
    const user = await this.usersService.findOneByIntegration(username, system);

    return user;
  }
}
