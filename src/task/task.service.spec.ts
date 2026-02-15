import { Test, TestingModule } from '@nestjs/testing';
import { taskervice } from './task.service';

describe('taskervice', () => {
  let service: taskervice;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [taskervice],
    }).compile();

    service = module.get<taskervice>(taskervice);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
