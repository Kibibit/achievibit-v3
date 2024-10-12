import { Request } from 'express';

import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';

import { configService } from '@kb-config';

@Injectable()
export class GitLabWebhookGuard implements CanActivate {
  private readonly secret = configService.config.GITLAB_WEBHOOK_SECRET;

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const token = request.headers['x-gitlab-token'] as string;

    if (!token || token !== this.secret) {
      throw new UnauthorizedException('Invalid token');
    }

    return true;
  }
}
