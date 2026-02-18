import { PartialType } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { TaskStatus } from '../entities/task.model';
import { CreateTaskDto } from './create-task.dto';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
    @IsOptional()
    @IsEnum(TaskStatus)
    status?: TaskStatus;
}
