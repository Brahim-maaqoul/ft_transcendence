import { Logger, OnModuleInit, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse } from '@nestjs/websockets';
import { Observable, from, map } from 'rxjs';
import { Server } from 'socket.io';
import { Socket } from 'socket.io';
import { GameSession } from '../services/gameSession.service';
import { subscribe } from 'diagnostics_channel';
import { Game } from '../classes/game.class';
import { key } from '../interfaces/utils.interface';
import { use } from 'passport';
import { AuthGuard } from '@nestjs/passport';
import { request } from 'http';
import { JwtGuard } from 'src/auth/Guard/jwt.guard';

@WebSocketGateway({
	namespace: 'Game2d',
	cors: {
   		credentials: true,
   		origin: '*',
  	},
})
// @WebSocketGateway()
// export class GameGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, OnModuleInit {
export class GameGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {//, OnModuleInit {

	constructor(private gameSessionService: GameSession) {}

	// private readonly logger = new Logger(GameGateway.name);
	private interval;
	private game: Game = new Game();

	@WebSocketServer() server: Server;

	/**
	 * onModuleInit() {
	 * 	// this.server.on('connection', (socket) => {
	 * 	// 	console.log(socket.id);
	 * 	// 	console.log('Connected');
	 * 	// 	// socket.emit('message', 'Hello world!');
	 * 	// })
	 * }
	 */

	async afterInit(server: Server) {
		// setInterval(() => {
		// 	// this.updateGames();
		// 	this.handelHelloEvent();
		// }, 1000);
		// console.log('WebSocket initialized!---------------------------------------------------------');
	}

	@UseGuards(JwtGuard)
	@SubscribeMessage('keyGameUpdate')
	async handelKeyGameUpdate(client: any, keys: {keys: key}) {
		// console.log(req.user);
			// for the bot game
		// if (client.id in this.gameSessionService.botGames){
		// 	this.gameSessionService.botGames[client.id].check_keys(keys.keys);
		// 	client.emit('gameUpdate', this.gameSessionService.botGames[client.id].get_data());
		// }
		// else {
		// 	await this.gameSessionService.createBotGame({playerId1: client.id, boot: true}, client.id);
		// }
		if (client.id in this.gameSessionService.matchPlayers){
			this.gameSessionService.matchPlayers[client.id].Game.update();
			if (this.gameSessionService.matchPlayers[client.id].Game.status === 'finished') {
				console.log('game finished saving the game in the database');
				// save the game in the database
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
			if (client.id in this.gameSessionService.queuePlayers){
				// console.log('allready waiting');
			}
			else {
				// await this.gameSessionService.joinQueue({playerId1: client.id, boot: false}, client.id);
				await this.gameSessionService.joinQueue({playerId1: client.user.userId, boot: false}, client.id);
			}
		}

	}

	@UseGuards(JwtGuard)
	async handleConnection(client: any, ...args: any[]) {
		console.log('connecting client id: ', client.user);
	}

	async handleDisconnect(client: any) {
		console.log(`Clinet id: ${client.id} disconnected!`);
		await this.gameSessionService.deleteBotGame(client.id);
	}

}
