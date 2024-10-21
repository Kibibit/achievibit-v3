import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksService } from './tasks.service';
import { SystemsModule } from '@kb-systems';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    SystemsModule
  ],
  providers: [TasksService]
})
export class TasksModule {}
