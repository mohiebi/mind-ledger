import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FinanceController } from './finance.controller';
import { FinanceService } from './finance.service';
import { Category } from './entities/category.entity';
import { Transaction } from './entities/transaction.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Category, Transaction])],
    controllers: [FinanceController],
    providers: [FinanceService],
})
export class FinanceModule {}
