import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { omit } from 'lodash';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
) {}

  async githubLogin(user: any) {
    const userProfile = user.profile;
    const payload = {
      ...omit(userProfile, [
        '_json',
        '_raw'
      ]),
      system: userProfile.provider
    };

    await this.usersService.updateAccessToken(userProfile.username, user.accessToken);

    return {
        accessToken: this.jwtService.sign(payload),
    };
}

  async validateGitHubUser(username: string, system: string) {
    const user = await this.usersService.findOne(username);
    
    if (user && user.provider === system) {
      return user;
    }

    return null;
  }
}