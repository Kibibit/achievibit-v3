import { AxiosResponse } from 'axios';
import { map } from 'rxjs';
import { Injectable } from '@angular/core';

import { Cacheable, ICachableService, ICacheMap, SessionUser, wrapWithProxy } from '@kibibit/achievibit-sdk';

import { ApiErrorHandler } from './api-error-handler';

@Injectable({
  providedIn: 'root'
})
export class MeApiService implements ICachableService {
  private readonly meSdk = new SessionUser({});

  private readonly meApiService = wrapWithProxy(this.meSdk);

  cacheMap: ICacheMap = {};

  constructor() {
    this.meSdk.instance.interceptors.response.use(
      (response) => this.interceptResponse(response),
      (error) => ApiErrorHandler.handleError(error)
    );
  }

  @Cacheable({ emitOnce: true })
  getLoggedInUser(options?: { emitOnce?: boolean }) {
    return this
      .meApiService
      .sessionUserControllerGetSessionUser()
      .pipe((map((test) => {
        console.log('test', test);

        return test;
      })));
  }

  clearLoggedInUserCache() {
    const cacheMapKey = 'getLoggedInUser';
    this.cacheMap[cacheMapKey].subject.next(null);
  }

  getAvailableRepositories(system: 'github' | 'gitlab' | 'bitbucket') {
    return this
      .meApiService
      .sessionUserControllerGetSessionUserAvailableRepositories(system);
  }

  installWebhookOnRepo(repoFullName: string, system: 'github' | 'gitlab' | 'bitbucket') {
    return this
      .meApiService
      .sessionUserControllerInstallWebhookOnRepo(system, repoFullName);
  }

  uninstallWebhookOnRepo(repoFullName: string, system: 'github' | 'gitlab' | 'bitbucket') {
    return this
      .meApiService
      .sessionUserControllerUninstallWebhookOnRepo(system, repoFullName);
  }

  private interceptResponse(response: AxiosResponse) {
    // createSnackbar('hello world', {
    //   timeout: 5000
    // });

    return response;
  }
}
