import { registerAs } from '@nestjs/config';

export interface AuthConfig {
    jwt: {
        access: { secret: string; expiresIn: string };
        refresh: { secret: string; expiresIn: string };
    };
}

export const authConfig = registerAs('auth', () => ({
    jwt: {
        access: {
            secret: process.env.JWT_ACCESS_SECRET as string,
            expiresIn: process.env.JWT_ACCESS_EXP ?? '900s',
        },
        refresh: {
            secret: process.env.JWT_REFRESH_SECRET as string,
            expiresIn: process.env.JWT_REFRESH_EXP ?? '30d',
        },
    },
}));
