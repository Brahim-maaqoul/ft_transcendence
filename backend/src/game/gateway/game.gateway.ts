import { Logger, OnModuleInit, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse } from '@nestjs/websockets';
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

@WebSocketGateway({
	namespace: 'Game2d',
	cors: {
		credentials: true,
		origin: '*',
	},
})
export class GameGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

	constructor(private gameSessionService: GameSession, private botService: BotService, private matchMaking: MatchMakingService) { }

	private interval;
	private game: Game = new Game();

	@WebSocketServer() server: Server;

	async afterInit(server: Server) { }

	@UseGuards(JwtGuard)
	@SubscribeMessage('keyGameUpdate')
	// TODO: add the type of game bot matchMaking invite
	async handelKeyGameUpdate(client: any, keys: { keys: key }, status: gameStatus) {
			// for the bot game
		// if (client.id in this.gameSessionService.botGames){
		// 	this.gameSessionService.botGames[client.id].check_keys(keys.keys);
		// 	client.emit('gameUpdate', this.gameSessionService.botGames[client.id].get_data());
		// }
		// else {
		// 	await this.gameSessionService.createBotGame({playerId1: client.id, boot: true}, client.id);
		// }
		
		if (client.id in this.gameSessionService.matchPlayers) {
			this.gameSessionService.matchPlayers[client.id].Game.update();
			if (this.gameSessionService.matchPlayers[client.id].Game.status === 'finished') {
				await this.gameSessionService.saveGameDatabase(this.gameSessionService.matchPlayers[client.id].Game);
				// stop the game
				// delete this.gameSessionService.matchPlayers[client.id];
				// delete this.gameSessionService.matchPlayers[this.gameSessionService.matchPlayers[client.id].Game.socket1];
				// delete this.gameSessionService.matchPlayers[this.gameSessionService.matchPlayers[client.id].Game.socket2];
				// TODO: rematch the game if he chose to rematch
			}
			this.gameSessionService.matchPlayers[client.id].Game.check_keys(keys.keys, this.gameSessionService.matchPlayers[client.id].player);
			client.emit('gameUpdate', this.gameSessionService.matchPlayers[client.id].Game.get_data(this.gameSessionService.matchPlayers[client.id].player));
			// const p2 = this.gameSessionService.matchPlayers[client.id].Game.socket1 === client.id ? this.gameSessionService.matchPlayers[client.id].Game.socket2 : this.gameSessionService.matchPlayers[client.id].Game.socket1;
			// client.to(p2).emit('gameUpdate', this.gameSessionService.matchPlayers[p2].Game.get_data());
		}
		else {
			if (client.id in this.gameSessionService.queuePlayers) {
				// console.log('allready waiting');
			}
			else {
				await this.gameSessionService.joinQueue({ playerId1: client.user, boot: false }, client.id);
			}
		}
		
		if (client.id in this.gameSessionService.games){
			// bot game
			if (this.gameSessionService.games[client.id] == gameStatus.bot){
				this.botService.botGames[client.id].update();
				if (this.botService.botGames[client.id].status === 'finished') {
					// this.gameSessionService.clients[client.id].disconnect();
					// this.handleDisconnect(this.gameSessionService.clients[client.id]);
					client.disconnect();
					this.handleDisconnect(client);
				}
				this.botService.botGames[client.id].check_keys(keys.keys, 0); // the player is always 0
				client.emit('gameUpdate', this.botService.botGames[client.id].get_data(0));
			}
			// matchMaking game
			else if (this.gameSessionService.games[client.id] == gameStatus.matchMaking && client.id in this.matchMaking.matchPlayers){
				this.matchMaking.matchPlayers[client.id].Game.update();
				if (this.matchMaking.matchPlayers[client.id].Game.status === 'finished'){
					// this.gameSessionService.clients[client.id].disconnect();
					// this.handleDisconnect(this.gameSessionService.clients[client.id]);
					client.disconnect();
					this.handleDisconnect(client);
				}
				this.matchMaking.matchPlayers[client.id].Game.check_keys(keys.keys, this.matchMaking.matchPlayers[client.id].player);
				client.emit('gameUpdate', this.matchMaking.matchPlayers[client.id].Game.get_data(this.matchMaking.matchPlayers[client.id].player));
				;
			}
			// invite game
			else {
				;
			}
		}
		else {
			// update the status of the 
			this.gameSessionService.games[client.id] = gameStatus.matchMaking; // keys.gameType;
			if (this.gameSessionService.games[client.id] == gameStatus.bot){
				await this.botService.createBotGame({playerId1: client.user, boot: true}, client.id);
			}
			else if (this.gameSessionService.games[client.id] == gameStatus.matchMaking && !(client.id in this.matchMaking.matchPlayers)){
				await this.matchMaking.joinQueue({ playerId1: client.user, boot: false }, client.id);
			}
			// else if (this.gameSessionService.games[client.id] == gameStatus.invite){
			// 	await this.matchMaking.joinQueue({ playerId1: client.user, boot: false }, client.id);
			// }
		}

	}

	@UseGuards(JwtGuard)
	async handleConnection(client: any, ...args: any[]) {
		// console.log('connecting client id: ', client.user, client.id, client.handshake.query.user);
		this.gameSessionService.clients[client.id] = client;
	}

	@UseGuards(JwtGuard)
	async handleDisconnect(client: any) {
		// console.log(`Clinet id: ${client.id} disconnected!`);
		if (client.id in this.gameSessionService.games){
			if (this.gameSessionService.games[client.id] == gameStatus.bot){
				await this.botService.deleteBotGame(client.id);
			}
			else if (this.gameSessionService.games[client.id] == gameStatus.matchMaking){
				// await this..deleteBotGame(client.id);
				await this.matchMaking.deleteGame(client.id);
			}
			else if (this.gameSessionService.games[client.id] == gameStatus.invite){
				// await this.botGameService.deleteBotGame(client.id);
			}
			delete this.gameSessionService.games[client.id];
		}
		delete this.gameSessionService.clients[client.id];
	}

}
