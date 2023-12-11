import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { Queue } from "../classes/queue.class";
import { Game } from "../classes/game.class";

interface Data{
	mode: string
	dimension: string
	map: string
}

@Injectable()
export class MatchMakingService {
	constructor(private prisma: PrismaService) { }

	playersInfo: Record<string, string> = {};
	gameData: Data;
	queuePlayers = new Queue<string, Data>();
	matchPlayers: Record<string, { Game: Game, player: number }> = {};

	public async joinQueue(playerId1: string, data: Data) {
		if (this.queuePlayers.contains(playerId1)) {
			this.queuePlayers.erase(playerId1);
		}
		console.log('join queue');
		this.queuePlayers.enqueue(playerId1);
		console.log(this.queuePlayers.size());
		this.playersInfo[playerId1] = playerId1;
	}

	async createDuoGame(data: { playerId1: string, boot: boolean }):Promise<boolean> {
		if (this.queuePlayers.size() > 1) {
				console.log('create duo game');
			const socket1 = this.queuePlayers.dequeue();
			const socket2 = this.queuePlayers.dequeue();
			const playerId1 = this.playersInfo[socket1];
			const playerId2 = this.playersInfo[socket2];
			delete this.playersInfo[socket1];
			delete this.playersInfo[socket2];
			const newGame = new Game();
			const game = await this.prisma.game.create({
				data: {
					user1_id: playerId1,
					user2_id: playerId2,
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
			console.log('game created', game);
			this.matchPlayers[socket1] = {Game:newGame, player: 0};
			this.matchPlayers[socket2] = {Game:newGame, player: 1};
		}
		return true;
	}

	async deleteGame(clientId: string) {
		if (clientId in this.matchPlayers){
			const sock1 = this.matchPlayers[clientId].Game.socket1;
			const sock2 = this.matchPlayers[clientId].Game.socket2;
			const winner = this.matchPlayers[clientId].Game.score.p1 > this.matchPlayers[sock2].Game.score.p2 && this.matchPlayers[clientId].Game.status === 'finished' ? this.matchPlayers[sock1].Game.playerId1 : this.matchPlayers[sock2].Game.playerId2;
			
			await this.prisma.game.update({
				where: {
					gameId: this.matchPlayers[sock1].Game.gameId
				},
				data: {
					score1: this.matchPlayers[sock1].Game.score.p1,
					score2: this.matchPlayers[sock2].Game.score.p2,
					status: 'finished',
					winner: winner,
					time: new Date()
				}
			});

			delete this.matchPlayers[sock1];
			delete this.matchPlayers[sock2];
		}
	}

}