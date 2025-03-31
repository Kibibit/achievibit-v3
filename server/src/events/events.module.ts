import { Module } from '@nestjs/common';

import { EventsGateway } from './events.gateway';
import { MiniGamesGateway } from './mini-games/mini-games.gateway';
import { EventsService } from './events.service';

@Module({
  providers: [
    EventsGateway,
    MiniGamesGateway,
    EventsService
  ],
  exports: [EventsService],
})
export class EventsModule {}
