import { Test, TestingModule } from '@nestjs/testing';
import { userervice } from './user.service';

describe('userervice', () => {
    let service: userervice;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [userervice],
        }).compile();

        service = module.get<userervice>(userervice);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
