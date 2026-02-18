import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateTaskDto {
    @IsNotEmpty()
    @IsString()
    @MaxLength(100)
    title: string;

    @IsNotEmpty()
    @IsString()
    description: string;
}
