import { Test, TestingModule } from '@nestjs/testing';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { TaskStatus } from './entities/task.model';

describe('TaskController', () => {
    let controller: TaskController;
    let taskService: {
        create: jest.Mock;
        findAll: jest.Mock;
        findOne: jest.Mock;
        update: jest.Mock;
        remove: jest.Mock;
    };

    const userA = { userId: 'user-a', email: 'a@test.com' };
    const userB = { userId: 'user-b', email: 'b@test.com' };

    beforeEach(async () => {
        taskService = {
            create: jest.fn().mockResolvedValue({ id: 'task-1', userId: 'user-a' }),
            findAll: jest
                .fn()
                .mockResolvedValue({
                    data: [],
                    meta: { total: 0, page: 1, limit: 10, totalPages: 1 },
                }),
            findOne: jest.fn().mockResolvedValue({ id: 'task-1', userId: 'user-a' }),
            update: jest.fn().mockResolvedValue({ id: 'task-1', title: 'Updated' }),
            remove: jest.fn().mockResolvedValue({ deleted: true }),
        };

        const module: TestingModule = await Test.createTestingModule({
            controllers: [TaskController],
            providers: [{ provide: TaskService, useValue: taskService }],
        }).compile();

        controller = module.get<TaskController>(TaskController);
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('create', () => {
        it('should call service with current user id', async () => {
            const dto = { title: 'New task', description: 'Do it' };
            await controller.create(userA, dto);

            expect(taskService.create).toHaveBeenCalledTimes(1);
            expect(taskService.create).toHaveBeenCalledWith('user-a', dto);
        });

        it('should use different user id when different user is authenticated', async () => {
            const dto = { title: 'Other', description: 'Desc' };
            await controller.create(userB, dto);

            expect(taskService.create).toHaveBeenCalledWith('user-b', dto);
        });
    });

    describe('findAll', () => {
        it('should pass current user id to service', async () => {
            await controller.findAll(userA, { page: 2, limit: 5 });

            expect(taskService.findAll).toHaveBeenCalledWith('user-a', {
                page: 2,
                limit: 5,
            });
        });

        it('should not expose another user id', async () => {
            await controller.findAll(userB, {});

            expect(taskService.findAll).toHaveBeenCalledWith('user-b', expect.any(Object));
        });
    });

    describe('findOne', () => {
        it('should pass current user id so only own task can be returned', async () => {
            await controller.findOne(userA, 'task-1');

            expect(taskService.findOne).toHaveBeenCalledWith('user-a', 'task-1');
        });

        it('should use authenticated user id for authorization', async () => {
            await controller.findOne(userB, 'task-1');

            expect(taskService.findOne).toHaveBeenCalledWith('user-b', 'task-1');
        });
    });

    describe('update', () => {
        it('should pass current user id so only own task can be updated', async () => {
            const dto = { status: TaskStatus.DONE };
            await controller.update(userA, 'task-1', dto);

            expect(taskService.update).toHaveBeenCalledWith('user-a', 'task-1', dto);
        });
    });

    describe('remove', () => {
        it('should pass current user id so only own task can be deleted', async () => {
            await controller.remove(userA, 'task-1');

            expect(taskService.remove).toHaveBeenCalledWith('user-a', 'task-1');
        });
    });
});
