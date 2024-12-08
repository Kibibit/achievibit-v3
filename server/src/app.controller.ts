import { join } from 'path';

import { readFileSync, readJSON } from 'fs-extra';
import { chain } from 'lodash';

import { Controller, Get, Req } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';

import { configService, Logger } from '@kb-config';
import { ApiInfo } from '@kb-models';

import { AppService } from './app.service';
import { GrowthbookService } from './growthbook/growthbook.service';
import { Request } from 'express';

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);
  constructor(
    private readonly appService: AppService,
    private readonly growthbookService: GrowthbookService
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

  @Get('/growthbook')
  async testGrowthbook(
    // get the request object
    @Req() req: Request
  ) {
    await this.growthbookService.init();
    this.growthbookService.setUserAttributes(req);

    if (this.growthbookService.isOn('test-feature')) {
      return 'Feature is on!';
    }

    return 'Feature is off!';
  }
}
