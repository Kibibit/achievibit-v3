import { configService, Logger, SmeeService } from '@kb-config';
import { Injectable } from '@nestjs/common';


@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);
  readonly smeeUrl: string;

  constructor(
    smeeService: SmeeService
  ) {
    this.smeeUrl = smeeService.initializeSmeeClient();

    if (configService.config.SYNCHRONIZE_DATABASE) {
      this.logger.verbose([
        'Database synchronization is turned on.',
        'This should only be used in development'
      ].join(' '));
    }
  }

  getHello(): string {
    return 'Hello World!';
  }
}
