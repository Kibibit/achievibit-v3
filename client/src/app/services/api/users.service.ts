import { AxiosResponse } from 'axios';
import { Injectable } from '@angular/core';

import {
  ICachableService,
  ICacheMap,
  Users,
  UsersControllerGetUsersParamsOrderEnum as OrderEnum,
  wrapWithProxy } from '@kibibit/achievibit-sdk';

import { ApiErrorHandler } from './api-error-handler';

@Injectable({
  providedIn: 'root'
})
export class UsersApiService implements ICachableService {
  private readonly usersSdk = new Users({});

  private readonly usersApiService = wrapWithProxy(this.usersSdk);

  cacheMap: ICacheMap = {};

  constructor() {
    this.usersSdk.instance.interceptors.response.use(
      (response) => this.interceptResponse(response),
      (error) => ApiErrorHandler.handleError(error)
    );
  }

  getUserByUsername(username: string) {
    return this
      .usersApiService
      .usersControllerGetUser(username);
  }

  getAllUsers(query?: { query?: string; order?: OrderEnum; page?: number; take?: number }) {
    return this
      .usersApiService
      .usersControllerGetUsers({
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
