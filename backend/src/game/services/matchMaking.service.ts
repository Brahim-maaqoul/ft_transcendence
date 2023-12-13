import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Queue } from '../classes/queue.class';
import { Game } from '../classes/game.class';
import { Data } from '../interfaces/utils.interface';
import { GameSession } from './gameSession.service';

@Injectable()
export class MatchMakingService {
  constructor(
    private prisma: PrismaService,
    private gameSessionService: GameSession,
  ) {}

  // playersInfo: Record<string, string> = {};
  // gameData: Data;
  // queuePlayers = new Queue<string, Data>();
  // matchPlayers: Record<string, { Game: Game, player: number}> = {};

  public async joinQueue(gameId: string, data: Data) {
    this.gameSessionService.queuePlayers.enqueue(gameId, data);
  }

  async createDuoGame(user1: string, user2: string, data: Data) {
    const newGame = new Game();
    const game = await this.prisma.game.create({
      data: {
        user1_id: user1,
        user2_id: user2,
        map: data.map,
        dimension: data.dimension,
        option: data.option,
      },
    });
    newGame.gameId = game.gameId;
    newGame.playerId1 = user1;
    newGame.playerId2 = user2;
    newGame.playerAI = false;
    newGame.status = 'notStarted';
    newGame.time = new Date();
    newGame.start = [false, false];
    this.gameSessionService.matchPlayers[game.gameId] = newGame;
    this.gameSessionService.playersInfo[user1] = {
      type: 'Duo',
      id: String(game.gameId),
    }
    this.gameSessionService.playersInfo[user2] = {
      type: 'Duo',
      id: String(game.gameId),
    };
    return game;
  }

  async deleteGame(gameId: string) {
    if (
      gameId in this.gameSessionService.matchPlayers &&
      this.gameSessionService.matchPlayers[gameId].status === 'finished'
    ) {
      const user1 = this.gameSessionService.matchPlayers[gameId].user1_id;
      const user2 = this.gameSessionService.matchPlayers[gameId].user2_id;
      const winner =
        this.gameSessionService.matchPlayers[gameId].score1 >
        this.gameSessionService.matchPlayers[gameId].score2
          ? user1
          : user2;

      await this.prisma.game.update({
        where: {
          gameId: this.gameSessionService.matchPlayers[gameId].gameId,
        },
        data: {
          score1: this.gameSessionService.matchPlayers[gameId].score1,
          score2: this.gameSessionService.matchPlayers[gameId].score2,
          status: 'finished',
          winner: winner,
          time: new Date(),
        },
      });
      delete this.gameSessionService.matchPlayers[gameId];
      return;
    }
    await this.prisma.game.update({
      where: {
        gameId: Number(gameId),
      },
      data: {
        status: 'uncompleted',
      },
    });
  }
}
