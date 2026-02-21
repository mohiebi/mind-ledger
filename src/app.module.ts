import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { TaskModule } from './task/task.module';
import { typeOrmConfig } from './config/database.config';
import { appConfigSchema } from './config/config.types';
import { authConfig } from './config/auth.config';
import { TypeConfigService } from './config/configuration.service';
import { User } from './user/entities/user.entity';
import { Task } from './task/entities/task.entity';
import { Category } from './finance/entities/category.entity';
import { Transaction } from './finance/entities/transaction.entity';
import { FinanceModule } from './finance/finance.module';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: TypeConfigService): TypeOrmModuleOptions => ({
                ...config.get('database'),
                entities: [Task, User, Category, Transaction],
            }),
        }),
        ConfigModule.forRoot({
            isGlobal: true,
            load: [typeOrmConfig, authConfig],
            validationSchema: appConfigSchema,
            validationOptions: { abortEarly: true },
        }),
        UserModule,
        AuthModule,
        TaskModule,
        FinanceModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
