import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';

import { HealthController } from './health.controller';
import { CertificateHealthIndicator } from './certificate-health-indicator';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    CacheModule.register(),
    TerminusModule.forRoot({
      errorLogStyle: 'pretty'
    }),
    HttpModule
  ],
  controllers: [ HealthController ],
  providers: [CertificateHealthIndicator]
})
export class HealthModule {}
