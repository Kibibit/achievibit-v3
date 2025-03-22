import { distinctUntilChanged, map, Observable, ReplaySubject, shareReplay, Subject, switchMap, take, timer } from 'rxjs';

interface ICacheableOptions {
  cacheDurationMs?: number;
  emitOnce?: boolean;
}

export interface ICacheMap {
  [key: string]: {
    subject: Subject<any>;
    cacheDurationMs: number;
    initialized: boolean;
  };
}

export interface ICachableService {
  cacheMap: ICacheMap;
}

/**
 * Cacheable decorator to cache the result of an observable method.
 * The decorator will create a ReplaySubject for the method and will
 * emit the result of the method to the ReplaySubject. If the method
 * includes options object as the last argument, the options object
 * can contain emitOnce property to emit the result only once.
 */
export function Cacheable<T>(options: ICacheableOptions) {
  return function(
    target: any,
    propertyKey: string,
    descriptor: TypedPropertyDescriptor<(...args: any[]) => Observable<T>>
  ) {
    const originalMethod = descriptor.value;
    if (!originalMethod) {
      throw new Error('@Cacheable can only be used on methods that return an Observable');
    }

    if (!target.cacheMap) {
      target.cacheMap = {};
    }

    descriptor.value = function(...args: any[]): Observable<T> {
      // key is the method name
      const cacheMapKey = propertyKey;

      // Default from decorator
      let emitOnce = options.emitOnce;
      // Check if the last argument is an object containing emitOnce
      const lastArg = args[args.length - 1];
      if (typeof lastArg === 'object' && lastArg !== null && 'emitOnce' in lastArg) {
        emitOnce = lastArg.emitOnce;
      }

      if (!target.cacheMap[cacheMapKey]) {
        target.cacheMap[cacheMapKey] = {
          subject: new ReplaySubject<T | null>(1),
          cacheDurationMs: options.cacheDurationMs || 3 * 60 * 1000,
          initialized: false
        };
      }

      if (!target.cacheMap[cacheMapKey].initialized) {
        target.cacheMap[cacheMapKey].initialized = true;

        timer(0, target.cacheMap[cacheMapKey].cacheDurationMs)
          .pipe(
            switchMap(() => {
              const result = originalMethod.apply(this, args);
              if (!(result instanceof Observable)) {
                throw new Error('@Cacheable can only be used on methods that return an Observable');
              }
              return result.pipe(map((res) => ({ ...res, timestamp: Date.now() })));
            }),
            distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)),
            shareReplay({ bufferSize: 1, refCount: true })
          )
          .subscribe((result) => target.cacheMap[cacheMapKey].subject.next(result));
      }

      if (emitOnce) {
        return target.cacheMap[cacheMapKey].subject.asObservable().pipe(take(1)) as Observable<T>;
      }

      return target.cacheMap[cacheMapKey].subject.asObservable() as Observable<T>;
    };
  };
}
