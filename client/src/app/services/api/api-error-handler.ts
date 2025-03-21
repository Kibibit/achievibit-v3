import { AxiosError } from 'axios';
import { StatusCodes } from 'http-status-codes';
import { createSnackbar } from '@snackbar/core';

export class ApiErrorHandler {
  private static handleUnauthorized() {
    createSnackbar('Session expired. Please log in.');
    window.location.href = '/login';
  }

  private static handleForbidden() {
    // redirect to home page?
    createSnackbar('You are not authorized to do that.');
  }

  private static showSnackbar(message: string) {
    createSnackbar(message, { timeout: 5000 });
  }

  static handleError(error: AxiosError) {
    // Check for specific error statuses
    if (error.response) {
      const status = error.response.status;
      switch (status) {
        case StatusCodes.UNAUTHORIZED:
          ApiErrorHandler.handleUnauthorized();
          break;

        case StatusCodes.FORBIDDEN:
          ApiErrorHandler.handleForbidden();
          break;

        default:
          ApiErrorHandler.showSnackbar(`Unexpected error (status: ${ status })`);
          break;
      }
    }

    // Always reject so the caller can handle it if needed
    return Promise.reject(error);
  }
}
