
import { bgBlue, bgGreen, bgMagenta, bgRed } from 'colors';
import { NextFunction, Request, Response } from 'express';
import { isObject } from 'lodash';

import { Injectable, NestMiddleware } from '@nestjs/common';

import { Logger } from '@kb-config';
import { User } from '@kb-models';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('REQUEST');
  use(req: Request, res: Response, next: NextFunction) {
    const meta: Record<string, any> = {
      // context: 'REQUEST: ' + req.method
      // context: 'REQUEST: ' + this.methodColor(req.method)
      // client: this.requestIp(req)
      context: `REQUEST: ${ this.requestIp(req).replace('::1', 'localhost') }`,
      sessionId: req.sessionID,
      username: (req.user as User)?.username
    };
    if (isObject(req.body) && Object.keys(req.body).length) {
      meta.body = req.body;
    }
    this.logger.verbose(
      [
        this.methodColor(req.method),
        ' ',
        `${ req.originalUrl }`
      ].join(''),
      meta
    );

    // Ends middleware function execution, hence allowing to move on
    if (next) {
      next();
    }
  }

  private methodColor(method: string) {
    switch (method) {
      case 'GET':
        return bgGreen.black.bold(' GET ');
      case 'POST':
        return bgBlue.black.bold(' POST ');
      case 'PUT':
        return bgMagenta.white.bold(' PUT ');
      case 'PATCH':
        return bgMagenta.white.bold(' PATCH ');
      case 'DELETE':
        return bgRed.white.bold(' DELETE ');
      default:
        return bgGreen.black.bold(` ${ method } `);
    }
  }

  private requestIp(req: Request) {
    return (req.headers['x-forwarded-for'] ||
      req.socket.remoteAddress ||
      req.ip) as string;
  }
}
