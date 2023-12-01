import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Game } from '../classes/game.class';
import { generate, queue } from 'rxjs';
import { Paddle } from '../classes/paddle.class';
import { Socket } from 'socket.io';

class Queue<T> {
	private items: T[];

	constructor() {
		this.items = [];
	}

	enqueue(item: T) {
		this.items.push(item);
	}

	dequeue(): T | undefined {
		return this.items.shift();
	}

	isEmpty(): boolean {
		return this.items.length === 0;
	}

	size(): number {
		return this.items.length;
	}
}

@Injectable()
export class GameSession {
	constructor(private prisma: PrismaService) { }

	// botGames = new Array<Game>();
	// game = new Game();
	queuePlayers = new Queue<string>();
	// queuePlayers: Queue<string>;
	matchPlayers: Record<string, Game> = {};

	botGames: Record<string, Game> = {};

	public async createBotGame(data: { playerId1: number,boot: boolean}, clientId: string) {// playerid2?: number, }, clientId: string) {
		// const game = this.prisma.gameSession.create({
		//   data: {
		// 	gameId: data.gameId,
		// 	host: clientId,
		// 	players: {
		// 	  connect: {
		// 		id: clientId
		// 	  }
		// 	}
		//   }
		// });
		// return game;


		// this.botGames = [];


		const newgame = new Game();
		
		newgame.gameId = Math.floor(Math.random() * 1000);
		newgame.playerId1 = Math.floor(Math.random() * 1000);
		newgame.playerAI = data.boot;
		newgame.socket1 = clientId;
		newgame.start = false;
		// this.botGames.push(newgame);
		this.botGames[clientId] = newgame;
		// this.game = newgame;
		// console.log('------------------------------------- create bot game size of ', this.botGames.length);
		// for (let i=0;i<this.botGames.length;i++) {
		// 	console.log('game ', this.botGames[i]);
		// }
		// this.game.gameId = this.botGames.length * Math.floor(Math.random() * 1000) + 1;
		// this.game.gameId = this.botGames[this.botGames.length - 1] ? this.botGames[this.botGames.length - 1].gameId + 1 : 1;
		// this.game.status = 'waiting';
	}

	public async joinQueue(data: { playerId1: number, boot: boolean }, clientId: string) {
		// const newgame = new Game();
		// newgame.gameId = Math.floor(Math.random() * 1000);
		// newgame.playerId1 = Math.floor(Math.random() * 1000);

		this.queuePlayers.enqueue(clientId);
		if (this.queuePlayers.size() >= 2) {
			const player1 = this.queuePlayers.dequeue();
			const player2 = this.queuePlayers.dequeue();
			const newgame = new Game();
			newgame.gameId = Math.floor(Math.random() * 1000);
			newgame.playerId1 = Math.floor(Math.random() * 1000);
			newgame.socket1 = player1;
			newgame.socket2 = player2;
			newgame.start = false;
			this.matchPlayers[player1] = newgame;
			this.matchPlayers[player2] = newgame;
		}
	}

	public async getBotGames() {
		return this.botGames;
	}

	public async deleteBotGame(clientId: string) {
		// const game = this.botGames.find(game => game.socket1 === clientId);
		// if (game) {
		// 	this.botGames.splice(this.botGames.indexOf(game), 1);
		// }
		delete this.botGames[clientId];
	}

	public async startBotGame(data: { gameId: number }, clientId: string) {
		// const game = this.runningBotGames.get(data.gameId);
		// const game = this.pendingBotGames.find(game => game.gameId === data.gameId);
		// if (game) {
		// 	game.status = 'running';
		// 	game.startAt = new Date();
		// 	this.runningBotGames.push(game);
		// 	this.pendingBotGames.splice(this.pendingBotGames.indexOf(game), 1);
		// 	const gameSession = new Game(true);
		// 	this.gameBotSessions.push(gameSession);
		// 	return game;
		// }
		// this.game.status = 'running';
		// this.game.startAt = new Date();
		// this.game.start = true;
	}

	// TODO: choose the paddle depending on the player id
	// public async move_left(data: { gameId: number, playerId: number, speed: number, limit: number}, clientId: string) {
	public async move_left(data: { gameId: number, speed: number, limit: number, whoPlay: number }) {
		const game = null;
		// const game = this.runningBotGames.find(game => game.gameId === data.gameId);
		if (game) {
			if (game.paddle[0].position.y - game.paddle[0].height / 2 >= data.limit) {
				game.paddle[0].position.y = game.paddle[0].position.y - data.speed;
				game.paddle[0].side1.position.y = game.paddle[0].side1.position.y - data.speed;
				game.paddle[0].side2.position.y = game.paddle[0].side2.position.y - data.speed;
			}
			// if (game.paddle[data.whoPlay].position.y - game.paddle[data.whoPlay].height / 2 >= data.limit) {
			// 	game.paddle[data.whoPlay].position.y = game.paddle[data.whoPlay].position.y - data.speed;
			// 	game.paddle[data.whoPlay].side1.position.y = game.paddle[data.whoPlay].side1.position.y - data.speed;
			// 	game.paddle[data.whoPlay].side2.position.y = game.paddle[data.whoPlay].side2.position.y - data.speed;
			// }
			return game;
		}
		return null;
	}

	// TODO: choose the paddle depending on the player id
	public async move_right(data: { gameId: number, speed: number, limit: number, whoPlay: number }) {
		const game = null;
		// const game = this.runningBotGames.find(game => game.gameId === data.gameId);
		if (game) {
			if (game.paddle[0].position.y + game.paddle[0].height / 2 <= data.limit) {
				game.paddle[0].position.y = game.paddle[0].position.y + data.speed;
				game.paddle[0].side1.position.y = game.paddle[0].side1.position.y + data.speed;
				game.paddle[0].side2.position.y = game.paddle[0].side2.position.y + data.speed;
			}
			// if (game.paddle[data.whoPlay].position.y + game.paddle[data.whoPlay].height / 2 <= data.limit) {
			// 	game.paddle[data.whoPlay].position.y = game.paddle[data.whoPlay].position.y + data.speed;
			// 	game.paddle[data.whoPlay].side1.position.y = game.paddle[data.whoPlay].side1.position.y + data.speed;
			// 	game.paddle[data.whoPlay].side2.position.y = game.paddle[data.whoPlay].side2.position.y + data.speed;
			// }
			return game;
		}
		return null;
	}

	public async rotate(data: { gameId: number, ang: number, whoPlay: number }) {
		const game = null;
		// const game = this.runningBotGames.find(game => game.gameId === data.gameId);
		if (game) {
			let c = (game.paddle[0].height - game.paddle[0].width) / 2 * Math.cos(-data.ang);
			let s = (game.paddle[0].height - game.paddle[0].width) / 2 * Math.sin(-data.ang);
			game.paddle[0].change_rotation(data.ang);
			game.paddle[0].side1.change_position(game.paddle[0].position.x + s, game.paddle[0].position.y + c);
			game.paddle[0].side2.change_position(game.paddle[0].position.x - s, game.paddle[0].position.y - c);
			return game;
		}
		return null;
	}

	public async changeScale(data: { gameId: number, scale: number, whoPlay: number }) {
		const game = null;
		if (game) {
			game.time = new Date();
			game.paddle[0].restScale();
			game.paddle[0].changeScale(data.scale);
			game.paddle[0].side1.change_scale(data.scale);
			game.paddle[0].side2.change_scale(data.scale);
			let c = (game.paddle[0].height - game.paddle[0].width) / 2 * Math.cos(-game.paddle[0].rotation);
			let s = (game.paddle[0].height - game.paddle[0].width) / 2 * Math.sin(-game.paddle[0].rotation);
			game.paddle[0].side1.change_position(game.paddle[0].position.x + s, game.paddle[0].position.y + c);
			game.paddle[0].side2.change_position(game.paddle[0].position.x - s, game.paddle[0].position.y - c);
			return game;
		}
		return null;
	}

	public async restScale(data: { gameId: number, whoPlay: number }) {
		const game = null;
		if (game) {
			game.paddle[0].restScale();
			game.paddle[0].side1.rest_scale();
			game.paddle[0].side2.rest_scale();
			let c = (game.paddle[0].height - game.paddle[0].width) / 2 * Math.cos(-game.paddle[0].rotation);
			let s = (game.paddle[0].height - game.paddle[0].width) / 2 * Math.sin(-game.paddle[0].rotation);
			game.paddle[0].side1.change_position(game.paddle[0].position.x + s, game.paddle[0].position.y + c);
			game.paddle[0].side2.change_position(game.paddle[0].position.x - s, game.paddle[0].position.y - c);
			return game;
		}
		return null;
	}

	public async start_game(data: { gameId: number, whoPlay: number }) {
		// if the game is in the penndign games then start it
		// const isPending = this.botGames.find(game => game.gameId === data.gameId);
		// if (isPending) {
		// 	this.botGames.push(isPending);
		// }
		// const game = this.botGames.find(game => game.gameId === data.gameId);
		// if (game) {
		// 	game.start = true;
		// 	return game;
		// }
		return null;
	}

}