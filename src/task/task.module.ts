import { Module } from '@nestjs/common';
import { TaskController } from './task.controller';
import { Task } from './entities/task.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { taskService } from './task.service';

@Module({
    imports: [TypeOrmModule.forFeature([Task])],
    controllers: [TaskController],
    providers: [taskService],
})
export class TaskModule {}
