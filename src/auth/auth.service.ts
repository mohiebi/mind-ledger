/* eslint-disable prettier/prettier */
import {
    Body,
    ConflictException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { LoginDto } from './login.dto';

@Injectable()
export class AuthService {
    constructor(private readonly userService: UserService) {}

    async register(createUserDto: CreateUserDto): Promise<User> {
        const existingUser = await this.userService.findOneByEmail(createUserDto.email);

        if (existingUser) {
            throw new ConflictException('User already exists');
        }

        const user = await this.userService.create(createUserDto);
        return user
    }

    async login(@Body() loginDto: LoginDto): Promise<User> {
        const user = await this.userService.findOneByEmail(loginDto.email);

        if (!user) {
            throw new UnauthorizedException('Invalid email or password');
        }

        const passwordValid = await this.userService.verifyPassword(
            loginDto.password,
            user.password,
        );

        if (!passwordValid) {
            throw new UnauthorizedException('Invalid email or password');
        }

        return user;
    }
}
