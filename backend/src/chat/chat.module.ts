import { Module } from '@nestjs/common';
// import { UserService } from '../user/user.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthService } from 'src/auth/auth.service';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
@Module({
  controllers: [ChatController],
  providers: [PrismaService,ChatService]
})
export class ChatModule {
}
