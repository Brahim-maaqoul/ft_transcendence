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

	contains(item: T): boolean {
		return this.items.includes(item);
	}
}

@Injectable()
export class GameSession {
	constructor(private prisma: PrismaService) { }

	// botGames = new Array<Game>();
	// game = new Game();
	playersInfo: Record<string, string> = {};
	queuePlayers = new Queue<string>();
	matchPlayers: Record<string, {Game: Game, player:number}> = {};

	botGames: Record<string, Game> = {};

	public async createBotGame(data: { playerId1: string,boot: boolean}, clientId: string) {// playerid2?: number, }, clientId: string) {
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
		newgame.playerId1 = data.playerId1;
		newgame.playerAI = data.boot;
		newgame.socket1 = clientId;
		// newgame.start = false;
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

	public async joinQueue(data: { playerId1: string, boot: boolean }, clientId: string) {
		// const newgame = new Game();
		// newgame.gameId = Math.floor(Math.random() * 1000);
		// newgame.playerId1 = Math.floor(Math.random() * 1000);

		if (this.queuePlayers.contains(clientId)){
			if (this.queuePlayers.size() > 1) {
				const socket1 = this.queuePlayers.dequeue();
				const socket2 = this.queuePlayers.dequeue();
				const playerId1 = this.playersInfo[socket1];
				const playerId2 = this.playersInfo[socket2];
				delete this.playersInfo[socket1];
				delete this.playersInfo[socket2];
				const newGame = new Game();
				// create the game in the database and get its id here before starting it
				// TODO(H-J): create the game in the database and get its id here before starting it
				const game = await this.prisma.game.create({
					data: {
						// user1_id: Number(playerId1),
						// user2_id: Number(playerId2),
						user1_id: playerId1,
						user2_id: playerId2,
						// winner: "notStarted",
						// score1: 0,
						// score2: 0,
						// time: newgame.time,
						// endAt: new Date(),
						// duration: game.endAt.getTime() - game.startAt.getTime(),
						// duration: game.sec,
						// duration: game.endAt.getTime() - game.startAt.g
					}
				});
				newGame.gameId = game.gameId;
				newGame.playerId1 = playerId1;
				newGame.playerId2 = playerId2;
				newGame.playerAI = data.boot;
				newGame.status = 'notStarted';
				newGame.socket1 = socket1;
				newGame.socket2 = socket2;
				newGame.time = new Date();
				// i use socket id for each player to identify them
				this.matchPlayers[socket1] = {Game:newGame, player: 0};
				this.matchPlayers[socket2] = {Game:newGame, player: 1};
				// if i wanna use the player id to identify them i need to change the following lines on other functions too
				// this.matchPlayers[playerId1] = {Game:newGame, player: 0};
				// this.matchPlayers[playerId2] = {Game:newGame, player: 1};
			}
			else {
				// console.log('one player in queue', this.queuePlayers);
			}
		}
		else {
			// console.log('insert player in queue', clientId, this.queuePlayers.size());
			this.queuePlayers.enqueue(clientId);
			this.playersInfo[clientId] = data.playerId1;
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
		// if (clientId in this.botGames){
		// 	delete this.botGames[clientId];
		// }
		if (this.queuePlayers.contains(clientId)){
			this.queuePlayers.dequeue();
		}
		// TODO: delete from the matchPlayers toooo 
		// if (this.matchPlayers[clientId]){
		if (clientId in this.matchPlayers){
			const p1 = this.matchPlayers[clientId].Game.socket1 == clientId ? this.matchPlayers[clientId].Game.socket2 : this.matchPlayers[clientId].Game.socket1;
			delete this.matchPlayers[clientId];
			delete this.matchPlayers[p1];
			// delete the two players from the matchPlayers
		}
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

	public async saveGameDatabase(game: Game) {
		const datagame = {
			user1_id: game.playerId1,
			user2_id: game.playerId2,
			score1: game.score[0],
			score2: game.score[1],
			winner: game.score[0] > game.score[1] ? game.playerId1 : game.playerId2,
			time: game.start,
			// endAt: new Date(),
			// duration: game.endAt.getTime() - game.startAt.getTime(),
			// duration: game.sec,
			// duration: game.endAt.getTime() - game.startAt.g
		}
		const startTime = new Date(); // Create a new Date object for the start time
		const savedData = await this.prisma.game.update({
			where: {
				gameId: game.gameId
			},
			data: {
				user1_id: game.playerId1,
				user2_id: game.playerId2,
				score1: game.score[0],
				score2: game.score[1],
				// time: startTime, // Assign the start time to the 'time' property
				winner: game.score[0] > game.score[1] ? String(game.playerId1) : String(game.playerId2),
			}
		});
		// return savedData;
	}
}