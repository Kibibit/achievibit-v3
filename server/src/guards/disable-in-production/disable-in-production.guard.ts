import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { configService } from '@kb-config';

@Injectable()
export class DisableInProductionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const disableInProduction = this.reflector.get<boolean>('disableInProduction', context.getHandler());

    // If the decorator is not present, allow the request
    if (!disableInProduction) {
      return true;
    }

    // Check if the environment is production
    if (configService.config.NODE_ENV === 'production') {
      // TODO(@thatkookooguy): potential for an achievement for finding this
      // Look, mom, I'm a hacker!
      throw new ForbiddenException('This endpoint is disabled in production');
    }

    // Allow the request if not in production
    return true;
  }
}
