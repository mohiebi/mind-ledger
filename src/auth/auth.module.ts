import { Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LocalStrategy } from './strategies/local.strategy';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeConfigService } from 'src/config/configuration.service';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { AuthConfig } from 'src/config/auth.config';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
    imports: [
        UserModule,
        PassportModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: TypeConfigService): JwtModuleOptions => ({
                global: true,
                secret: config.get<AuthConfig>('auth')?.jwt.access.secret,
                signOptions: {
                    expiresIn: parseInt(
                        config.get<AuthConfig>('auth')?.jwt.access.expiresIn ??
                            '900s',
                    ),
                },
            }),
        }),
    ],
    providers: [AuthService, LocalStrategy, JwtStrategy],
    controllers: [AuthController],
})
export class AuthModule {}
