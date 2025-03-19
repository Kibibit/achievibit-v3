import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';

import { HealthController } from './health.controller';
import { CertificateHealthIndicator } from './certificate-health-indicator';

@Module({
  imports: [
    TerminusModule.forRoot({
      errorLogStyle: 'pretty'
    }),
    HttpModule
  ],
  controllers: [ HealthController ],
  providers: [CertificateHealthIndicator]
})
export class HealthModule {}
