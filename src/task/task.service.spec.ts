import { Test, TestingModule } from '@nestjs/testing';
import { taskService } from './task.service';

describe('taskService', () => {
  let service: taskService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [taskService],
    }).compile();

    service = module.get<taskService>(taskService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
