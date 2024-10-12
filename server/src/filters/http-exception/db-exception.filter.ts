import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { QueryFailedError } from 'typeorm';

import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';

import { Logger } from '@kb-config';
import { User } from '@kb-models';

@Catch(QueryFailedError)
export class DbExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(DbExceptionFilter.name);
  catch(exception: QueryFailedError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    // const next = ctx.getNext<Request>();

    this.logger.error(exception, {
      sessionId: request.sessionID,
      username: (request.user as User)?.username
    });

    response
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        timestamp: new Date().toISOString(),
        message: 'Internal Server Error',
        sessionId: request.sessionID
      });
  }
}
