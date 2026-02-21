import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { FinanceService } from './finance.service';
import { Category } from './entities/category.entity';
import { Transaction } from './entities/transaction.entity';

const mockQueryBuilder = {
    select: jest.fn().mockReturnThis(),
    addSelect: jest.fn().mockReturnThis(),
    leftJoin: jest.fn().mockReturnThis(),
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    groupBy: jest.fn().mockReturnThis(),
    addGroupBy: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    getManyAndCount: jest.fn().mockResolvedValue([[], 0]),
    getRawMany: jest.fn().mockResolvedValue([]),
};

describe('FinanceService', () => {
    let service: FinanceService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                FinanceService,
                {
                    provide: getRepositoryToken(Category),
                    useValue: {
                        create: jest.fn().mockImplementation((dto) => dto),
                        save: jest.fn().mockImplementation((e) => Promise.resolve({ id: 'cat-1', ...e })),
                        find: jest.fn().mockResolvedValue([]),
                        findOne: jest.fn().mockResolvedValue(null),
                    },
                },
                {
                    provide: getRepositoryToken(Transaction),
                    useValue: {
                        create: jest.fn().mockImplementation((dto) => dto),
                        save: jest.fn().mockImplementation((e) => Promise.resolve({ id: 'txn-1', ...e })),
                        createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
                    },
                },
            ],
        }).compile();

        service = module.get<FinanceService>(FinanceService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('createCategory', () => {
        it('should create a category for the given user', async () => {
            const result = await service.createCategory('user-1', {
                name: 'Food',
                type: 'expense' as any,
            });
            expect(result).toHaveProperty('userId', 'user-1');
            expect(result).toHaveProperty('name', 'Food');
        });
    });

    describe('getCategories', () => {
        it('should return categories for the given user', async () => {
            const result = await service.getCategories('user-1');
            expect(Array.isArray(result)).toBe(true);
        });
    });

    describe('getTransactions', () => {
        it('should return paginated transactions', async () => {
            const result = await service.getTransactions('user-1', {});
            expect(result).toHaveProperty('data');
            expect(result).toHaveProperty('meta');
            expect(result.meta).toHaveProperty('page', 1);
        });
    });

    describe('getMonthlySummary', () => {
        it('should return income, expense, and balance', async () => {
            const result = await service.getMonthlySummary('user-1', 2026, 2);
            expect(result).toHaveProperty('totalIncome');
            expect(result).toHaveProperty('totalExpense');
            expect(result).toHaveProperty('balance');
            expect(result).toHaveProperty('byCategory');
        });
    });
});
