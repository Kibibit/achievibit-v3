import * as jwt from 'jsonwebtoken';

import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import { configService } from '@kb-config';
import { UsersService } from '@kb-users';

@Injectable()
export class JwtAuthOptionalGuard implements CanActivate {
  constructor(private usersService: UsersService) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const kibibitJwtFromCookie = request.cookies['kibibit-jwt'];

      // get user details from jwt token by decoding it
      // and attach it to the request object
      const userFromJwt = jwt.verify(kibibitJwtFromCookie, configService.config.JWT_SECRET) as { username: string };

      const dbUser = await this.usersService.findOne(userFromJwt.username);

      request.user = dbUser;
      // If you want to allow the request even if auth fails, always return true
      return true;
    } catch (error) {
      // If you want to allow the request even if auth fails, always return true
      return true;
    }
  }
}
