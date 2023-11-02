import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { generateSecret } from '../../2fa/2fa';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async tfaStatus(nickname: string) {
    try {
      const user = await this.prisma.users.findUnique({
        where: { nickname: nickname },
      });
      return user.isTfaEnabled;
    } catch (error) {
      console.log(error);
    }
  }

  async enableTFA(nickname: string) {
    try {
      const user = await this.prisma.users.update({
        where: {
          nickname: nickname,
        },
        data: {
          isTfaEnabled: true,
          tfaSecret: generateSecret(),
        },
      });
      return user.isTfaEnabled;
    } catch (error) {
      console.log(error);
    }
  }

  async disableTFA(nickname: string) {
    try {
      const user = await this.prisma.users.update({
        where: {
          nickname: nickname,
        },
        data: {
          isTfaEnabled: false,
          tfaSecret: null,
        },
      });
      return user.isTfaEnabled;
    } catch (error) {
      console.log(error);
    }
  }

  async getUserStats(nickname: string) {
    const user = await this.prisma.users.findUnique({
      where: {
        nickname: nickname,
      },
    });
    const stats = await this.prisma.stats.findUnique({
      where: {
        user_id: user.auth_id,
      },
    });
    return stats;
  }

  async getUserbyNickname(nickname: string) {
    const user = await this.prisma.users.findUnique({
      where: {
        nickname: nickname,
      },
    });
    return user;
  }
  async createDefaultAchievements() {
    try {
      const achievements = [
        {
          name: 'Top Scorer',
          description: 'Awarded to top scorers with 100 or more goals.',
          goal_scoared: 100,
          goal_conceded: 100,
          clean_sheets: 100,
        },
        {
          name: 'Goal Machine',
          description: 'Awarded to goal machines with 200 or more goals.',
          goal_scoared: 200,
          goal_conceded: 200,
          clean_sheets: 200,
        },
        {
          name: 'Iron Wall',
          description: 'Awarded to players with 50 or more clean sheets.',
          goal_scoared: 300,
          goal_conceded: 300,
          clean_sheets: 300,
        },
        {
          name: 'Defense Master',
          description:
            'Awarded to defensive masters with 10 or fewer goals conceded.',
          goal_scoared: 400,
          goal_conceded: 400,
          clean_sheets: 400,
        },
      ];

      for (const achievement of achievements) {
        await this.prisma.achievement.create({
          data: achievement,
        });
      }

      return 'Default achievements created successfully.';
    } catch (error) {
      return 'Error creating default achievements:';
    }
  }
  async compareAchievements(userStats: any, achievements: any) {
    const earnedAchievements = achievements.filter((achievement) => {
      return (
        (!achievement.goal_conceded ||
          userStats.goal_conceded >= achievement.goal_conceded) &&
        (!achievement.goal_scoared ||
          userStats.goal_scoared >= achievement.goal_scoared) &&
        (!achievement.clean_sheets ||
          userStats.clean_sheets >= achievement.clean_sheets)
      );
    });

    return earnedAchievements;
  }
  async getAllAchievements() {
    return this.prisma.achievement.findMany();
  }
}
