import * as jwt from 'jsonwebtoken';

import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { configService } from '@kb-config';

// Custom decorator to fetch req.user and pass it to the controller method
export const ReqUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    if (request.user) {
      return request.user;
    }

    const kibibitJwtFromCookie = request.cookies['kibibit-jwt'];

    if (!kibibitJwtFromCookie) {
      return null;
    }

    try {
      // get user details from jwt token by decoding it
      // and attach it to the request object
      const userFromJwt = jwt.verify(kibibitJwtFromCookie, configService.config.JWT_SECRET);

      return userFromJwt;
    } catch (error) {
      return null;
    }
  }
);
