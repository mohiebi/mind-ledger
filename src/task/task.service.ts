import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { GetTasksQueryDto } from './dto/get-tasks-query.dto';
import { Task } from './entities/task.entity';
import { TaskStatus } from './entities/task.model';

@Injectable()
export class TaskService {
    constructor(
        @InjectRepository(Task)
        private readonly taskRepository: Repository<Task>,
    ) {}

    async create(userId: string, createTaskDto: CreateTaskDto): Promise<Task> {
        const task = this.taskRepository.create({
            ...createTaskDto,
            status: TaskStatus.OPEN,
            userId,
        });

        return await this.taskRepository.save(task);
    }

    async findAll(
        userId: string,
        query: GetTasksQueryDto,
    ): Promise<{
        data: Task[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }> {
        const page = query.page ?? 1;
        const limit = query.limit ?? 10;
        const skip = (page - 1) * limit;

        const qb = this.taskRepository
            .createQueryBuilder('task')
            .where('task.userId = :userId', { userId });

        if (query.title?.trim()) {
            qb.andWhere('task.title ILIKE :title', {
                title: `%${query.title.trim()}%`,
            });
        }

        if (query.status) {
            qb.andWhere('task.status = :status', { status: query.status });
        }

        qb.orderBy('task.createdAt', 'DESC').skip(skip).take(limit);

        const [data, total] = await qb.getManyAndCount();
        const totalPages = Math.max(1, Math.ceil(total / limit));

        return { data, meta: { total, page, limit, totalPages } };
    }

    async findOne(userId: string, id: string): Promise<Task> {
        const task = await this.taskRepository.findOne({
            where: { id, userId },
        });

        if (!task) {
            throw new NotFoundException('Task not found');
        }

        return task;
    }

    async update(
        userId: string,
        id: string,
        updateTaskDto: UpdateTaskDto,
    ): Promise<Task> {
        const task = await this.findOne(userId, id);
        Object.assign(task, updateTaskDto);
        return await this.taskRepository.save(task);
    }

    async remove(userId: string, id: string): Promise<{ deleted: true }> {
        const task = await this.findOne(userId, id);
        await this.taskRepository.remove(task);
        return { deleted: true };
    }
}
