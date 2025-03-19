import { AxiosError, AxiosResponse } from 'axios';
import { StatusCodes } from 'http-status-codes';
import { catchError, combineLatest, from, map, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { createSnackbar } from '@snackbar/core';

import { Api } from '@kibibit/achievibit-sdk';

import { Cacheable, ICachableService, ICacheMap } from '../decorators/cachable.decorator';

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
  private readonly apiService = new Api({});

  cacheMap: ICacheMap = {};

  constructor(
    private readonly router: Router
  ) {
    this.apiService.instance.interceptors.response.use(
      (response) => this.interceptResponse(response),
      (error) => this.handleError(error)
    );
  }

  @Cacheable({ emitOnce: true })
  getLoggedInUser(options?: { emitOnce?: boolean }) {
    return from(this.apiService.me.sessionUserControllerGetSessionUser())
      .pipe(map((response) => response.data));
  }

  clearLoggedInUserCache() {
    const cacheMapKey = 'getLoggedInUser';
    this.cacheMap[cacheMapKey].subject.next(null);
  }

  getApiDetails() {
    return from(this.apiService.appControllerGetApiDetails())
      .pipe(map((response) => response.data));
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

  healthCheckApp() {
    return this.genericHealthCheck('healthControllerCheck');
  }

  healthCheckExternalApi() {
    return this.genericHealthCheck('healthControllerCheckExternalApi');
  }

  healthCheckDevTools() {
    return this.genericHealthCheck('healthControllerCheckDevTools');
  }

  private genericHealthCheck(healthCheckMethodName: keyof Api<unknown>['health']) {
    return from(this.apiService.health[healthCheckMethodName]({
      // skip status code validation to skip error handling
      validateStatus: null
    }))
      .pipe(
        map((response) => response.data as IHealthCheckResult),
        catchError((error: AxiosError<IHealthCheckResult>) => {
          if (error.response?.data?.status) {
            // cast type to the same type as the response data
            return of(error.response.data as IHealthCheckResult);
          }

          const healthCheckErrorResult: IHealthCheckResult = {
            status: 'error',
            error: {
              message: error.message
            }
          };

          return of(healthCheckErrorResult);
        })
      );
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
