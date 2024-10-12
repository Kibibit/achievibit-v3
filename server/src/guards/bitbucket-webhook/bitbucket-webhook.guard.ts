import * as crypto from 'crypto';

import { Request } from 'express';

import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';

import { configService } from '@kb-config';

@Injectable()
export class BitbucketWebhookGuard implements CanActivate {
  private readonly secret = configService.config.BITBUCKET_WEBHOOK_SECRET;

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const signature = request.headers['x-hub-signature'] as string;

    if (!signature) {
      throw new UnauthorizedException('No signature provided');
    }

    const body = JSON.stringify(request.body);
    const hmac = crypto.createHmac('sha256', this.secret);
    const digest = hmac.update(body).digest('hex');

    if (digest !== signature) {
      throw new UnauthorizedException('Invalid signature');
    }

    return true;
  }
}
