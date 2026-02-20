import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Query,
    HttpCode,
    HttpStatus,
    ParseUUIDPipe,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { GetTasksQueryDto } from './dto/get-tasks-query.dto';
import { PassportJwtAuthGuard } from 'src/auth/guards/passport-jwt.guard';
import {
    CurrentUser,
    type JwtPayload,
} from 'src/auth/decorators/current-user.decorator';

@Controller('tasks')
@UseGuards(PassportJwtAuthGuard)
export class TaskController {
    constructor(private readonly taskService: TaskService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    create(
        @CurrentUser() user: JwtPayload,
        @Body() createTaskDto: CreateTaskDto,
    ) {
        return this.taskService.create(user.userId, createTaskDto);
    }

    @Get()
    findAll(@CurrentUser() user: JwtPayload, @Query() query: GetTasksQueryDto) {
        return this.taskService.findAll(user.userId, query);
    }

    @Get(':id')
    findOne(
        @CurrentUser() user: JwtPayload,
        @Param('id', ParseUUIDPipe) id: string,
    ) {
        return this.taskService.findOne(user.userId, id);
    }

    @Patch(':id')
    update(
        @CurrentUser() user: JwtPayload,
        @Param('id', ParseUUIDPipe) id: string,
        @Body() updateTaskDto: UpdateTaskDto,
    ) {
        return this.taskService.update(user.userId, id, updateTaskDto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    remove(
        @CurrentUser() user: JwtPayload,
        @Param('id', ParseUUIDPipe) id: string,
    ) {
        return this.taskService.remove(user.userId, id);
    }
}
