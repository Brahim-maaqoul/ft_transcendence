import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Queue } from '../classes/queue.class';
import { Game } from '../classes/game.class';
import { Data } from '../interfaces/utils.interface';
import { GameSession } from './gameSession.service';
import { GameEndService } from './gameEnd.service';

@Injectable()
export class MatchMakingService {
  constructor(
    private prisma: PrismaService,
    private gameSessionService: GameSession,
	private gameend: GameEndService,
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
    // newGame.status = 'notStarted';
    newGame.time = new Date();
    newGame.start = [false, false];
    this.gameSessionService.matchPlayers[game.gameId] = newGame;
    this.gameSessionService.playersInfo[user1] = {
      type: 'Duo',
      id: String(game.gameId),
    };
    this.gameSessionService.playersInfo[user2] = {
      type: 'Duo',
      id: String(game.gameId),
    };
    return game;
  }

  async deleteGame(game: Game) {
    if (!(game.gameId in this.gameSessionService.matchPlayers)) return;
    if (game.status === 'finished') {
	  delete this.gameSessionService.matchPlayers[game.gameId];
      console.log('delete finished game from matchPlayers');
      const user1 = game.playerId1;
      const user2 = game.playerId2;
      const winner =
        game.score.p1 >
        game.score.p2
          ? user1
          : user2;
		console.log('winner', winner, user1, user2);
       await this.prisma.game.update({
        where: {
          gameId: Number(game.gameId),
        },
        data: {
          score1: game.score.p1,
          score2: game.score.p2,
          status: 'finished',
          winner: winner,
          time: new Date(),
        },
      });
      this.gameSessionService.playersSocket[
        game.playerId1
      ].emit('gameEnd');
      this.gameSessionService.playersSocket[
        game.playerId2
      ].emit('gameEnd');
	  await this.gameend.rankDuoUpdate(String(game.gameId));
      return;
    }





















    // console.log('delete uncompleted game from matchPlayers');
    // await this.prisma.game.update({
    //   where: {
    //     gameId: Number(gameId),
    //   },
    //   data: {
    //     status: 'uncompleted',
    //   },
    // });
    // if (gameId in this.gameSessionService.matchPlayers) {
    //   this.gameSessionService.playersSocket[
    //     this.gameSessionService.matchPlayers[gameId].playerId1
    //   ].emit('gameEnd');
    //   this.gameSessionService.playersSocket[
    //     this.gameSessionService.matchPlayers[gameId].playerId2
    //   ].emit('gameEnd');
    // }
  }
}
