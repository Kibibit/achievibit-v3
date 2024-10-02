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
      // concat parts of string using node url class to create the target url
      const targetUrl = new URL(
        '/api/webhooks/github',
        configService.config.BASE_BACKEND_URL
      );
      const smeeSource = `https://smee.kibibit.io/${ configService.config.SMEE_WEBHOOK_PROXY_CHANNEL }`;
      this.smee = new SmeeClient({
        source: smeeSource,
        target: targetUrl.href,
        logger: {
          info: (msg) => this.logger.verbose(msg),
          error: (msg) => this.logger.error(JSON.stringify(msg, null, 2))
        }
      });

      this.events = this.smee.start();
    }
  }


  beforeApplicationShutdown(signal?: string) {
    console.log('stopping smee client gracefully', signal);

    if (!this.events) {
      return;
    }

    this.events.close();
  }
}
