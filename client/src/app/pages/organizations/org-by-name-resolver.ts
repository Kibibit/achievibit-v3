import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';

import { Organization } from '@kibibit/achievibit-sdk';

import { OrganizationsApiService } from '../../services/api/organizations.service';

export const orgByNameResolver: ResolveFn<Organization> = (route) => {
  const orgsApiService = inject(OrganizationsApiService);
  const name = route.paramMap.get('name') as string;

  return orgsApiService.getOrganizationByName(name);
};
