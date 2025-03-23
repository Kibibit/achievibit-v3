import { AxiosResponse } from 'axios';
import { Injectable } from '@angular/core';

import {
  ICachableService,
  ICacheMap,
  Repositories,
  RepositoriesControllerGetReposParamsOrderEnum as OrderEnum,
  wrapWithProxy } from '@kibibit/achievibit-sdk';

import { ApiErrorHandler } from './api-error-handler';

@Injectable({
  providedIn: 'root'
})
export class RepositoriesApiService implements ICachableService {
  private readonly reposSdk = new Repositories({});

  private readonly reposApiService = wrapWithProxy(this.reposSdk);

  cacheMap: ICacheMap = {};

  constructor() {
    this.reposSdk.instance.interceptors.response.use(
      (response) => this.interceptResponse(response),
      (error) => ApiErrorHandler.handleError(error)
    );
  }

  getAllRepos(query?: { query?: string; order?: OrderEnum; page?: number; take?: number }) {
    return this
      .reposApiService
      .repositoriesControllerGetRepos({
        order: query?.order || OrderEnum.ASC,
        page: query?.page || 1,
        take: query?.take || 10,
        query: query?.query
      });
  }

  private interceptResponse(response: AxiosResponse) {
    // createSnackbar('hello world', {
    //   timeout: 5000
    // });

    return response;
  }
}
