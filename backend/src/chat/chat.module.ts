import { Module } from '@nestjs/common';
import { UserService } from '../user/services/user.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthService } from 'src/auth/auth.service';
import { GroupsController } from './controllers/groups/groups.controller';
import { GroupsService } from './services/groups/groups.service';

@Module({
  controllers: [GroupsController],
  providers: [PrismaService, GroupsService]
})
export class ChatModule {
}
