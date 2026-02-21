import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TaskService } from './task.service';
import { Task } from './entities/task.entity';
import { TaskStatus } from './entities/task.model';

const mockQueryBuilder = {
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    getManyAndCount: jest.fn().mockResolvedValue([[], 0]),
};

describe('TaskService', () => {
    let service: TaskService;
    let taskRepo: {
        create: jest.Mock;
        save: jest.Mock;
        findOne: jest.Mock;
        remove: jest.Mock;
        createQueryBuilder: jest.Mock;
    };

    beforeEach(async () => {
        taskRepo = {
            create: jest.fn().mockImplementation((dto) => ({ ...dto })),
            save: jest.fn().mockImplementation((t) => Promise.resolve({ id: 'task-1', ...t })),
            findOne: jest.fn().mockResolvedValue(null),
            remove: jest.fn().mockResolvedValue(undefined),
            createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                TaskService,
                { provide: getRepositoryToken(Task), useValue: taskRepo },
            ],
        }).compile();

        service = module.get<TaskService>(TaskService);
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        it('should create a task with userId and OPEN status', async () => {
            const dto = { title: 'My task', description: 'Do something' };
            const result = await service.create('user-1', dto);

            expect(taskRepo.create).toHaveBeenCalledWith({
                ...dto,
                status: TaskStatus.OPEN,
                userId: 'user-1',
            });
            expect(taskRepo.save).toHaveBeenCalled();
            expect(result).toHaveProperty('userId', 'user-1');
            expect(result).toHaveProperty('status', TaskStatus.OPEN);
        });
    });

    describe('findAll', () => {
        it('should query only tasks for the given userId', async () => {
            taskRepo.createQueryBuilder.mockReturnValue(mockQueryBuilder);
            mockQueryBuilder.getManyAndCount.mockResolvedValue([
                [{ id: 't1', userId: 'user-1', title: 'Task' }],
                1,
            ]);

            const result = await service.findAll('user-1', {});

            expect(mockQueryBuilder.where).toHaveBeenCalledWith(
                'task.userId = :userId',
                { userId: 'user-1' },
            );
            expect(result.data).toHaveLength(1);
            expect(result.meta).toMatchObject({ total: 1, page: 1, limit: 10 });
        });

        it('should apply title and status filters when provided', async () => {
            await service.findAll('user-1', {
                title: 'search',
                status: TaskStatus.DONE,
            });

            expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
                'task.title ILIKE :title',
                { title: '%search%' },
            );
            expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
                'task.status = :status',
                { status: TaskStatus.DONE },
            );
        });
    });

    describe('findOne', () => {
        it('should return task when it belongs to the user', async () => {
            const task = {
                id: 'task-1',
                userId: 'user-1',
                title: 'My task',
                status: TaskStatus.OPEN,
            };
            taskRepo.findOne.mockResolvedValue(task);

            const result = await service.findOne('user-1', 'task-1');

            expect(taskRepo.findOne).toHaveBeenCalledWith({
                where: { id: 'task-1', userId: 'user-1' },
            });
            expect(result).toEqual(task);
        });

        it('should throw NotFoundException when task does not exist', async () => {
            taskRepo.findOne.mockResolvedValue(null);

            await expect(service.findOne('user-1', 'missing-id')).rejects.toThrow(
                NotFoundException,
            );
            await expect(service.findOne('user-1', 'missing-id')).rejects.toThrow(
                'Task not found',
            );
        });

        it('should not return task belonging to another user', async () => {
            taskRepo.findOne.mockResolvedValue(null);

            await expect(
                service.findOne('user-2', 'task-owned-by-user-1'),
            ).rejects.toThrow(NotFoundException);

            expect(taskRepo.findOne).toHaveBeenCalledWith({
                where: { id: 'task-owned-by-user-1', userId: 'user-2' },
            });
        });
    });

    describe('update', () => {
        it('should update only when task belongs to user', async () => {
            const existing = {
                id: 'task-1',
                userId: 'user-1',
                title: 'Old',
                description: 'Desc',
                status: TaskStatus.OPEN,
            };
            taskRepo.findOne.mockResolvedValue(existing);
            taskRepo.save.mockImplementation((t) => Promise.resolve(t));

            const result = await service.update('user-1', 'task-1', {
                title: 'Updated',
                status: TaskStatus.DONE,
            });

            expect(taskRepo.findOne).toHaveBeenCalledWith({
                where: { id: 'task-1', userId: 'user-1' },
            });
            expect(result).toMatchObject({
                title: 'Updated',
                status: TaskStatus.DONE,
            });
        });

        it('should throw when task not found for user', async () => {
            taskRepo.findOne.mockResolvedValue(null);

            await expect(
                service.update('user-1', 'other-user-task', { title: 'Hack' }),
            ).rejects.toThrow(NotFoundException);
        });
    });

    describe('remove', () => {
        it('should remove only when task belongs to user', async () => {
            const task = {
                id: 'task-1',
                userId: 'user-1',
                title: 'To delete',
            };
            taskRepo.findOne.mockResolvedValue(task);

            const result = await service.remove('user-1', 'task-1');

            expect(taskRepo.findOne).toHaveBeenCalledWith({
                where: { id: 'task-1', userId: 'user-1' },
            });
            expect(taskRepo.remove).toHaveBeenCalledWith(task);
            expect(result).toEqual({ deleted: true });
        });

        it('should throw when task not found for user', async () => {
            taskRepo.findOne.mockResolvedValue(null);

            await expect(service.remove('user-1', 'other-user-task')).rejects.toThrow(
                NotFoundException,
            );
        });
    });
});
