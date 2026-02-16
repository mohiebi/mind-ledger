import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { User } from 'src/user/entities/user.entity';
import { LoginDto } from './login.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    async register(@Body() createUserDto: CreateUserDto): Promise<User> {
        return await this.authService.register(createUserDto);
    }

    @Post('login')
    async login(@Body() loginDto: LoginDto): Promise<User> {
        return await this.authService.login(loginDto);
    }
}
