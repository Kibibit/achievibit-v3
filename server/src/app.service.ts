import { join } from 'path';

import { createReadStream } from 'fs-extra';

import { Injectable, StreamableFile } from '@nestjs/common';

import { configService, Logger, SmeeService } from '@kb-config';


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

  getWordPronunciation() {
    const file = createReadStream(join(configService.appRoot, 'achieveebeet.mp3'));

    return new StreamableFile(file);
  }
}
