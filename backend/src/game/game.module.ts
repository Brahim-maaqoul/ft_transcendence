import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { GameController } from './game.controller';
import { GameService } from './game.service';


@Module({
  controllers: [GameController],
  providers: [PrismaService,GameService]
})
export class GameModule {
}
