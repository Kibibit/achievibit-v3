import { join } from 'path';

import { createReadStream, readJSON } from 'fs-extra';

import { Injectable, StreamableFile } from '@nestjs/common';

import { configService, Logger, SmeeService } from '@kb-config';
import { ApiInfo } from '@kb-models';
import { chain } from 'lodash';


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

  async getApiDetails() {
    const packageInfo = await readJSON(
      join(configService.appRoot, './package.json')
    );
    const details = new ApiInfo(
      chain(packageInfo)
        .pick([
          'name',
          'description',
          'version',
          'license',
          'repository',
          'author',
          'bugs'
        ])
        .mapValues((val) => val.url ? val.url : val)
        .value()
    );

    return details;
  }
}
