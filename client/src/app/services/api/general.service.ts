import { AxiosResponse } from 'axios';
import { Injectable } from '@angular/core';

import { Api, wrapWithProxy } from '@kibibit/achievibit-sdk';

import { ApiErrorHandler } from './api-error-handler';

@Injectable({
  providedIn: 'root'
})
export class GeneralApiService {
  private readonly generalSdk = new Api({});
  private readonly generalApiService = wrapWithProxy(this.generalSdk);

  constructor() {
    this.generalSdk.instance.interceptors.response.use(
      (response) => this.interceptResponse(response),
      (error) => ApiErrorHandler.handleError(error)
    );
  }

  getApiDetails() {
    return this
      .generalApiService
      .appControllerGetApiDetails();
  }

  private interceptResponse(response: AxiosResponse) {
    // createSnackbar('hello world', {
    //   timeout: 5000
    // });

    return response;
  }
}
