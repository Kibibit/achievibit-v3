import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import { configService } from '@kb-config';
import { UsersService } from '@kb-users';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly usersService: UsersService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        JwtStrategy.extractJWT,
        ExtractJwt.fromAuthHeaderAsBearerToken()
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.config.JWT_SECRET
    });
  }

  async validate(payload: any) {
    const dbUser = await this.usersService.findOne(payload.username);
    if (!dbUser) {
      throw new UnauthorizedException();
    }

    return dbUser;
  }

  private static extractJWT(req: Request): string | null {
    if (
      req.cookies &&
      'token' in req.cookies &&
      req.cookies.user_token.length > 0
    ) {
      return req.cookies.token;
    }
    return null;
  }
}
