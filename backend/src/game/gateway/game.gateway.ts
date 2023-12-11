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
import { key } from '../interfaces/utils.interface';
import { use } from 'passport';
import { AuthGuard } from '@nestjs/passport';
import { request } from 'http';
import { JwtGuard } from 'src/auth/Guard/jwt.guard';
import { BotService } from '../services/bot.service';
import { MatchMakingService } from '../services/matchMaking.service';
import { GameEndService } from '../services/gameEnd.service';

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
  ) {}

  private interval;
  private game: Game = new Game();

  @WebSocketServer() server: Server;

  async afterInit(server: Server) {}

  @UseGuards(JwtGuard)
  @SubscribeMessage("joinQueue")
  async joinQueue(client: any){
	if (client.user in this.matchMaking.matchPlayers){
		client.emit("ERROR");
	}
	else if () {
		await this.matchMaking.joinQueue({ playerId1: client.user, boot: false });
	}
	else {
		;
	}
  }

  //   @UseGuards(JwtGuard)
  @SubscribeMessage('keyGameUpdate')
  // TODO: add the type of game bot matchMaking invite
  async handelKeyGameUpdate(
    client: any,
    keys: { keys: key },
    status: gameStatus,
  ) {
    if (client.id in this.gameSessionService.games) {
      // bot game
      if (this.gameSessionService.games[client.id] == gameStatus.bot) {
        this.botService.botGames[client.id].update();
        if (this.botService.botGames[client.id].status === 'finished') {
          // this.gameSessionService.clients[client.id].disconnect();
          // this.handleDisconnect(this.gameSessionService.clients[client.id]);
          // await client.disconnect();
          await this.handleDisconnect(client);
          return;
        }
        this.botService.botGames[client.id].check_keys(keys.keys, 0); // the player is always 0
        client.emit(
          'gameUpdate',
          this.botService.botGames[client.id].get_data(0),
        );
      }
      // matchMaking game
      else if (
        this.gameSessionService.games[client.id] == gameStatus.matchMaking
      ) {
        if (client.id in this.matchMaking.matchPlayers) {
          this.matchMaking.matchPlayers[client.id].Game.update();
          if (
            this.matchMaking.matchPlayers[client.id].Game.status === 'finished'
          ) {
            // socket off
            await client.disconnect();
            await this.handleDisconnect(client);
            return;
          }
          this.matchMaking.matchPlayers[client.id].Game.check_keys(
            keys.keys,
            this.matchMaking.matchPlayers[client.id].player,
          );
          client.emit(
            'gameUpdate',
            this.matchMaking.matchPlayers[client.id].Game.get_data(
              this.matchMaking.matchPlayers[client.id].player,
            ),
          );
        } else {
          await this.matchMaking.createDuoGame({
            playerId1: client.handshake.query.user,
            boot: false,
          });
        }
      }
      // invite game
      else {
      }
    } else {
      // update the status of the
      this.gameSessionService.games[client.id] = gameStatus.matchMaking; // keys.gameType;
      if (this.gameSessionService.games[client.id] == gameStatus.bot) {
        await this.botService.createBotGame(
          { playerId1: client.handshake.query.user, boot: true },
          client.id,
        );
      } else if (
        this.gameSessionService.games[client.id] == gameStatus.matchMaking &&
        !(client.id in this.matchMaking.matchPlayers)
      ) {
        await this.matchMaking.joinQueue(
          { playerId1: client.handshake.query.user, boot: false },
          client.id,
        );
      }
      // else if (this.gameSessionService.games[client.handshake.query.user] == gameStatus.invite){
      // 	await this.matchMaking.joinQueue({ playerId1: client.user, boot: false }, client.handshake.query.user);
      // }
    }
  }

  // @UseGuards(JwtGuard)
  async handleConnection(client: any, ...args: any[]) {
    // console.log('connecting client id: ', client.user, client.id, client.handshake.query.user);
    this.gameSessionService.clients[client.id] = client;
    // this.gameSessionService.clients[client.handshake.query.user] = client;
  }

  // @UseGuards(JwtGuard)
  async handleDisconnect(client: any) {
    // console.log(`Clinet id: ${client.id} disconnected!`);
    if (client.id in this.gameSessionService.games) {
      if (this.gameSessionService.games[client.id] == gameStatus.bot) {
        console.log('update rank');
        await this.gameend.rankBotUpdate(this.botService.botGames[client.id]);
        await this.botService.deleteBotGame(client.id);
      } else if (
        this.gameSessionService.games[client.id] == gameStatus.matchMaking
      ) {
        console.log('delete match making');
        // await this.gameend.rankDuoUpdate(
        //   this.matchMaking.matchPlayers[client.id].Game,
        // );
        await this.matchMaking.deleteGame(client.id);
      } else if (
        this.gameSessionService.games[client.id] == gameStatus.invite
      ) {
        // await this.botGameService.deleteBotGame(client.id);
      }
      delete this.gameSessionService.games[client.id];
    }
    delete this.gameSessionService.clients[client.id];
  }
}
