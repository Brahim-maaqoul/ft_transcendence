import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { GameGateway } from './gateway/game.gateway';
import { GameSession } from './services/gameSession.service';
import { JwtGuard } from 'src/auth/Guard/jwt.guard';
import { AuthService } from 'src/auth/auth.service';


@Module({
  controllers: [GameController],
  providers: [PrismaService,GameService, GameGateway, GameSession, AuthService],
})
export class GameModule {
}
