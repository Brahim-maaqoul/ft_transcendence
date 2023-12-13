import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Game } from '../classes/game.class';
import { GameEndService } from './gameEnd.service';
import { Data } from '../interfaces/utils.interface';
import { GameSession } from './gameSession.service';

@Injectable()
export class BotService {
  constructor(
    private prisma: PrismaService,
    private gameEnd: GameEndService,
    private gameSessionService: GameSession,
  ) {}

  public async createBotGame(playerId: string, data: Data) {
    const game = await this.prisma.botGame.create({
      data: {
        user1_id: playerId,
        map: data.map,
        dimension: data.dimension,
        option: data.option,
      },
    });
    const newgame = new Game();
    newgame.gameId = game.botGameId;
    newgame.playerId1 = playerId;
    newgame.playerAI = true;
    newgame.start = [false, true];
    this.gameSessionService.botGames[game.botGameId] = newgame;
    this.gameSessionService.playersInfo[playerId] = {
      type: 'Bot',
      id: String(game.botGameId),
    };
    return game;
  }

  public async deleteBotGame(clientId: string) {
    if (
      clientId in this.gameSessionService.botGames &&
      this.gameSessionService.botGames[clientId].status === 'finished'
    ) {
      console.log('delete finished game from botGames');
      let theWinner =
        this.gameSessionService.botGames[clientId].score.p1 >
        this.gameSessionService.botGames[clientId].score.p2
          ? this.gameSessionService.botGames[clientId].playerId1
          : 'Bot';
      await this.prisma.botGame.update({
        where: {
          botGameId: this.gameSessionService.botGames[clientId].gameId,
        },
        data: {
          score1: this.gameSessionService.botGames[clientId].score.p1,
          score2: this.gameSessionService.botGames[clientId].score.p2,
          status: 'finished',
          winner: theWinner,
          time: new Date(),
        },
      });
      console.log(this.gameSessionService.botGames[clientId]);
      this.gameSessionService.playersSocket[
        this.gameSessionService.botGames[clientId].playerId1
      ].emit('gameEnd');
      delete this.gameSessionService.botGames[clientId];
      return;
    }
    console.log('delete uncompleted game from botGames');
    await this.prisma.botGame.update({
      where: {
        botGameId: Number(clientId),
      },
      data: {
        status: 'uncompleted',
      },
    });
    if (clientId in this.gameSessionService.botGames) {
      this.gameSessionService.playersSocket[
        this.gameSessionService.botGames[clientId].playerId1
      ].emit('gameEnd');
    }
  }
}
