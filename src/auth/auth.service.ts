import { instanceToPlain } from 'class-transformer';
import { SystemEnum } from 'src/models/Integration.entity';

import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { User } from '@kb-models';

import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async githubLogin(user: User) {
    const userGitHubIntegration = user.integrations
      .find((integration) => integration.system === SystemEnum.GITHUB);

    await this.usersService.updateAccessToken(user.username, userGitHubIntegration.accessToken);

    const sanitizedUser = instanceToPlain(new User(user));

    return {
      accessToken: this.jwtService.sign(sanitizedUser)
    };
  }

  async validateGitHubUser(username: string) {
    const user = await this.usersService.findOneByIntegration(username, SystemEnum.GITHUB);

    return user;
  }
}
