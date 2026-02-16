import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { TaskModule } from './task/task.module';
import { typeOrmConfig } from './config/database.config';
import { appConfigSchema } from './config/config.types';
import { authConfig } from './config/auth.config';
import { TypeConfigService } from './config/configuration.service';
import { User } from './user/entities/user.entity';
import { Task } from './task/entities/task.entity';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: TypeConfigService): TypeOrmModuleOptions => ({
                ...config.get('database'),
                entities: [Task, User],
            }),
        }),
        ConfigModule.forRoot({
            isGlobal: true,
            load: [typeOrmConfig, authConfig],
            validationSchema: appConfigSchema,
            validationOptions: { abortEarly: true },
        }),
        UserModule,
        TaskModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
