import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { GroupsController } from './controllers/groups/groups.controller';
import { GroupsService } from './services/groups/groups.service';
import { DuoController } from './controllers/chats/chats.controller';
import { DuoService } from './services/chats/chats.service';

@Module({
  controllers: [GroupsController, DuoController],
  providers: [PrismaService, GroupsService, DuoService],
  exports: [DuoService]
})
export class ChatModule {
}
