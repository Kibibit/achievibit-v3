import { combineLatest, map, Observable } from 'rxjs';
import { Injectable } from '@angular/core';

import { Health, ReturnDataOnError, wrapWithProxy } from '@kibibit/achievibit-sdk';

export interface IHealthCheckResult {
  status: 'ok' | 'error';
  info?: Record<string, any>;
  error?: Record<string, any>;
  details?: Record<string, any>;
}

@Injectable({
  providedIn: 'root'
})
export class HealthApiService {
  private readonly healthSdk = new Health({});
  private readonly healthApiService = wrapWithProxy(this.healthSdk);

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
}
