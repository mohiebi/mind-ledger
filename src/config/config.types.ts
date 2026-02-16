import * as Joi from 'joi';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AuthConfig } from './auth.config';

export interface ConfigType {
    database: TypeOrmModuleOptions;
    auth: AuthConfig;
}

export const appConfigSchema = Joi.object({
    PORT: Joi.number().default(3000),
    POSTGRES_HOST: Joi.string().default('localhost'),
    POSTGRES_PORT: Joi.number().default(5432),
    POSTGRES_USER: Joi.string().required(),
    POSTGRES_PASSWORD: Joi.string().required(),
    POSTGRES_DB: Joi.string().required(),
    POSTGRES_SYNC: Joi.string().valid('true', 'false').default('true'),
    JWT_ACCESS_SECRET: Joi.string().required(),
    JWT_REFRESH_SECRET: Joi.string().required(),
    JWT_ACCESS_EXP: Joi.string().default('900s'),
    JWT_REFRESH_EXP: Joi.string().default('30d'),
});
