import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { UserService } from './user.service';
import { User } from './entities/user.entity';

jest.mock('bcrypt', () => ({
    hash: jest.fn().mockResolvedValue('hashed-password'),
    compare: jest.fn().mockResolvedValue(true),
}));

describe('UserService', () => {
    let service: UserService;
    let userRepo: {
        create: jest.Mock;
        save: jest.Mock;
        findOneBy: jest.Mock;
    };

    beforeEach(async () => {
        userRepo = {
            create: jest.fn().mockImplementation((dto) => ({ ...dto })),
            save: jest.fn().mockImplementation((user) =>
                Promise.resolve({ id: 'user-1', ...user }),
            ),
            findOneBy: jest.fn().mockResolvedValue(null),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserService,
                {
                    provide: getRepositoryToken(User),
                    useValue: userRepo,
                },
            ],
        }).compile();

        service = module.get<UserService>(UserService);
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        it('should hash password and create user', async () => {
            const dto = {
                name: 'John',
                email: 'john@example.com',
                password: 'Secret123!',
            };
            const result = await service.create(dto);

            expect(bcrypt.hash).toHaveBeenCalledWith(
                'Secret123!',
                expect.any(Number),
            );
            expect(userRepo.create).toHaveBeenCalledWith({
                ...dto,
                password: 'hashed-password',
            });
            expect(userRepo.save).toHaveBeenCalled();
            expect(result).toHaveProperty('password', 'hashed-password');
            expect(result).toHaveProperty('email', 'john@example.com');
        });
    });

    describe('findOneByEmail', () => {
        it('should return user when found', async () => {
            const user = {
                id: 'user-1',
                email: 'a@b.com',
                name: 'Alice',
                password: 'hash',
            };
            userRepo.findOneBy.mockResolvedValue(user);

            const result = await service.findOneByEmail('a@b.com');

            expect(userRepo.findOneBy).toHaveBeenCalledWith({ email: 'a@b.com' });
            expect(result).toEqual(user);
        });

        it('should return null when not found', async () => {
            userRepo.findOneBy.mockResolvedValue(null);

            const result = await service.findOneByEmail('unknown@b.com');

            expect(result).toBeNull();
        });
    });

    describe('verifyPassword', () => {
        it('should return true when password matches', async () => {
            (bcrypt.compare as jest.Mock).mockResolvedValue(true);

            const result = await service.verifyPassword('Secret123!', 'hash');

            expect(bcrypt.compare).toHaveBeenCalledWith('Secret123!', 'hash');
            expect(result).toBe(true);
        });

        it('should return false when password does not match', async () => {
            (bcrypt.compare as jest.Mock).mockResolvedValue(false);

            const result = await service.verifyPassword('Wrong!', 'hash');

            expect(result).toBe(false);
        });
    });
});
