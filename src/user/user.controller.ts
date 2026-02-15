import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { userervice } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
    constructor(private readonly userervice: userervice) {}

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

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.userervice.remove(+id);
    }
}
