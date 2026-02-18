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
    Request,
    HttpCode,
    HttpStatus,
    ParseUUIDPipe,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { GetTasksQueryDto } from './dto/get-tasks-query.dto';
import { PassportJwtAuthGuard } from 'src/auth/guards/passport-jwt.guard';

@Controller('tasks')
@UseGuards(PassportJwtAuthGuard)
export class TaskController {
    constructor(private readonly taskService: TaskService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    create(
        @Request() req: { user: { userId: string } },
        @Body() createTaskDto: CreateTaskDto,
    ) {
        return this.taskService.create(req.user.userId, createTaskDto);
    }

    @Get()
    findAll(
        @Request() req: { user: { userId: string } },
        @Query() query: GetTasksQueryDto,
    ) {
        return this.taskService.findAll(req.user.userId, query);
    }

    @Get(':id')
    findOne(
        @Request() req: { user: { userId: string } },
        @Param('id', ParseUUIDPipe) id: string,
    ) {
        return this.taskService.findOne(req.user.userId, id);
    }

    @Patch(':id')
    update(
        @Request() req: { user: { userId: string } },
        @Param('id', ParseUUIDPipe) id: string,
        @Body() updateTaskDto: UpdateTaskDto,
    ) {
        return this.taskService.update(req.user.userId, id, updateTaskDto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    remove(
        @Request() req: { user: { userId: string } },
        @Param('id', ParseUUIDPipe) id: string,
    ) {
        return this.taskService.remove(req.user.userId, id);
    }
}
