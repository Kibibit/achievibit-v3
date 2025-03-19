import { Api as OriginalApiService, ApiConfig } from './api';
import { WrappedSDK, wrapWithRx } from './rxjsify';

export class RxjsApi<SecurityDataType> extends OriginalApiService<SecurityDataType> {
  constructor(apiConfig?: ApiConfig) {
    // Call the base class constructor
    super(apiConfig);

    // Wrap only methods, preserving class properties
    const wrappedSdk = wrapWithRx(this) as WrappedSDK<OriginalApiService<SecurityDataType>>;

    // Copy the wrapped methods to 'this' while preserving properties
    Object.assign(this, wrappedSdk);
  }
}
