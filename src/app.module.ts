import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SmeeService } from '@kb-config';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [
    AppService,
    SmeeService
  ],
})
export class AppModule {}
