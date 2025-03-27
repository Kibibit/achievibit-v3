import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';

import { User } from '@kibibit/achievibit-sdk';

import { AuthService } from '../../services/auth.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const requiredRoles = (route.data as User).roles;

  const hasAccess = requiredRoles.some((requiredRole) => authService.hasRole(requiredRole));

  if (!hasAccess) {
    // show 404 page eventually
    window.location.href = '/login';
  }

  return hasAccess;
};
