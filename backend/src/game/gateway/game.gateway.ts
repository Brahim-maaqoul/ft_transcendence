import {
  Logger,
  OnModuleInit,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { Observable, from, map } from 'rxjs';
import { Server } from 'socket.io';
import { Socket } from 'socket.io';
import { GameSession, gameStatus } from '../services/gameSession.service';
import { subscribe } from 'diagnostics_channel';
import { Game } from '../classes/game.class';
import { Data, key } from '../interfaces/utils.interface';
import { use } from 'passport';
import { AuthGuard } from '@nestjs/passport';
import { request } from 'http';
import { JwtGuard } from 'src/auth/Guard/jwt.guard';
import { BotService } from '../services/bot.service';
import { MatchMakingService } from '../services/matchMaking.service';
import { GameEndService } from '../services/gameEnd.service';
import { type } from 'os';
import { parentPort } from 'worker_threads';
import { AuthService } from 'src/auth/auth.service';
import { plainToClass } from 'class-transformer';
import { PrismaService } from 'src/prisma/prisma.service';

@WebSocketGateway({
  namespace: 'Game2d',
  cors: {
    credentials: true,
    origin: '*',
  },
})
export class GameGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private gameSessionService: GameSession,
    private botService: BotService,
    private matchMaking: MatchMakingService,
    private gameend: GameEndService,
    private authService: AuthService,
    private prisma: PrismaService,
  ) {}

  @WebSocketServer() server: Server;
  async afterInit(server: Server) {}

  @UseGuards(JwtGuard)
  @SubscribeMessage('joinQueue')
  async joinQueue(client: any, payload: Data) {
    const gametmp = this.gameSessionService.playersInfo[client.user];
    if (
      gametmp &&
      (gametmp.id in this.gameSessionService.matchPlayers ||
        gametmp.id in this.gameSessionService.botGames)
    ) {
      client.emit('ERROR', 'you are already in a game');
      return;
    }
    client.emit('startLoading');
    if (payload.mode === 'Bot') {
      const game = await this.botService.createBotGame(client.user, payload);
      client.emit('gameStart', '/Game/Bot/' + game.botGameId);
      return;
    }
    // TODO(): here a error need to be fixed
    if (payload.mode === 'Duo') {
      if (this.gameSessionService.queuePlayers.contains(client.user)) {
        this.gameSessionService.queuePlayers.erase(client.user);
      }
      const idx = this.gameSessionService.queuePlayers.containsData(payload);
      if (idx < 0) {
        await this.matchMaking.joinQueue(client.user, payload);
        return;
      }

      const userData = this.gameSessionService.queuePlayers.getDataByIdx(idx);
      const game = await this.matchMaking.createDuoGame(
        client.user,
        userData.item,
        payload,
      );
      this.gameSessionService.playersSocket[game.user1_id].emit(
        'gameStart',
        '/Game/Duo/' + game.gameId,
      );
      this.gameSessionService.playersSocket[game.user2_id].emit(
        'gameStart',
        '/Game/Duo/' + game.gameId,
      );
      return;
    }
    client.emit('ERROR', 'not implemented yet');
    return;
  }

  @UseGuards(JwtGuard)
  @SubscribeMessage('rejoin')
  async rejoin(client: any) {
    const gametmp = this.gameSessionService.playersInfo[client.user];
    if (
      !gametmp ||
      !(
        gametmp.id in this.gameSessionService.matchPlayers ||
        gametmp.id in this.gameSessionService.botGames
      )
    ) {
      client.emit('ERROR', 'you are not in a game');
      return;
    }
    client.emit('gameStart', '/Game/' + gametmp.type + '/' + gametmp.id);
    return;
  }

  //   TODO(): check for the game like bot
  @UseGuards(JwtGuard)
  @SubscribeMessage('gameReady')
  async gameReady(client: any, payload: { gameId: string; type: string }) {
    if (payload.type === 'Bot') {
      if (!(payload.gameId in this.gameSessionService.botGames)) {
        const game = this.gameSessionService.matchPlayers[payload.gameId];

        // client.emit('ERROR', 'game not found');
        await this.botService.deleteBotGame(game);
        return;
      }
      this.gameSessionService.botGames[payload.gameId].start = [true, true];
    }
    if (payload.type === 'Duo') {
      const game = this.gameSessionService.matchPlayers[payload.gameId];
      this.gameSessionService.matchPlayers[payload.gameId].start = [
        game.playerId1 === client.user || game.start[0],
        game.playerId2 === client.user || game.start[1],
      ];
    }
  }

  @UseGuards(JwtGuard)
  @SubscribeMessage('cancel')
  async cancel(client: any) {
    this.gameSessionService.queuePlayers.erase(client.user);
    client.emit('cancelLoading');
    const gametmp = this.gameSessionService.playersInfo[client.user];
    if (gametmp) {
      if (gametmp.id in this.gameSessionService.botGames) {
        const gameStorage = this.gameSessionService.botGames[gametmp.id];
        await this.botService.deleteBotGame(gameStorage);
        return;
      }
      if (gametmp.id in this.gameSessionService.matchPlayers) {
        const gameStorage = this.gameSessionService.matchPlayers[gametmp.id];
        await this.matchMaking.deleteGameUncompleted(gameStorage, client.user);
      }
    }
  }

  @UseGuards(JwtGuard)
  @SubscribeMessage('keyGameUpdate')
  // TODO: add the type of game bot matchMaking invite
  async handelKeyGameUpdate(
    client: any,
    payload: { keys: key; gameId: string; type: string },
  ) {
    if (
      payload.type === 'Bot' &&
      payload.gameId in this.gameSessionService.botGames
    ) {
      this.gameSessionService.botGames[payload.gameId].check_keys(
        payload.keys,
        0,
      );
      this.gameSessionService.botGames[payload.gameId].update();
      if (
        this.gameSessionService.botGames[payload.gameId].status === 'finished'
      ) {
        const gameStorage =
          this.gameSessionService.botGames[payload.gameId];
		  await this.botService.deleteBotGame(gameStorage);
		  await this.botService.rankBotUpdate(gameStorage);
        return;
      }
      client.emit(
        'gameUpdate',
        this.gameSessionService.botGames[payload.gameId].get_data(0),
      );
    }

    if (
      payload.type === 'Duo' &&
      payload.gameId in this.gameSessionService.matchPlayers
    ) {
      const user = client.user;
      this.gameSessionService.matchPlayers[payload.gameId].check_keys(
        payload.keys,
        this.gameSessionService.matchPlayers[payload.gameId].playerId1 === user
          ? 0
          : 1,
      );
      this.gameSessionService.matchPlayers[payload.gameId].update();
      const game = this.gameSessionService.matchPlayers[payload.gameId];
      if (game.status === 'finished') {

        await this.matchMaking.deleteGame(game);
        return;
      }
      this.gameSessionService.playersSocket[game.playerId1].emit(
        'gameUpdate',
        game.get_data(game.playerId1 === user ? 0 : 1),
      );
      this.gameSessionService.playersSocket[game.playerId2].emit(
        'gameUpdate',
        game.get_data(game.playerId2 === user ? 0 : 1),
      );
    }
    // 	// bot game
    // 	if (this.gameSessionService.games[client.id] == gameStatus.bot){
    // 		this.botService.botGames[client.id].update();
    // 		if (this.botService.botGames[client.id].status === 'finished') {
    // 			// this.gameSessionService.clients[client.id].disconnect();
    // 			// this.handleDisconnect(this.gameSessionService.clients[client.id]);
    // 			// await client.disconnect();
    // 			await this.handleDisconnect(client);
    // 			return ;
    // 		}
    // 		this.botService.botGames[client.id].check_keys(keys.keys, 0); // the player is always 0
    // 		client.emit('gameUpdate', this.botService.botGames[client.id].get_data(0));
    // 	}
    // 	// matchMaking game
    // 	else if (this.gameSessionService.games[client.id] == gameStatus.matchMaking){
    // 		if (client.id in this.matchMaking.matchPlayers){
    // 			this.matchMaking.matchPlayers[client.id].Game.update();
    // 			if (this.matchMaking.matchPlayers[client.id].Game.status === 'finished'){
    // 				// socket off
    // 				await this.handleDisconnect(client);
    // 				await client.disconnect();
    // 				return ;
    // 			}
    // 			this.matchMaking.matchPlayers[client.id].Game.check_keys(keys.keys, this.matchMaking.matchPlayers[client.id].player);
    // 			client.emit('gameUpdate', this.matchMaking.matchPlayers[client.id].Game.get_data(this.matchMaking.matchPlayers[client.id].player));
    // 		}
    // 		else {
    // 			await this.matchMaking.createDuoGame({ playerId1: client.handshake.query.user, boot: false });
    // 		}
    // 	}
    // 	// invite game
    // 	else {
    // 	}
    // }
    // else {
    // 	// update the status of the
    // 	this.gameSessionService.games[client.id] = gameStatus.bot; // keys.gameType;
    // 	if (this.gameSessionService.games[client.id] == gameStatus.bot){
    // 		await this.botService.createBotGame({playerId1: client.handshake.query.user, boot: true}, client.id);
    // 	}
    // 	else if (this.gameSessionService.games[client.id] == gameStatus.matchMaking && !(client.id in this.matchMaking.matchPlayers)){
    // 		// await this.matchMaking.joinQueue({ playerId1: client.handshake.query.user, boot: false }, client.id);
    // 	}
    // 	// else if (this.gameSessionService.games[client.handshake.query.user] == gameStatus.invite){
    // 	// 	await this.matchMaking.joinQueue({ playerId1: client.user, boot: false }, client.handshake.query.user);
    // 	// }
    // }
  }

  @UseGuards(JwtGuard)
  async handleConnection(client: any, ...args: any[]) {
    const user = this.authService.verifyToken(
      client.handshake.query.token,
    ).userId;
    await this.prisma.users.update({
      where: {
        auth_id: user,
      },
      data: {
        status: 'online',
      },
    });
    this.gameSessionService.playersSocket[user] = client;
    // console.log('connecting client id: ', client.user, client.id, client.handshake.query.user);
    // this.gameSessionService.clients[client.id] = client;
    // this.gameSessionService.clients[client.handshake.query.user] = client;
  }

  @UseGuards(JwtGuard)
  async handleDisconnect(client: any) {
    const user = this.authService.verifyToken(
      client.handshake.query.token,
    ).userId;
    const game = this.gameSessionService.playersInfo[user];
    if (game === undefined) {
      return;
    }
    // console.log(`Clinet id: ${client.id} disconnected!`);
    if (game.type == 'Bot' && game.id in this.gameSessionService.botGames) {
		const gameStorage = this.gameSessionService.botGames[game.id];
      if (gameStorage.status === 'finished') {
        await this.botService.rankBotUpdate(gameStorage);
      }
      await this.botService.deleteBotGame(gameStorage);
    }


    if (game.type == 'Duo' && game.id in this.gameSessionService.matchPlayers) {
		const gameStorage = this.gameSessionService.matchPlayers[game.id];
      if (gameStorage.status === 'finished') {
        await this.matchMaking.rankDuoUpdate(game.id);
      }
      await this.matchMaking.deleteGameUncompleted(gameStorage, user);
    } 
	
	
	
	else if (game.type == 'invite') {
      // await this.botGameService.deleteBotGame(client.id);
    }
    if (game.id in this.gameSessionService.playersInfo)
      delete this.gameSessionService.playersInfo[game.id];
    if (user in this.gameSessionService.playersSocket)
      delete this.gameSessionService.playersSocket[user];
    await this.prisma.users.update({
      where: {
        auth_id: user,
      },
      data: {
        status: 'offline',
      },
    });
  }
}
