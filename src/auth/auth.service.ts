import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
    constructor(private readonly userService: UserService) { }
    async register (createUserDto: CreateUserDto): Promise<User> {
        const existingUser = await this.userService.findOneByEmail(createUserDto);

        if (existingUser) {
            throw new ConflictException('User already exists');
        }

        return await this.userService.create(createUserDto);
    }

    login() {
        return 'login';
    }
}
