import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthConfig } from 'src/config/auth.config';
import { ConfigService } from '@nestjs/config';

interface JwtPayload {
    sub: string;
    email: string;
    iat?: number;
    exp?: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey:
                configService.get<AuthConfig>('auth')?.jwt.access.secret,
        });
    }

    validate(payload: JwtPayload): { userId: string; email: string } {
        return { userId: payload.sub, email: payload.email };
    }
}
