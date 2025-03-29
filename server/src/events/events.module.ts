import { Module } from '@nestjs/common';

import { EventsGateway } from './events.gateway';
import { MiniGamesGateway } from './mini-games/mini-games.gateway';

@Module({
  providers: [
    EventsGateway,
    MiniGamesGateway
  ]
})
export class EventsModule {}
