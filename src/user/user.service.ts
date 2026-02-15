import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
    async create(createUserDto: CreateUserDto): Promise<User> {
        return 'This action adds a new user';
    }


    findOne(id: number) {
        return `This action returns a #${id} user`;
    }

    findOneByEmail(email: string): Promise<User>{
        return `This action returns a #${email} user`;
    }

    remove(id: number) {
        return `This action removes a #${id} user`;
    }
}
