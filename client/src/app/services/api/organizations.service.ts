import { AxiosResponse } from 'axios';
import { Injectable } from '@angular/core';

import {
  ICachableService,
  ICacheMap,
  Organizations,
  OrganizationsControllerGetOrganizationsParamsOrderEnum as OrderEnum,
  wrapWithProxy } from '@kibibit/achievibit-sdk';

import { ApiErrorHandler } from './api-error-handler';

@Injectable({
  providedIn: 'root'
})
export class OrganizationsApiService implements ICachableService {
  private readonly orgsSdk = new Organizations({});

  private readonly orgsApiService = wrapWithProxy(this.orgsSdk);

  cacheMap: ICacheMap = {};

  constructor() {
    this.orgsSdk.instance.interceptors.response.use(
      (response) => this.interceptResponse(response),
      (error) => ApiErrorHandler.handleError(error)
    );
  }

  getOrganizationByName(name: string) {
    return this
      .orgsApiService
      .organizationsControllerGetOrganization(name);
  }

  getAllOrgs(query?: { query: string; order?: OrderEnum; page?: number; take?: number }) {
    return this
      .orgsApiService
      .organizationsControllerGetOrganizations({
        query: query?.query || '',
        order: query?.order || OrderEnum.ASC,
        page: query?.page || 1,
        take: query?.take || 10
      });
  }

  private interceptResponse(response: AxiosResponse) {
    // createSnackbar('hello world', {
    //   timeout: 5000
    // });

    return response;
  }
}
