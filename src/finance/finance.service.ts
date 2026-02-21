import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { Transaction } from './entities/transaction.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { GetTransactionsQueryDto } from './dto/get-transactions-query.dto';

@Injectable()
export class FinanceService {
    constructor(
        @InjectRepository(Category)
        private readonly categoryRepo: Repository<Category>,
        @InjectRepository(Transaction)
        private readonly transactionRepo: Repository<Transaction>,
    ) {}

    // ─── Categories ──────────────────────────────────────────

    async createCategory(
        userId: string,
        dto: CreateCategoryDto,
    ): Promise<Category> {
        const category = this.categoryRepo.create({ ...dto, userId });
        return await this.categoryRepo.save(category);
    }

    async getCategories(userId: string): Promise<Category[]> {
        return await this.categoryRepo.find({
            where: { userId },
            order: { name: 'ASC' },
        });
    }

    // ─── Transactions ────────────────────────────────────────

    async createTransaction(
        userId: string,
        dto: CreateTransactionDto,
    ): Promise<Transaction> {
        if (dto.categoryId) {
            const category = await this.categoryRepo.findOne({
                where: { id: dto.categoryId, userId },
            });
            if (!category) {
                throw new NotFoundException('Category not found');
            }
        }

        const transaction = this.transactionRepo.create({ ...dto, userId });
        return await this.transactionRepo.save(transaction);
    }

    async getTransactions(
        userId: string,
        query: GetTransactionsQueryDto,
    ): Promise<{
        data: Transaction[];
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

        const qb = this.transactionRepo
            .createQueryBuilder('t')
            .leftJoinAndSelect('t.category', 'category')
            .where('t.userId = :userId', { userId });

        if (query.type) {
            qb.andWhere('t.type = :type', { type: query.type });
        }

        if (query.categoryId) {
            qb.andWhere('t.categoryId = :categoryId', {
                categoryId: query.categoryId,
            });
        }

        if (query.year && query.month) {
            const start = `${query.year}-${String(query.month).padStart(2, '0')}-01`;
            const endMonth = query.month === 12 ? 1 : query.month + 1;
            const endYear = query.month === 12 ? query.year + 1 : query.year;
            const end = `${endYear}-${String(endMonth).padStart(2, '0')}-01`;
            qb.andWhere('t.date >= :start AND t.date < :end', { start, end });
        }

        qb.orderBy('t.date', 'DESC').skip(skip).take(limit);

        const [data, total] = await qb.getManyAndCount();
        const totalPages = Math.max(1, Math.ceil(total / limit));

        return { data, meta: { total, page, limit, totalPages } };
    }

    // ─── Monthly Summary ─────────────────────────────────────

    async getMonthlySummary(
        userId: string,
        year: number,
        month: number,
    ): Promise<{
        totalIncome: number;
        totalExpense: number;
        balance: number;
        byCategory: { categoryId: string; categoryName: string; type: string; total: number }[];
    }> {
        const start = `${year}-${String(month).padStart(2, '0')}-01`;
        const endMonth = month === 12 ? 1 : month + 1;
        const endYear = month === 12 ? year + 1 : year;
        const end = `${endYear}-${String(endMonth).padStart(2, '0')}-01`;

        const summaryRaw: { type: string; total: string }[] =
            await this.transactionRepo
                .createQueryBuilder('t')
                .select('t.type', 'type')
                .addSelect('COALESCE(SUM(t.amount), 0)', 'total')
                .where('t.userId = :userId', { userId })
                .andWhere('t.date >= :start AND t.date < :end', { start, end })
                .groupBy('t.type')
                .getRawMany();

        const totalIncome = +(
            summaryRaw.find((r) => r.type === 'income')?.total ?? 0
        );
        const totalExpense = +(
            summaryRaw.find((r) => r.type === 'expense')?.total ?? 0
        );

        const byCategoryRaw: {
            categoryId: string;
            categoryName: string;
            type: string;
            total: string;
        }[] = await this.transactionRepo
            .createQueryBuilder('t')
            .leftJoin('t.category', 'c')
            .select('c.id', 'categoryId')
            .addSelect('c.name', 'categoryName')
            .addSelect('t.type', 'type')
            .addSelect('COALESCE(SUM(t.amount), 0)', 'total')
            .where('t.userId = :userId', { userId })
            .andWhere('t.date >= :start AND t.date < :end', { start, end })
            .groupBy('c.id')
            .addGroupBy('c.name')
            .addGroupBy('t.type')
            .getRawMany();

        const byCategory = byCategoryRaw.map((r) => ({
            categoryId: r.categoryId,
            categoryName: r.categoryName,
            type: r.type,
            total: +r.total,
        }));

        return {
            totalIncome,
            totalExpense,
            balance: totalIncome - totalExpense,
            byCategory,
        };
    }
}
