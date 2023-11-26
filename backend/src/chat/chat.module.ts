import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { GroupsController } from './controllers/groups/groups.controller';
import { GroupsService } from './services/groups/groups.service';
import { DuoController } from './controllers/chats/chats.controller';
import { DuoService } from './services/chats/chats.service';
import { MessagesController } from './controllers/messages/messeges.controller';
import { MessagesService } from './services/messages/messeges.service';

@Module({
  controllers: [GroupsController, DuoController, MessagesController],
  providers: [PrismaService, GroupsService, DuoService,MessagesService],
  exports: [DuoService]
})
export class ChatModule {
}
