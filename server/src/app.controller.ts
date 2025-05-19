import { join } from 'path';

import { readFileSync } from 'fs-extra';
import { chain } from 'lodash';
import timezones, { Timezone } from 'timezones.json';

import { Controller, Get, Header, Post, Body, HttpCode } from '@nestjs/common';
import { ApiExtraModels, ApiNotModifiedResponse, ApiOkResponse, ApiOperation, ApiProperty, getSchemaPath } from '@nestjs/swagger';

import { configService, Logger } from '@kb-config';
import { ApiInfo } from '@kb-models';

import { AppService } from './app.service';
import { EventsService } from '@kb-events';

export class KbTimezone implements Timezone {
  @ApiProperty()
    value: string;

  @ApiProperty()
    abbr: string;

  @ApiProperty()
    offset: number;

  @ApiProperty()
    isdst: boolean;

  @ApiProperty()
    text: string;

  @ApiProperty({
    isArray: true,
    type: String
  })
    utc: string[];
}

export type KbTimezonesPayload = Record<string, KbTimezone>;

@ApiExtraModels(KbTimezone)
@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);
  constructor(
    private readonly appService: AppService,
    private readonly eventsService: EventsService
  ) {}

  @Get('api')
  @ApiOperation({ summary: 'Get API Information' })
  @ApiOkResponse({
    description: 'Returns API info as a JSON',
    type: ApiInfo
  })
  async getApiDetails() {
    return this.appService.getApiDetails();
    // throw new UnauthorizedException('Unauthorized');
  }

  @Get('api/timezones')
  @ApiOperation({ summary: 'Get Supported Timezones' })
  @ApiOkResponse({
    description: 'Returns a map of UTC offset to timezone',
    schema: {
      type: 'object',
      additionalProperties: {
        $ref: getSchemaPath(KbTimezone)
      }
    }
  })
  async getTimezones() {
    // each timezone has a array of utc offsets.
    // for each timezone, we want to loop over the offsets and add each one
    // we want a map of key === utc offset, value === single timezone mapping
    const timezonesByUTC = chain(timezones)
      .map((timezone) => timezone.utc.map((utc) => [ utc, timezone ]))
      .flatten()
      .groupBy((pair) => pair[0])
      .mapValues((pairs) => pairs.map((pair) => pair[1]))
      .mapValues((timezones) => timezones[0])
      .value();

    return timezonesByUTC;
  }

  @Get('api/swagger')
  @ApiOperation({ summary: 'Get Dev Center Options' })
  @ApiOkResponse({
    description: 'Returns dev center options'
  })
  @ApiNotModifiedResponse({
    description: 'No changes since last request'
  })
  getDevCenterOptions() {
    return {
      smeeUrl: this.appService.smeeUrl,
      showSwaggerUi: true,
      showSwaggerJson: false,
      showAsyncDocs: false,
      showSmeeClient: this.appService.smeeUrl ? true : false,
      showNestjsDevTools: false,
      showUnitTestsResults: true
    };
  }

  @Get('/socket.io')
  getSocketIo() {
    return readFileSync(join(configService.appRoot, './socket-io.js'), 'utf8');
  }

  @Get('api/pronunciation')
  @Header('Content-Type', 'audio/mpeg')
  @ApiOperation({ summary: 'Get Word Pronunciation for achievibit' })
  @ApiOkResponse({
    description: 'Returns an audio file for the word "achievibit"',
    content: {
      'audio/mpeg': {
        schema: {
          type: 'string',
          format: 'binary'
        }
      }
    }
  })
  getWordPronunciation() {
    return this.appService.getWordPronunciation();
  }

  @Post('api/test-results-refresh')
  @HttpCode(200)
  refreshTestResults(@Body() data: { timestamp: string }) {
    console.log('Manual test results refresh triggered', data);
    
    // Broadcast the refresh event through the EventsService
    try {
      // Use WebSocket server to broadcast the event
      this.eventsService.broadcastTestResultsRefresh(data.timestamp);
      return { status: 'ok', message: 'Test results refresh event broadcasted' };
    } catch (error) {
      console.error('Error broadcasting test results refresh:', error);
      return { status: 'error', message: error.message };
    }
  }
}

// This function is not used but kept for potential future use
function countryCodeToFlagEmoji(countryCode) {
  return countryCode
    .toUpperCase()
    .replace(/./g, (char) => String.fromCodePoint(char.charCodeAt(0) + 127397));
}
