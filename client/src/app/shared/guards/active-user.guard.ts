import { lastValueFrom } from 'rxjs';
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { MeApiService } from '../../services/api/me.service';

export const activeUserGuard: CanActivateFn = (route, state) => {
  const meApiService = inject(MeApiService);
  const router = inject(Router);

  return lastValueFrom(meApiService
    .getLoggedInUser())
    .then((user) => {
      if (!user) {
        return router.navigateByUrl('/login');
      }
      return true;
    })
    .catch(() => router.navigateByUrl('/login'));
};
