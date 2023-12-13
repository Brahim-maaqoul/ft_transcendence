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
  ) {}

  private interval;
  private game: Game = new Game();

  @WebSocketServer() server: Server;
  async afterInit(server: Server) {}

  @UseGuards(JwtGuard)
  @SubscribeMessage('joinQueue')
  async joinQueue(client: any, payload: Data) {
    console.log('joinQueue', client.user, payload);
    if (
      client.user in this.gameSessionService.matchPlayers ||
      client.user in this.gameSessionService.botGames
    ) {
      client.emit('ERROR', 'allready in game');
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
        // TODO(): where the random data is stored as null
        await this.matchMaking.joinQueue(client.user, payload);
        return;
      }

      //   match it with the one with the same data
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
  @SubscribeMessage('gameReady')
  async gameReady(client: any, payload: { gameId: string; type: string }) {
    if (payload.type === 'Bot') {
      if (!(payload.gameId in this.gameSessionService.botGames)) {
        console.log('ERROR', 'game not found');
        // client.emit('ERROR', 'game not found');
        await this.botService.deleteBotGame(payload.gameId);
        return;
      }
      this.gameSessionService.botGames[payload.gameId].start = [true, true];
      //   console.log('gameReady', this.gameSessionService.botGames[payload.gameId])
    }
    if (payload.type === 'Duo') {
      const game = this.gameSessionService.matchPlayers[payload.gameId];
      this.gameSessionService.matchPlayers[payload.gameId].start = [
        game.playerId1 === client.user || game.start[0],
        game.playerId2 === client.user || game.start[1],
      ];
	  console.log(this.gameSessionService.matchPlayers[payload.gameId].start)
    }
  }

  @UseGuards(JwtGuard)
  @SubscribeMessage('cancel')
  async cancel(client: any) {
    console.log('emit cancel', this.gameSessionService.queuePlayers);
    this.gameSessionService.queuePlayers.erase(client.user);
    client.emit('cancelLoading');
    console.log('emit cancel', this.gameSessionService.queuePlayers);
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
        await this.botService.deleteBotGame(payload.gameId);
        return;
      }
      client.emit(
        'gameUpdate',
        this.gameSessionService.botGames[payload.gameId].get_data(0),
      );
    } else if (
      payload.type === 'Duo' &&
      payload.gameId in this.gameSessionService.matchPlayers
    ) {
      const user = this.authService.verifyToken(
        client.handshake.query.token,
      ).userId;
      this.gameSessionService.matchPlayers[payload.gameId].check_keys(
        payload.keys,
        this.gameSessionService.matchPlayers[payload.gameId].playerId1 === user
          ? 0
          : 1,
      );
      this.gameSessionService.matchPlayers[payload.gameId].update();
      if (
        this.gameSessionService.matchPlayers[payload.gameId].status ===
        'finished'
      ) {
        await this.gameend.rankDuoUpdate(payload.gameId);
        await this.matchMaking.deleteGame(payload.gameId);

        return;
      }
      const game = this.gameSessionService.matchPlayers[payload.gameId];
      //   console.log(user, game.playerId1, game.playerId2);
      this.gameSessionService.playersSocket[game.playerId1].emit(
        'gameUpdate',
        game.get_data(game.playerId1 === user ? 0 : 1),
      );
      this.gameSessionService.playersSocket[game.playerId2].emit(
        'gameUpdate',
        game.get_data(game.playerId2 === user ? 0 : 1),
      );
    }
    // if (client.id in this.gameSessionService.games){
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
    console.log(user);
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
    if (game.type == 'Bot') {
		console.log(game);
      if (this.gameSessionService.botGames[game.id].status === 'finished') {
        await this.gameend.rankBotUpdate(
          this.gameSessionService.botGames[game.id],
        );
      }
      await this.botService.deleteBotGame(game.id);
    } else if (game.type == 'Duo') {
      console.log('deleting game', game.id);
      if (this.gameSessionService.matchPlayers[game.id].status === 'finished') {
        await this.gameend.rankDuoUpdate(game.id);
      }
      await this.matchMaking.deleteGame(game.id);
    } else if (game.type == 'invite') {
      // await this.botGameService.deleteBotGame(client.id);
    }
    delete this.gameSessionService.playersInfo[game.id];
    delete this.gameSessionService.playersSocket[user];
  }
}
