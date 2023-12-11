import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class MatchHistoryService {
	constructor(private prisma: PrismaService) {}

	async getMatchHistory(auth_id: string) {
		try {
			return await this.prisma.game.findMany({
				where: {
					OR: [
						{
							user1_id: auth_id
						},
						{
							user2_id: auth_id
						}
					]
				},
				orderBy: {
					time: 'desc'
				}
			})
		}
		catch (error) {
			throw error;
		}
	}

	async getBotMatchHistory(auth_id: string) {
		try {
			return await this.prisma.botGame.findMany({
				where: {
					user1_id: auth_id
				},
				orderBy: {
					time: 'desc'
				}
			});
		}
		catch (error) {
			throw error;
		}
	}

	async getMatchHistoryByGameId(id: number) {
		try {
			return await this.prisma.game.findMany({
				where: {
					gameId: id
				},
				orderBy: {
					time: 'desc'
				}
			})
		}
		catch (error) {
			throw error;
		}
	}
	
	async getUserByGameId(id: string) {
		try {
			return await this.prisma.users.findUnique({
				where: {
					auth_id: id,
				}
			})
		}
		catch (error) {
			throw error;
		}
	}
}