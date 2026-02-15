import { Module } from '@nestjs/common';
import { taskervice } from './task.service';
import { TaskController } from './task.controller';

@Module({
  controllers: [TaskController],
  providers: [taskervice],
})
export class TaskModule {}
