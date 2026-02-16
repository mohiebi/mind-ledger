import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
    constructor(private readonly userervice: UserService) {}

    @Post()
    create(@Body() createUserDto: CreateUserDto) {
        return this.userervice.create(createUserDto);
    }

    @Get()
    findAll() {
        return this.userervice.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.userervice.findOne(+id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        return this.userervice.update(+id, updateUserDto);
    }
}
