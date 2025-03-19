import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DiskHealthIndicator, HealthCheck, HealthCheckService, HttpHealthIndicator, MemoryHealthIndicator, TypeOrmHealthIndicator } from '@nestjs/terminus';

import { Logger } from '@kb-config';
import { CertificateHealthIndicator } from './certificate-health-indicator';

@Controller('api/health')
@ApiTags('Health')
export class HealthController {
  private readonly logger = new Logger(HealthController.name);

  constructor(
    private health: HealthCheckService,
    private db: TypeOrmHealthIndicator,
    private readonly disk: DiskHealthIndicator,
    private memory: MemoryHealthIndicator,
    private http: HttpHealthIndicator,
    private certificateIndicator: CertificateHealthIndicator
  ) {}

  @Get()
  @HealthCheck()
  async check() {
    const healthCheckResult = await this.health.check([
      () => this.db.pingCheck('database'),
      () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024 * 1024),
      async () => this.certificateIndicator.isHealthy()
      // () => this.disk.checkStorage('storage', { path: '/', threshold: 250 * 1024 * 1024 * 1024 })
    ]);

    this.logger.debug('Health Check Results', { healthCheckResult });

    return healthCheckResult;
  }

  @HealthCheck()
  @Get('external')
  checkExternalApi() {
    return this.health.check([
      () => this.http.pingCheck('github', 'https://api.github.com'),
      () => this.http.pingCheck('gitlab', 'https://gitlab.com'),
      () => this.http.pingCheck('bitbucket', 'https://api.bitbucket.org'),
      () => this.http.pingCheck('postmark', 'https://api.postmarkapp.com')
    ]);
  }

  @HealthCheck()
  @Get('devtools')
  checkDevTools() {
    return this.health.check([
      () => this.http.pingCheck('smee.kibibit.io', 'https://smee.kibibit.io/'),
      () => this.http.pingCheck('forms.kibibit.io', 'https://forms.kibibit.io/'),
      () => this.http.pingCheck('matomo.kibibit.io', 'https://matomo.kibibit.io/'),
      () => this.http.pingCheck('growthbook.kibibit.io', 'https://growthbook.kibibit.io/'),
      () => this.http.pingCheck('n8n.kibibit.io', 'https://n8n.kibibit.io/'),
      () => this.http.pingCheck('secrets.kibibit.io', 'https://secrets.kibibit.io/'),
      () => this.http.pingCheck('imgproxy.kibibit.io', 'https://imgproxy.kibibit.io/'),
    ]);
  }
}
