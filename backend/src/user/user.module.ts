import { Module } from '@nestjs/common';
import { UserController } from './controlllers/user.controller';
import { UserService } from './services/user.service';
import { FriendService } from './services/friend.service';
import { FriendController } from './controlllers/friend.controller';
import { PrismaService } from 'src/prisma/prisma.service';
@Module({
  controllers: [UserController, FriendController],
  providers: [FriendService, UserService,PrismaService]
})
export class UserModule {
}
