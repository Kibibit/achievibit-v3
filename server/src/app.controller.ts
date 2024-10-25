import { join } from 'path';

import { readFileSync, readJSON } from 'fs-extra';
import { chain } from 'lodash';

import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';

import { configService, Logger } from '@kb-config';
import { ApiInfo } from '@kb-models';

import { AppService } from './app.service';

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);
  constructor(
    private readonly appService: AppService
  ) {}

  @Get('api')
  @ApiOperation({ summary: 'Get API Information' })
  @ApiOkResponse({
    description: 'Returns API info as a JSON',
    type: ApiInfo
  })
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

  @Get('api/swagger')
  @ApiOperation({ summary: 'Get Smee URL' })
  getSmeeUrl() {
    return {
      smeeUrl: this.appService.smeeUrl,
      showSwaggerUi: true,
      showSwaggerJson: false,
      showAsyncDocs: false,
      showSmeeClient: this.appService.smeeUrl ? true : false,
      showNestjsDevTools: true
    };
  }

  @Get('/socket.io')
  getSocketIo() {
    return readFileSync(join(configService.appRoot, './socket-io.js'), 'utf8');
  }
}
