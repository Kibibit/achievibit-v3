import { from, Observable } from 'rxjs';

export type WrappedSDK<T> = {
  [K in keyof T]: T[K] extends (...args: infer A) => Promise<infer R>
  // Convert Promises to Observables
    ? (...args: A) => Observable<R>
    : T[K] extends object
    // Recursively apply to nested objects
    ? WrappedSDK<T[K]>
    // Keep other types unchanged
    : T[K];
};

/**
 * Function to recursively wrap an SDK instance with RxJS Observables
 * @param sdkInstance - The SDK object to be wrapped
 */
export function wrapWithRx<T extends object>(sdkInstance: T): WrappedSDK<T> {
  return new Proxy(sdkInstance, {
    get(target, prop, receiver) {
      const originalValue = Reflect.get(target, prop, receiver);

      if (typeof originalValue === 'function') {
        return (...args: any[]) => {
          const result = originalValue.apply(target, args);
          return result instanceof Promise ? from(result) : result;
        };
      }

      if (typeof originalValue === 'object' && originalValue !== null) {
        // Recursively wrap nested objects
        return wrapWithRx(originalValue);
      }

      return originalValue;
    }
    // 🔥 FIX: Ensure TypeScript correctly infers wrapped type
  }) as WrappedSDK<T>;
}
