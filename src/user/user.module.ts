import { Module } from '@nestjs/common';
import { userervice } from './user.service';
import { UserController } from './user.controller';

@Module({
  controllers: [UserController],
  providers: [userervice],
})
export class UserModule {}
