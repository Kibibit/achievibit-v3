import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { configService } from '@kb-config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly usersService: UsersService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.config.JWT_SECRET
    });
  }

  async validate(payload: any) {
    const accessToken = await this.usersService.getAccessToken(payload.username);
    if (!accessToken) {
      throw new UnauthorizedException('Invalid GitHub access token');
    }

    return {
      ...payload,
      accessToken
    };
  }
}