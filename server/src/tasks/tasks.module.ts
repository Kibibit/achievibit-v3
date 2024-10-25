import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { SystemsModule } from '@kb-systems';

import { TasksService } from './tasks.service';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    SystemsModule
  ],
  providers: [ TasksService ]
})
export class TasksModule {}
