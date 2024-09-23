import SmeeClient from 'smee-client';

import { BeforeApplicationShutdown, Injectable, Logger } from '@nestjs/common';

import { configService } from '@kb-config';

@Injectable()
export class SmeeService implements BeforeApplicationShutdown {
  private readonly logger = new Logger(SmeeService.name);
  private smee: SmeeClient;

  events: EventSource;

  initializeSmeeClient() {
    if (configService.config.SMEE_WEBHOOK_PROXY_CHANNEL) {
      const smeeSource = `https://smee.kibibit.io/${ configService.config.SMEE_WEBHOOK_PROXY_CHANNEL }`;
      this.smee = new SmeeClient({
        source: smeeSource,
        target: `http://localhost:${ configService.config.PORT }/webhooks/github`,
        logger: {
          info: (msg) => this.logger.verbose(msg),
          error: (msg) => this.logger.error(JSON.stringify(msg, null, 2))
        }
      });

      this.events = this.smee.start();
    }
  }

  beforeApplicationShutdown(signal?: string) {
    console.log('got here');
    if (!this.events) {
      return;
    }

    this.events.close();
  }
}
