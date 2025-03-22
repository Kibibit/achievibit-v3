import { AxiosError } from 'axios';
import { catchError, Observable, of } from 'rxjs';

interface IReturnDataOnErrorOptions {
  allowedStatusCodes?: number[];
}

/**
 * Decorator that returns the response data on error.
 * useful for APIs that return an error object with a status code and a message,
 * or luxon health check APIs that return an error status code with the health check result.
 */
export function ReturnDataOnError<T>(options: IReturnDataOnErrorOptions = {}) {
  return function(
    target: any,
    propertyKey: string,
    descriptor: TypedPropertyDescriptor<(...args: any[]) => Observable<T | null>>
  ) {
    const originalMethod = descriptor.value;
    if (!originalMethod) {
      throw new Error('@ReturnDataOnError can only be used on methods that return an Observable');
    }

    descriptor.value = function(...args: any[]): Observable<T | null> {
      // add validateStatus: null to skip status code validation to skip error handling
      // in the last argument of the method
      const lastArg = args[args.length - 1];
      if (typeof lastArg === 'object' && lastArg !== null) {
        lastArg.validateStatus = null;
      } else {
        args.push({ validateStatus: null });
      }

      return originalMethod.apply(this, args)
        .pipe(
          catchError((error: AxiosError<T>) => {
            if (error.response?.data && Object.keys(error.response.data).length) {
              return of(error.response.data);
            }

            return of(null);
          })
        );
    };
  };
}
