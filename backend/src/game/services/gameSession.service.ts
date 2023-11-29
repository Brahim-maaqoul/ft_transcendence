import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Game } from '../classes/game.class';
import { generate } from 'rxjs';
import { Paddle } from '../classes/paddle.class';

@Injectable()
export class GameSession {
	constructor(private prisma: PrismaService) { }

	//   private runningGames = new Map<number, any>();
	//   private gameSessions = new Map<number, any>();
	//   private runningBotGames = new Map<number, any>();
	//   private gameBotSessions = new Map<number, any>();
	//   private runningBotGames = new Array<Game>();
	//   private gameBotSessions = new Array<Game>();
	private pendingBotGames = new Array<any>();
	private runningBotGames = new Array<any>();
	private gameBotSessions = new Array<Game>();
	private game = new Game();

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
		this.game.gameId = Math.floor(Math.random() * 1000);
		this.game.playerId1 = data.playerId1;
		this.game.playerAI = data.boot;
		this.game.socket.player1Socket = clientId;
		this.game.status = 'waiting';
		// this.runningBotGames.push(game);
		// this.pendingBotGames.push(game);
	}

	public async getBotGame(gameId: number) {
		// return this.runningBotGames.get(gameId);
		return this.runningBotGames.find(game => game.gameId === gameId);
	}

	public async getBotSession(gameId: number) {
		// return this.gameBotSessions.get(gameId);
		return this.gameBotSessions.find(game => game.gameId === gameId);
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
		this.game.status = 'running';
		// this.game.startAt = new Date();
		this.game.start = true;
	}

	public async getPendingBotGames() {
		return this.pendingBotGames;
	}

	public async getRunningGames() {
		return this.runningBotGames;
	}

	// TODO: choose the paddle depending on the player id
	// public async move_left(data: { gameId: number, playerId: number, speed: number, limit: number}, clientId: string) {
	public async move_left(data: { gameId: number, speed: number, limit: number, whoPlay: number }) {
		const game = this.gameBotSessions.find(game => game.gameId === data.gameId);
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
		const game = this.gameBotSessions.find(game => game.gameId === data.gameId);
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
		const game = this.gameBotSessions.find(game => game.gameId === data.gameId);
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
		const game = this.gameBotSessions.find(game => game.gameId === data.gameId);
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
		const game = this.gameBotSessions.find(game => game.gameId === data.gameId);
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
		const isPending = this.pendingBotGames.find(game => game.gameId === data.gameId);
		if (isPending) {
			this.gameBotSessions.push(isPending);
		}
		const game = this.gameBotSessions.find(game => game.gameId === data.gameId);
		if (game) {
			game.start = true;
			return game;
		}
		return null;
	}

}