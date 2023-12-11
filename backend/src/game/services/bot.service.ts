import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { Game } from "../classes/game.class";
import { GameEndService } from "./gameEnd.service";

@Injectable()
export class BotService {
	constructor(private prisma: PrismaService, private gameEnd: GameEndService) {	}

	botGames: Record<string, Game> = {};

	public async createBotGame(data: { playerId1: string,boot: boolean}, clientId: string) {
		try {
			const game = await this.prisma.botGame.create({
				data: {
					user1_id: data.playerId1,
				}
			});
			const newgame = new Game();
			
			newgame.gameId = game.botGameId;
			newgame.playerId1 = data.playerId1;
			newgame.playerAI = data.boot;
			newgame.socket1 = clientId;
			this.botGames[clientId] = newgame;
			// console.log('bot game created', this.botGames[clientId]);
			// this.botGames[data.playerId1] = newgame;
		}
		catch(error){
			throw error;
		}
	}

	public async deleteBotGame(clientId: string) {
		try{
			if (clientId in this.botGames){
				// const theWinner = this.botGames[clientId].score.p1 > this.botGames[clientId].score.p2 && !unexpectedQuit ? this.botGames[clientId].playerId1 : 'bot';
				const theWinner = this.botGames[clientId].score.p1 > this.botGames[clientId].score.p2 && this.botGames[clientId].status === 'finished' ? this.botGames[clientId].playerId1 : 'bot';
				await this.prisma.botGame.update({
					where: {
						botGameId: this.botGames[clientId].gameId
					},
					data: {
						score1: this.botGames[clientId].score.p1,
						score2: this.botGames[clientId].score.p2,
						status: 'finished',
						winner: theWinner,//this.botGames[clientId].score.p1 > this.botGames[clientId].score.p2 ? this.botGames[clientId].playerId1 : 'bot',
						time: new Date()
					}
				});
				if (theWinner !== 'bot'){
					this.gameEnd.rankBotUpdate(this.botGames[clientId]);
				}
				delete this.botGames[clientId];
			}
		}
		catch (error) {
			throw error;
		}
	}

}