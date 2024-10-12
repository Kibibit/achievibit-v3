import { SetMetadata } from '@nestjs/common';

export const DISABLE_IN_PRODUCTION = 'disableInProduction';

// Custom decorator to disable endpoints in production
export const DisableInProduction = () => SetMetadata(DISABLE_IN_PRODUCTION, true);
