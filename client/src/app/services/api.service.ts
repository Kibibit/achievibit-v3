import { AxiosError, AxiosResponse } from 'axios';
import { StatusCodes } from 'http-status-codes';
import { combineLatest, map, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { createSnackbar } from '@snackbar/core';

import { Api, Cacheable, Health, ICachableService, ICacheMap, ReturnDataOnError, SessionUser, wrapWithProxy } from '@kibibit/achievibit-sdk';

export interface IHealthCheckResult {
  status: 'ok' | 'error';
  info?: Record<string, any>;
  error?: Record<string, any>;
  details?: Record<string, any>;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService implements ICachableService {
  private readonly sdks = {
    general: new Api({}),
    me: new SessionUser({})
  };

  private readonly nonPublicErrorsSdks = {
    health: new Health({})
  };

  private readonly meApiService = wrapWithProxy(this.sdks.me);
  private readonly healthApiService = wrapWithProxy(this.nonPublicErrorsSdks.health);
  private readonly generalApiService = wrapWithProxy(this.sdks.general);

  cacheMap: ICacheMap = {};

  constructor(
    private readonly router: Router
  ) {
    for (const sdkName of Object.keys(this.sdks)) {
      const sdk = this.sdks[sdkName as keyof typeof this.sdks];

      sdk.instance.interceptors.response.use(
        (response) => this.interceptResponse(response),
        (error) => this.handleError(error)
      );
    }
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

  getApiDetails() {
    return this
      .generalApiService
      .appControllerGetApiDetails();
  }

  healthCheck() {
    return combineLatest([
      this.healthCheckApp(),
      this.healthCheckExternalApi(),
      this.healthCheckDevTools()
    ])
      .pipe(
        map(([ appHealth, externalApiHealth, devToolsHealth ]) => {
          return {
            app: appHealth,
            externalApi: externalApiHealth,
            devTools: devToolsHealth
          };
        })
      );
  }

  @ReturnDataOnError()
  healthCheckApp() {
    return this
      .healthApiService
      .healthControllerCheck() as Observable<IHealthCheckResult | null>;
  }

  @ReturnDataOnError()
  healthCheckExternalApi() {
    return this
      .healthApiService
      .healthControllerCheckExternalApi() as Observable<IHealthCheckResult | null>;
  }

  @ReturnDataOnError()
  healthCheckDevTools() {
    return this
      .healthApiService
      .healthControllerCheckDevTools() as Observable<IHealthCheckResult | null>;
  }

  private interceptResponse(response: AxiosResponse) {
    // createSnackbar('hello world', {
    //   timeout: 5000
    // });

    return response;
  }

  private handleUnauthorized() {
    createSnackbar('Session expired. Please log in.');
    window.location.href = '/login';
  }

  private handleForbidden() {
    // redirect to home page?
    createSnackbar('You are not authorized to do that.');
  }

  private showSnackbar(message: string) {
    createSnackbar(message, { timeout: 5000 });
  }

  private handleError(error: AxiosError) {
    // Check for specific error statuses
    if (error.response) {
      const status = error.response.status;
      switch (status) {
        // case StatusCodes.SERVICE_UNAVAILABLE:
        //   break;
        case StatusCodes.UNAUTHORIZED:
          this.handleUnauthorized();
          break;

        case StatusCodes.FORBIDDEN:
          this.handleForbidden();
          break;

        default:
          this.showSnackbar(`Unexpected error (status: ${ status })`);
          break;
      }
    }

    // Always reject so the caller can handle it if needed
    return Promise.reject(error);
  }
}
