import {
    Controller,
    Get,
    Post,
    Body,
    Query,
    UseGuards,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { FinanceService } from './finance.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { GetTransactionsQueryDto } from './dto/get-transactions-query.dto';
import { MonthlySummaryQueryDto } from './dto/monthly-summary-query.dto';
import { PassportJwtAuthGuard } from 'src/auth/guards/passport-jwt.guard';
import {
    CurrentUser,
    type JwtPayload,
} from 'src/auth/decorators/current-user.decorator';

@Controller('finance')
@UseGuards(PassportJwtAuthGuard)
export class FinanceController {
    constructor(private readonly financeService: FinanceService) {}

    // ─── Categories ──────────────────────────────────────────

    @Post('categories')
    @HttpCode(HttpStatus.CREATED)
    createCategory(
        @CurrentUser() user: JwtPayload,
        @Body() dto: CreateCategoryDto,
    ) {
        return this.financeService.createCategory(user.userId, dto);
    }

    @Get('categories')
    getCategories(@CurrentUser() user: JwtPayload) {
        return this.financeService.getCategories(user.userId);
    }

    // ─── Transactions ────────────────────────────────────────

    @Post('transactions')
    @HttpCode(HttpStatus.CREATED)
    createTransaction(
        @CurrentUser() user: JwtPayload,
        @Body() dto: CreateTransactionDto,
    ) {
        return this.financeService.createTransaction(user.userId, dto);
    }

    @Get('transactions')
    getTransactions(
        @CurrentUser() user: JwtPayload,
        @Query() query: GetTransactionsQueryDto,
    ) {
        return this.financeService.getTransactions(user.userId, query);
    }

    // ─── Summary ─────────────────────────────────────────────

    @Get('summary')
    getMonthlySummary(
        @CurrentUser() user: JwtPayload,
        @Query() query: MonthlySummaryQueryDto,
    ) {
        return this.financeService.getMonthlySummary(
            user.userId,
            query.year,
            query.month,
        );
    }
}
