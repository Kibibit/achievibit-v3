import { Module } from '@nestjs/common';

import { EventsGateway } from './events.gateway';
import { MiniGamesGateway } from './mini-games/mini-games.gateway';
import { SystemEventsGateway } from './system-events.gateway';
import { EventsService } from './events.service';

@Module({
  providers: [
    EventsGateway,
    MiniGamesGateway,
    SystemEventsGateway,
    EventsService
  ],
  exports: [EventsService],
})
export class EventsModule {}
