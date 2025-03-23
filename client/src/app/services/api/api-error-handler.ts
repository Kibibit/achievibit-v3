import { AxiosError } from 'axios';
import { StatusCodes } from 'http-status-codes';
import { createSnackbar } from '@snackbar/core';

/**
 * Validation error description.
 */
export class ValidationError {
  /**
   * Object that was validated.
   *
   * OPTIONAL - configurable via the ValidatorOptions.validationError.target option
   */
  target?: object;
  /**
   * Object's property that haven't pass validation.
   */
  property: string;
  /**
   * Value that haven't pass a validation.
   *
   * OPTIONAL - configurable via the ValidatorOptions.validationError.value option
   */
  value?: any;
  /**
   * Constraints that failed validation with error messages.
   */
  constraints?: {
      [type: string]: string;
  };
  /**
   * Contains all nested validation errors of the property.
   */
  children?: ValidationError[];
  contexts?: {
      [type: string]: any;
  };
}


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

  private static handleValidationError(errors: ValidationError) {
    ApiErrorHandler.showSnackbar(`Unexpected error (status: ${ errors })`);
  }

  static handleError(error: AxiosError) {
    // Check for specific error statuses
    if (error.response) {
      const status = error.response.status;
      switch (status) {
        case StatusCodes.BAD_REQUEST:
          ApiErrorHandler.handleValidationError(error.response.data as ValidationError);
          break;
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
