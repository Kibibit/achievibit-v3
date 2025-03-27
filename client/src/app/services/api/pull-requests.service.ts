import { Axios, AxiosResponse } from 'axios';
import { map, Observable } from 'rxjs';
import { Injectable } from '@angular/core';

import {
  ICachableService,
  ICacheMap,
  RepositoriesControllerGetReposParamsOrderEnum as OrderEnum, wrapWithProxy } from '@kibibit/achievibit-sdk';

import { ApiErrorHandler } from './api-error-handler';

export class PullRequest {
  id?: string;
  title?: string;
  body?: string;
  state?: string;
  createdAt?: string;
  updatedAt?: string;
  closedAt?: string;
  mergedAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PullRequestsApiService implements ICachableService {
  private readonly prsSdk = new Axios({
    baseURL: `${ window.location.origin }/api/prs`,
    transformResponse: (res) => JSON.parse(res),
    responseType: 'json'
  });

  private readonly prsApiService = wrapWithProxy(this.prsSdk);

  cacheMap: ICacheMap = {};

  constructor() {
    this.prsSdk.interceptors.response.use(
      (response) => this.interceptResponse(response),
      (error) => ApiErrorHandler.handleError(error)
    );
  }

  getPullRequestById(id: string) {
    return this
      .prsApiService
      .get(id)
      .pipe(
        map((response) => (response as AxiosResponse).data)
      ) as Observable<PullRequest>;
  }

  getAllPrs(query?: { query?: string; order?: OrderEnum; page?: number; take?: number }) {
    return this
      .prsApiService
      .get('', {
        params: {
          order: query?.order || OrderEnum.ASC,
          page: query?.page || 1,
          take: query?.take || 10,
          query: query?.query
        }
      }) as Observable<{ data: PullRequest[]; meta: { hasNextPage: boolean; hasPreviousPage: boolean; itemCount: number; page: number; pageCount: number; take: number } }>;
  }

  private interceptResponse(response: AxiosResponse) {
    // createSnackbar('hello world', {
    //   timeout: 5000
    // });

    return response;
  }
}
