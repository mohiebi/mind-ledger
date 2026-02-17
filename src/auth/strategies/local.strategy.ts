import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { User } from 'src/user/entities/user.entity';
import { LoginDto } from '../login.dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
    constructor(private readonly authService: AuthService) {
        super({
            usernameField: 'email',
            passwordField: 'password',
        });
    }

    public async validate(email: string, password: string): Promise<User> {
        const loginDto: LoginDto = { email, password };
        const user = await this.authService.validateUser(loginDto);

        if (!user) {
            throw new UnauthorizedException('Invalid email or password');
        }

        return user;
    }
}
