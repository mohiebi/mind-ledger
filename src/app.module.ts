import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { TasksModule } from './tasks/tasks.module';
import { typeOrmConfig } from './config/database.config';
import { appConfigSchema } from './config/config.types';
import { authConfig } from './config/auth.config';
import { TypeConfigService } from './config/configuration.service';
import { User } from './users/entities/user.entity';
import { Task } from './tasks/entities/task.entity';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: TypeConfigService): TypeOrmModuleOptions => {
                return {
                    ...config.get<TypeOrmModuleOptions>('database'),
                    entities: [Task, User],
                };
            },
        }),
        ConfigModule.forRoot({
            isGlobal: true,
            load: [typeOrmConfig, authConfig],
            validationSchema: appConfigSchema,
            validationOptions: { abortEarly: true },
        }),
        UsersModule,
        TasksModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
