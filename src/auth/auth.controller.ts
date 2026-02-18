import {
    Controller,
    Post,
    Get,
    Body,
    UseInterceptors,
    ClassSerializerInterceptor,
    SerializeOptions,
    UseGuards,
    Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { User } from 'src/user/entities/user.entity';
import { PassportLocalGuard } from './guards/passport-local.guard';
import { PassportJwtAuthGuard } from './guards/passport-jwt.guard';
import { AuthResponse } from './auth.resoponse';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ strategy: 'excludeAll' })
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    async register(@Body() createUserDto: CreateUserDto): Promise<User> {
        return await this.authService.register(createUserDto);
    }

    @Post('login')
    @UseGuards(PassportLocalGuard)
    async login(@Request() req: { user: User }): Promise<AuthResponse> {
        return new AuthResponse({
            accessToken: await this.authService.signIn(req.user),
        });
    }

    @Get('me')
    @UseGuards(PassportJwtAuthGuard)
    getProfile(@Request() req: { user: { userId: string; email: string } }) {
        return req.user;
    }
}
