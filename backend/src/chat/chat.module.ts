import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { GroupsController } from './controllers/groups/groups.controller';
import { GroupsService } from './services/groups/groups.service';

@Module({
  controllers: [GroupsController],
  providers: [PrismaService, GroupsService]
})
export class ChatModule {
}
