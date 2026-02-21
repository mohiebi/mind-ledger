import { IsEnum, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { TransactionType } from '../entities/transaction-type.enum';

export class CreateCategoryDto {
    @IsNotEmpty()
    @IsString()
    @MaxLength(50)
    name: string;

    @IsNotEmpty()
    @IsEnum(TransactionType)
    type: TransactionType;
}
