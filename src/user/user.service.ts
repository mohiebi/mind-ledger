import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';


@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}
    private readonly SALT_ROUNDS = 10;

    public async create(createUserDto: CreateUserDto): Promise<User> {
        const hashedPassword = await this.hashPassword(createUserDto.password);
        const user = this.userRepository.create({
            ...createUserDto,
            password: hashedPassword,
        });
        return await this.userRepository.save(user);
    }

    // findOne(id: number) {
    //     return `This action returns a #${id} user`;
    // }

    public async findOneByEmail(email: string): Promise<User | null> {
        return this.userRepository.findOneBy({ email });
    }

    // remove(id: number) {
    //     return `This action removes a #${id} user`;
    // }

    public async hashPassword(password: string): Promise<string> {
        return await bcrypt.hash(password, this.SALT_ROUNDS);
    }

    public async verifyPassword(
        password: string,
        hashedPassword: string,
    ): Promise<boolean> {
        return await bcrypt.compare(password, hashedPassword);
    }
}
