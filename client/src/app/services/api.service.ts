import { AxiosError, AxiosResponse } from 'axios';
import { StatusCodes } from 'http-status-codes';
import { from } from 'rxjs';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { createSnackbar } from '@snackbar/core';

import { Api } from '@kibibit/achievibit-sdk';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly apiService = new Api({});

  constructor(
    private readonly router: Router
  ) {
    this.apiService.instance.interceptors.response.use(
      (response) => this.interceptResponse(response),
      (error) => this.handleError(error)
    );
  }

  getApiDetails() {
    return from(this.apiService.appControllerGetApiDetails());
  }

  private interceptResponse(response: AxiosResponse) {
    // createSnackbar('hello world', {
    //   timeout: 5000
    // });

    return response;
  }

  private handleUnauthorized() {
    createSnackbar('Session expired. Please log in.');
    this.router.navigate([ '/login' ]);
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
