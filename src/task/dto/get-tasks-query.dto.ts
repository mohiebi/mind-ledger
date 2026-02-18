import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { TaskStatus } from '../entities/task.model';

export class GetTasksQueryDto {
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page?: number = 1;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(100)
    limit?: number = 10;

    @IsOptional()
    @IsString()
    title?: string;

    @IsOptional()
    @IsEnum(TaskStatus)
    status?: TaskStatus;
}
