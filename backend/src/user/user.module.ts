import { Module } from '@nestjs/common';
import { UserController } from './controllers/user/user.controller';
import { FriendController } from './controllers/friend/friend.controller';
import { BlockService } from './services/block.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from './services/user.service';
import { FriendService } from './services/friend.service';
import { BlockController } from './controllers/block/block.controller';
import { DuoService } from 'src/chat/services/chats/chats.service';

@Module({
  controllers: [UserController, FriendController, BlockController],
  providers: [FriendService, UserService, PrismaService, BlockService, DuoService],
})
export class UserModule {
}
