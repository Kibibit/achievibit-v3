import { join } from 'path';

import { readJSON } from 'fs-extra';
import { chain } from 'lodash';

import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';

import { configService, SmeeService } from '@kb-config';
import { ApiInfo } from '@kb-models';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService
    // private readonly smeeService: SmeeService
  ) {
    // this.smeeService.initializeSmeeClient();
  }

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
}
