import { Test, TestingModule } from '@nestjs/testing';
import { FinanceController } from './finance.controller';
import { FinanceService } from './finance.service';

describe('FinanceController', () => {
    let controller: FinanceController;
    let service: FinanceService;

    const mockService = {
        createCategory: jest.fn().mockResolvedValue({ id: 'cat-1', name: 'Food' }),
        getCategories: jest.fn().mockResolvedValue([]),
        createTransaction: jest.fn().mockResolvedValue({ id: 'txn-1' }),
        getTransactions: jest
            .fn()
            .mockResolvedValue({ data: [], meta: { total: 0, page: 1, limit: 10, totalPages: 1 } }),
        getMonthlySummary: jest.fn().mockResolvedValue({
            totalIncome: 0,
            totalExpense: 0,
            balance: 0,
            byCategory: [],
        }),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [FinanceController],
            providers: [{ provide: FinanceService, useValue: mockService }],
        }).compile();

        controller = module.get<FinanceController>(FinanceController);
        service = module.get<FinanceService>(FinanceService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('createCategory', () => {
        it('should delegate to service with userId from JWT', async () => {
            const user = { userId: 'user-1', email: 'a@b.com' };
            await controller.createCategory(user, { name: 'Food', type: 'expense' as any });
            expect(mockService.createCategory).toHaveBeenCalledWith('user-1', {
                name: 'Food',
                type: 'expense',
            });
        });
    });

    describe('getCategories', () => {
        it('should delegate to service with userId from JWT', async () => {
            const user = { userId: 'user-1', email: 'a@b.com' };
            await controller.getCategories(user);
            expect(mockService.getCategories).toHaveBeenCalledWith('user-1');
        });
    });

    describe('getMonthlySummary', () => {
        it('should pass year and month from query', async () => {
            const user = { userId: 'user-1', email: 'a@b.com' };
            await controller.getMonthlySummary(user, { year: 2026, month: 2 });
            expect(mockService.getMonthlySummary).toHaveBeenCalledWith('user-1', 2026, 2);
        });
    });
});
