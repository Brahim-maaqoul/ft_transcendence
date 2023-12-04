import { Logger, OnModuleInit, UnauthorizedException } from '@nestjs/common';
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse } from '@nestjs/websockets';
import { Observable, from, map } from 'rxjs';
import { Server } from 'socket.io';
import { Socket } from 'socket.io';
import { GameSession } from '../services/gameSession.service';
import { subscribe } from 'diagnostics_channel';
import { Game } from '../classes/game.class';
import { key } from '../interfaces/utils.interface';

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
	 * 
	onModuleInit() {
		// this.server.on('connection', (socket) => {
		// 	console.log(socket.id);
		// 	console.log('Connected');
		// 	// socket.emit('message', 'Hello world!');
		// })
	}
	 */

	// async afterInit() {
	// 	this.logger.log('Initialized!');
	// }

	async afterInit(server: Server) {
		// setInterval(() => {
		// 	// this.updateGames();
		// 	this.handelHelloEvent();
		// }, 1000);
		// console.log('WebSocket initialized!---------------------------------------------------------');
	}

	// @SubscribeMessage('startHelloMessages')
	// handelStartHelloMessages(client: any, payload: any) {
	// 	console.log('Received startHelloMessages event from client!');
	// 	this.interval = setInterval(() => {
	// 		client.emit('helloFromServer', 'hello from server---------------------------');
	// 	}, 9000);
	// }

	// @SubscribeMessage('stopHelloMessages')
	// handelStopHelloMessages(client: any, payload: any) {
	// 	console.log('Received stopHelloMessages event from client!');
	// 	clearInterval(this.interval);
	// }

	@SubscribeMessage('startGame')
	handelStartGame(client: any, payload: any) {
		// console.log('Received startGame event from client!');
		// if (this.game.start === false){
		// 	this.game.start = true;
		// 	// this.game.start = true;
		// 	this.gameSessionService.startBotGame(payload, client.id);
		// 	this.interval = setInterval(() => {
		// 		console.log('in game loop');
		// 		// do the calculations here 
		// 		// whene the a goal is scored clear the interval and start it again
		// 		// client.emit('gaming', this.game.get_data());
		// 		client.emit('gameUpdate', this.game.get_data());
		// 	}, 10);
		// }
	}

	@SubscribeMessage('keyGameUpdate')
	async handelKeyGameUpdate(client: any, keys: {keys: key}) {
			// for the bot game
		// if (client.id in this.gameSessionService.botGames){
		// 	this.gameSessionService.botGames[client.id].check_keys(keys.keys);
		// 	client.emit('gameUpdate', this.gameSessionService.botGames[client.id].get_data());
		// }
		// else {
		// 	await this.gameSessionService.createBotGame({playerId1: client.id, boot: true}, client.id);
		// }
		
		if (client.id in this.gameSessionService.matchPlayers){
				// error in game
				// noo i will check for the id of the player
				// so play with it 
				// await this.gameSessionService.joinQueue({playerId1: client.id, boot: false}, client.id);
				// const p1 = client.id;
				// const p2 = this.gameSessionService.matchPlayers[client.id].socket1 !== p1 ? this.gameSessionService.matchPlayers[client.id].playerId1 : this.gameSessionService.matchPlayers[client.id].playerId2;
				// this.gameSessionService.matchPlayers[p2].check_keys(keys.keys);
				// client.emit('gameUpdate', this.gameSessionService.matchPlayers[p1].get_data());
				// client.to(p2).emit('gameUpdate', this.gameSessionService.matchPlayers[p2].get_data());
			console.log('in game loop',this.gameSessionService.matchPlayers[client.id].player);
			this.gameSessionService.matchPlayers[client.id].Game.update()
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
				await this.gameSessionService.joinQueue({playerId1: client.id, boot: false}, client.id);
			}
		}

		// if (keys.keys.start === true){
		// 	;
		// }
		// this.gameSessionService.socketIo[client.id].check_keys(keys.keys);
		// client.emit('gameUpdate', this.game.get_data());
	}

	// @SubscribeMessage('stopGame')
	// handelStopGame(client: any, payload: any) {
	// 	console.log('Received stopGame event from client!');
	// 	if (this.game.start === true){
	// 		clearInterval(this.interval);
	// 		this.game.start = false;
	// 		this.server.emit('gameUpdate', this.game.get_data());
	// 	}
	// }

	// async updateGames() {
	// 	console.log('Hello world!');
	// 	// const runningGames = await this.gameSessionService.getRunningGames();
	// 	// runningGames.forEach(game => {
	// 	// 	this.server.to(game.id).emit('gameUpdate', game.getGameState());
	// 	// });
	// }

	async handleConnection(client: any, ...args: any[]) {
		const { sockets } = this.server.sockets;

		// this.logger.log(`Client id: ${client.id} connected!`);
		// this.logger.debug(`Number of connected clients: ${sockets.size}`);
	}

	async handleDisconnect(client: any) {
		console.log(`Clinet id: ${client.id} disconnected!`);
		await this.gameSessionService.deleteBotGame(client.id);
	}

	@SubscribeMessage('createBotGame')
	async createBotGame(@MessageBody() data: {playerId1: number, boot: true}, @ConnectedSocket() client: Socket): Promise<WsResponse<any>> {
		// const game = await this.gameSessionService.createBotGame(data, client.id);
		// client.join(game.gameId.toString()); // join the room it s a string 
		// // this.server.to(data.gameId).emit('gameCreated', game);
		// // return game.gameId;
		// return { event: 'gameCreated', data: game };
		return ;
	}

	// @SubscribeMessage('StartBotGame')
	// async startBotGame(@MessageBody() data: {gameId: number}, @ConnectedSocket() client: Socket): Promise<WsResponse<any>> {
	// 	// const game = await this.gameSessionService.startBotGame(data, client.id);
	// 	// this.server.to(data.gameId).emit('gameStarted', game);
	// 	// return game.gameId;
	// 	// return { event: 'gameStarted', data: game };
	// }

	// @SubscribeMessage('movePaddle')
	// async movePaddle(@MessageBody() data: {gameId: number, playerId: number, direction: string}, @ConnectedSocket() client: Socket): Promise<WsResponse<any>> {
	// 	const game = await this.gameSessionService.movePaddle(data, client.id);
	// 	// this.server.to(data.gameId).emit('gameStarted', game);
	// 	// return game.gameId;
	// 	return { event: 'gameUpdated', data: game };
	// }

	// @SubscribeMessage('gameUpdate')
	// async gameUpdate(@MessageBody() data: {gameId: number}, @ConnectedSocket() client: Socket): Promise<WsResponse<any>> {
	// 	const game = await this.gameSessionService.getGame(data.gameId);
	// 	// this.server.to(data.gameId).emit('gameStarted', game);
	// 	// return game.gameId;
	// 	return { event: 'gameUpdated', data: game };
	// }

	// rotate with an angle
	// @SubscribeMessage('rotate')
	// async rotate(@MessageBody() data: {gameId: number, playerId: number, direction: string}, @ConnectedSocket() client: Socket): Promise<WsResponse<any>> {
	// 	const game = await this.gameSessionService.rotate(data, client.id);
	// 	// this.server.to(data.gameId).emit('gameStarted', game);
	// 	// return game.gameId;
	// 	return { event: 'gameUpdated', data: game };
	// }

	// i think noo need to 
	// @SubscribeMessage('restScale')
	// async restScale(@MessageBody() data: {gameId: number, playerId: number, direction: string}, @ConnectedSocket() client: Socket): Promise<WsResponse<any>> {
	// 	const game = await this.gameSessionService.restScale(data, client.id);
	// 	// this.server.to(data.gameId).emit('gameStarted', game);
	// 	// return game.gameId;
	// 	return { event: 'gameUpdated', data: game };
	// }

	// @SubscribeMessage('move_left')
	// async move_left(@MessageBody() data: {gameId: number, playerId1: number, direction: string}, @ConnectedSocket() client: Socket): Promise<WsResponse<any>> {
	// 	// const game = await this.gameSessionService.move_left({gameId: data.gameId, speed: 1, limit: 0, whoPlay: data.playerId1});
	// 	// if (game){
	// 	// 	this.server.to(client.id).emit('gameUpdate', game);
	// 	// }
	// 	// else {
	// 	// 	throw new UnauthorizedException('no game')
	// 	// }
	// 	// // this.server.to(data.gameId).emit('gameStarted', game);
	// 	// // return game.gameId;
	// 	// return { event: 'gameUpdated', data: game };
	// 	this.game.paddle[0].move_left(1, 0);
	// 	this.server.emit('gameUpdate', this.game.get_data());
	// 	return ;
	// }

	// @SubscribeMessage('move_right')
	// async move_right(@MessageBody() data: {gameId: number, playerId1: number, direction: string}, @ConnectedSocket() client: Socket): Promise<WsResponse<any>> {
	// 	// const game = await this.gameSessionService.move_right({gameId: data.gameId, speed: 1, limit: 0, whoPlay: data.playerId1});
	// 	// if (game){
	// 	// 	this.server.to(client.id).emit('gameUpdate', game);
	// 	// }
	// 	// else {
	// 	// 	throw new UnauthorizedException('no game')
	// 	// }
	// 	// // return game.gameId;
	// 	// return { event: 'gameUpdated', data: game };
	// 	this.game.paddle[0].move_right(1, 600);
	// 	this.server.emit('gameUpdate', this.game.get_data());
	// 	return ;
	// }

	// @SubscribeMessage('rotate_neg')
	// async rotate_neg(@MessageBody() data: {gameId: number, playerId1: number, direction: string}, @ConnectedSocket() client: Socket): Promise<WsResponse<any>> {
	// 	// const game = await this.gameSessionService.rotate({gameId: data.gameId, ang: 1, whoPlay: data.playerId1});
	// 	// if (game){
	// 	// 	this.server.to(client.id).emit('gameStarted', game);
	// 	// }
	// 	// else {
	// 	// 	throw new UnauthorizedException('no game')
	// 	// }
	// 	// // return game.gameId;
	// 	// return { event: 'gameUpdated', data: game };
	// 	this.game.paddle[0].rotate(-Math.PI/6);
	// 	this.server.emit('gameUpdate', this.game.get_data());
	// 	return ;
	// }
	// @SubscribeMessage('rotate_pos')
	// async rotate_pos(@MessageBody() data: {gameId: number, playerId1: number, direction: string}, @ConnectedSocket() client: Socket): Promise<WsResponse<any>> {
	// 	// const game = await this.gameSessionService.rotate({gameId: data.gameId, ang: 1, whoPlay: data.playerId1});
	// 	// if (game){
	// 	// 	this.server.to(client.id).emit('gameStarted', game);
	// 	// }
	// 	// else {
	// 	// 	throw new UnauthorizedException('no game')
	// 	// }
	// 	// // return game.gameId;
	// 	// return { event: 'gameUpdated', data: game };
	// 	this.game.paddle[0].rotate(Math.PI/6);
	// 	this.server.emit('gameUpdate', this.game.get_data());
	// 	return ;
	// }

	// @SubscribeMessage('start_game')
	// async start_game(@MessageBody() data: {gameId: number, playerId1: number}, @ConnectedSocket() client: Socket): Promise<WsResponse<any>> {
	// 	const game = await this.gameSessionService.start_game({gameId: data.gameId, whoPlay: data.playerId1});
	// 	if (game) {
	// 		this.server.to(client.id).emit('gameStarted', game);
	// 	}
	// 	else {
	// 		throw new UnauthorizedException('no game');
	// 	}
	// 	// this.server.to(data.gameId).emit('gameStarted', game);
	// 	// return game.gameId;
	// 	return { event: 'gameUpdated', data: game };
	// }

	// // @SubscribeMessage('gameUpdate')

	// @SubscribeMessage('restScale')
	// async restScale(@MessageBody() data: {gameId: number, playerId1: number}, @ConnectedSocket() client: Socket): Promise<WsResponse<any>> {
	// 	const game = await this.gameSessionService.restScale({gameId: data.gameId, whoPlay: data.playerId1});
	// 	if (game) {
	// 		this.server.to(client.id).emit('gameUpdate', game);
	// 	}
	// 	else {
	// 		throw new UnauthorizedException('no game');
	// 	}
	// 	// this.server.to(data.gameId).emit('gameStarted', game);
	// 	// return game.gameId;
	// 	return { event: 'gameUpdated', data: game };
	// }

	// @SubscribeMessage('changeScale')
	// async changeScale(@MessageBody() data: {gameId: number, playerId1: number}, @ConnectedSocket() client: Socket): Promise<WsResponse<any>> {
	// 	// const game = this.gameSessionService.changeScale({gameId: data.gameId, scale: 1.5, whoPlay: data.playerId1});
	// 	// if (game) {
	// 	// 	this.server.to(client.id).emit('gameUpdate', game);
	// 	// }
	// 	// else {
	// 	// 	throw new UnauthorizedException('no game');
	// 	// }
	// 	// return { event: 'gameUpdated', data: game };
	// 	this.game.paddle[0].changeScale(1.5);
	// 	this.server.emit('gameUpdate', this.game.get_data());
	// 	// this.server.to(client.id).emit('gameUpdate', this.game);
	// 	return ;
	// }

	/**
		this.paddle[0].rotate(0)
		// this.paddle[0].restScale()
		if (this.keysPressed.has('a') || this.keysPressed.has('A'))
			this.paddle[0].changeScale(1.5)
		if (this.keysPressed.has("ArrowUp") || this.keysPressed.has("ArrowLeft"))
			this.paddle[0].move_left(1, 0)
		if (this.keysPressed.has("ArrowDown") || this.keysPressed.has("ArrowRight"))
			this.paddle[0].move_right(1, 600)
		if (this.keysPressed.has('x'))
			this.paddle[0].rotate(Math.PI/6)
		else if (this.keysPressed.has('c'))
			this.paddle[0].rotate(-Math.PI/6)
		// if (this.keysPressed.has('w') || this.keysPressed.has('W'))
		// 	this.paddle[1].move_left(1, 0)
		// if (this.keysPressed.has('s') || this.keysPressed.has('S'))
		// 	this.paddle[1].move_right(1, 600)
		if (this.keysPressed.has(' '))
			this.start = true
	 */


	// @SubscribeMessage('test')
	// test(@MessageBody() body: any){
	// 	console.log(body);
	// 	this.server.emit('onMessage', {
	// 		msg: 'new message',
	// 		content: body,
	// 	})
	// }

	// @SubscribeMessage('ping')
	// async handleMessage(client: any, data: any){
	// 	this.logger.log(`Message received from client id: ${client.id}`);
	// 	this.logger.debug(`Payload: ${data}`);
	// 	return {
	// 		event: 'pong',
	// 		// data: 'Wrong data that will make the test faile',
	// 		data,
	// 	};
	// }

	// @SubscribeMessage('message')
	// handleEvent(@MessageBody('id') id: number): string {
	// 	return 'Hello user: ' + id + '!';
	// }

	// @SubscribeMessage('body')
	// handleBody(@MessageBody() data: unknown): WsResponse<unknown> {
	// 	const event = 'body';
	// 	return { event, data };
	// }

	// @SubscribeMessage('game')
	// handleGame(@ConnectedSocket() client: Socket, data: string): string {
	// 	return 'starting the Game ' + client.id + ' ' + data;
	// }

	// @SubscribeMessage('events')
	// onEvent(@MessageBody() data: unknown): Observable<WsResponse<number>> {
	// 	const event = 'events';
	// 	const response = [1, 2, 3];

	// 	return from(response).pipe(map(data => ({ event, data })));
	// }

	// socket.emit('game', { name: 'Nest'}, (data) => console.log(data));
	// socket.on('events', (data) => console.log(data));
}
