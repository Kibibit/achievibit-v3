import { instanceToPlain } from 'class-transformer';
import { SystemEnum } from 'src/models/Integration.entity';

import { Injectable } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';

import { User } from '@kb-models';
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
      accessToken: this.nestJwtService.sign(sanitizedUser)
    };
  }

  async validateOauthUser(username: string, system: SystemEnum = SystemEnum.GITHUB) {
    const user = await this.usersService.findOneByIntegration(username, system);

    return user;
  }
}
