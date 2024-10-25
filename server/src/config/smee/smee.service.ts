import { noop } from 'lodash';
import SmeeClient from 'smee-client';

import { BeforeApplicationShutdown, Injectable } from '@nestjs/common';

import { configService, Logger } from '@kb-config';

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
        `http://localhost:${ configService.config.PORT }`
      );
      const smeeSource = `https://smee.kibibit.io/${ configService.config.SMEE_WEBHOOK_PROXY_CHANNEL }`;
      this.logger.verbose('Starting smee client', {
        source: smeeSource,
        target: targetUrl.href
      });
      this.smee = new SmeeClient({
        source: smeeSource,
        target: targetUrl.href,
        logger: {
          info: noop,
          error: noop
        }
        // logger: {
        //   info: (msg) => this.logger.verbose(msg),
        //   error: (msg) => this.logger.error(msg)
        // }
      });

      this.events = this.smee.start();

      return smeeSource;
    }

    return null;
  }


  beforeApplicationShutdown(signal?: string) {
    this.logger.verbose('stopping smee client gracefully');

    if (!this.events) {
      return;
    }

    this.events.close();
  }
}
