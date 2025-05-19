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
  property!: string;
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

export class ServerValidationError extends Error {
  constructor(public errors: ValidationError[]) {
    super('Validation error');
  }
}


export class ApiErrorHandler {
  private static handleUnauthorized() {
    // createSnackbar('Session expired. Please log in.');
    // window.location.href = '/login';

    return Promise.reject(new Error('Session expired'));
  }

  private static handleForbidden() {
    // redirect to home page?
    createSnackbar('You are not authorized to do that.');
  }

  private static showSnackbar(message: string) {
    createSnackbar(message, { timeout: 5000 });
  }

  private static handleValidationError(errors: ValidationError[]) {
    // Show the first error message
    const error = errors[0];
    const message = Object.values(error.constraints as object)[0];
    // this.showSnackbar(message);
  }

  static handleError(error: AxiosError<any>) {
    // Check for specific error statuses
    if (error.response) {
      const status = error.response.status;
      switch (status) {
        case StatusCodes.BAD_REQUEST: ;
          const errors = error.response.data?.message;
          if (errors) {
            this.handleValidationError(errors);
            const validationError = new ServerValidationError(errors);

            return Promise.reject(validationError);
          }
          break;
        case StatusCodes.UNAUTHORIZED:
          return ApiErrorHandler.handleUnauthorized();

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
