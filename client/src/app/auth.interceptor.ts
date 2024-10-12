import { catchError, tap } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const document: Document = inject(DOCUMENT);
  return next(req).pipe(
    tap((httpEvent) => {
      // Checks if the HttpEvent is a successful (200 OK) HttpResponse,
      // but has an invalid response body format.
      // if (checkInvalid200Response(httpEvent)) {
      //   // Throws a custom HttpResponseBodyFormatError to signal the invalid response format.
      //   // This error will be caught and handled by the subsequent catchError operator,
      //   // which will display the appropriate error message to the user.
      //   throw new HttpResponseBodyFormatError();
      // }
    }),
    catchError((error) => {
      // let errorMessage: string;

      // Handle network connection errors specifically
      // if (checkNoNetworkConnection(error)) {
      //   // Set specific message for network errors
      //   errorMessage = MESSAGES.NO_CONNECTION;

      //   // Create a custom network error object
      //   error = new HttpNoNetworkConnectionError();

      //   // Mark the error as caught to prevent duplicate handling
      //   error.wasCaught = true;
      // }
      // else if (is400ResponseError(error)) {
      //   // Explicitly skip handling 400 errors here (handled by tapValidationErrors operator)
      //   // This ensures that validation errors are handled in the component,
      //   // while other errors (e.g., 5xx, 4xx) fall through to the next case.
      //   errorMessage = '';
      // }
      // else {
      //   // For all other server errors or unexpected errors, display a generic error message.
      //   errorMessage = MESSAGES.INTERNAL_ERROR
      // }

      // // Show a Snackbar notification if an error message is available.
      // if (errorMessage) {
      //   snackbar.open(errorMessage);
      // }

      if (checkUnauthorizedResponse(error)) {
        // redirect to login page
        document.location.href = '/login';
      }

      // Re-throw the error for handling in the component or a global error handler.
      throw error;
    })
  );
};

function checkUnauthorizedResponse(error: any) {
  return error instanceof HttpErrorResponse && error.status === 401;
}
