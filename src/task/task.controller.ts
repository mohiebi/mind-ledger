import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { taskervice } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Controller('task')
export class TaskController {
  constructor(private readonly taskervice: taskervice) {}

  @Post()
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.taskervice.create(createTaskDto);
  }

  @Get()
  findAll() {
    return this.taskervice.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.taskervice.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.taskervice.update(+id, updateTaskDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.taskervice.remove(+id);
  }
}
