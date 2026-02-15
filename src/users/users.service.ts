import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
    create(createUserDto: CreateUserDto): User {
        return ;
    }

    findAll() {
        return `This action returns all users`;
    }

    findOne(id: string): User {
        return `This action returns a #${id} user`;
    }

    update(id: string, updateUserDto: UpdateUserDto) {
        return `This action updates a #${id} user`;
    }

    remove(id: string): User {
        return `This action removes a #${id} user`;
    }
}
