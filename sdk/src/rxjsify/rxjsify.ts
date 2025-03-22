import { AxiosError, AxiosResponse } from 'axios';
import { from, map, Observable } from 'rxjs';

// wrap AxiosError<T> in sdk error to hide internal implementation details from the client
export class AchievibitSdkError<T> extends AxiosError<T> {}

export type PromisifyToObservable<T> =
  T extends (...args: infer A) => Promise<infer R>
    ? R extends AxiosResponse<infer D>
      ? (...args: A) => Observable<D>
      : (...args: A) => Observable<R>
    // non-promise-returning functions remain untouched
    : T extends (...args: any[]) => any
      ? T
      : T extends object
        ? Proxify<T>
        : T;

export type Proxify<T> = {
  [K in keyof T]: PromisifyToObservable<T[K]>;
};

export function wrapWithProxy<T extends object>(obj: T): Proxify<T> {
  return new Proxy(obj, {
    get(target, prop, receiver) {
      const value = Reflect.get(target, prop, receiver);

      /* ************************************************** */
      /* for functions, return a function that wraps the    */
      /* result with an observable if the result is a       */
      /* promise.                                           */
      /* ************************************************** */
      if (typeof value === 'function') {
        return (...args: any[]) => {
          const result = value.apply(target, args);
          return result instanceof Promise ?
            from(result)
              .pipe(
                map((response) => response.data)
              ) :
            result;
        };
      /* ************************************************** */
      /* for nested objects, wrap them with a proxy as well */
      /* ************************************************** */
      } else if (value && typeof value === 'object') {
        return wrapWithProxy(value);
      }

      /* ************************************************** */
      /* for non-function, non-object values, return as is  */
      /* ************************************************** */
      return value;
    }
  }) as Proxify<T>;
}

// TODO: how to integrate this with the above code?
// I want to integrate this, emitOnce, and cacheDurationMs,
// and still keep all the types correct with as little type casting as possible
// export function returnResponseDataOnError<T>(
//   apiMethod: (...args: any[]) => Promise<AxiosResponse<T>>,
//   options?: {
//     allowedStatusCodes?: number[];
//     onDatalessError?: (error: AxiosError<T>) => Observable<T | AxiosError<T>>;
//   }
// ) {
//   // const apiMethod = get(this.apiService, apiMethodPath) as (...args: any[]) => Promise<AxiosResponse<T>>;

//   return from(apiMethod({
//     // skip status code validation to skip error handling
//     validateStatus: null
//   }))
//     .pipe(
//       map((response) => response.data),
//       catchError((error: AchievibitSdkError<T>) => {
//         if (error.response?.data && Object.keys(error.response.data).length) {
//           return of(error.response.data);
//         }

//         return options?.onDatalessError?.(error) ?? of(error);
//       })
//     );
// }
