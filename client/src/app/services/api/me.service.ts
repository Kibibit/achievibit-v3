import { AxiosResponse } from 'axios';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

import { Cacheable, ICachableService, ICacheMap, SessionUser, User, wrapWithProxy } from '@kibibit/achievibit-sdk';

import { ApiErrorHandler } from './api-error-handler';

@Injectable({
  providedIn: 'root'
})
export class MeApiService implements ICachableService {
  private readonly meSdk = new SessionUser({});
  private readonly noFailureSdk = new SessionUser({});

  private readonly meApiService = wrapWithProxy(this.meSdk);
  private readonly noFailureApiService = wrapWithProxy(this.noFailureSdk);

  cacheMap: ICacheMap = {};

  constructor() {
    this.meSdk.instance.interceptors.response.use(
      (response) => this.interceptResponse(response),
      (error) => ApiErrorHandler.handleError(error)
    );
  }

  @Cacheable({ emitOnce: false })
  getLoggedInUser(options?: { emitOnce?: boolean }) {
    return this
      .meApiService
      .sessionUserControllerGetSessionUser();
  }

  checkUserLoggedIn() {
    return this
      .noFailureApiService
      .sessionUserControllerGetSessionUser() as Observable<User>;
  }

  clearLoggedInUserCache() {
    const cacheMapKey = 'getLoggedInUser';
    this.cacheMap[cacheMapKey].subject.next(null);
  }

  logout() {
    return this
      .meApiService
      .sessionUserControllerLogout();
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
