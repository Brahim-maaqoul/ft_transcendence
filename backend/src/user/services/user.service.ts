import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}
  
  async getUserStats(nickname: string) {
    const user = await this.prisma.users.findUnique({
      where: {
        nickname: nickname,
      }
    });
    const stats = await this.prisma.stats.findUnique({
      where: {
        user_id: user.auth_id,
      }
    });
    return stats
  }

  async getUserbyNickname(nickname: string) {
    const user = await this.prisma.users.findUnique({
      where: {
        nickname: nickname,
      }
    });
    return user
  }
  
  
  async deblockUser(blockedUserId: string, blockerUserId: string): Promise<string> {
    try {
      const existingBlock = await this.prisma.blockedUser.findMany({
        where: {
          blocked_id: blockedUserId,
          blocker_id: blockerUserId,
        },
      });
      
      if (!existingBlock[0]) {
        return 'User is not blocked.';
      }
      for (const block of existingBlock) {
        await this.prisma.blockedUser.delete({
          where: {
            block_id: block.block_id,
          },
        });
      }

      return 'User deblocked successfully.';
    } catch (error) {
      return 'An error occurred while deblocking the user.';
    }
  }
  async blockUser(blockedUserId: string, blockerUserId: string): Promise<string> {
    try {
      const existingBlock = await this.prisma.blockedUser.findFirst({
        where: {
          OR: [
            {
              blocked_id: blockedUserId,
              blocker_id: blockerUserId,
            },
            {
              blocked_id: blockerUserId,
              blocker_id: blockedUserId,
            },
          ],
        },
      });

      if (existingBlock) {
        return 'User is already blocked.';
      }
      await this.prisma.blockedUser.create({
        data: {
          blocked_id: blockedUserId,
          blocker_id: blockerUserId,
        },
      });
      return 'User blocked successfully.';
    } catch (error) {
      return 'An error occurred while blocking the user.';
    }
  }
  async  createDefaultAchievements() {
    try {
      const achievements = [
        {
          name: "Top Scorer",
          description: "Awarded to top scorers with 100 or more goals.",
          goal_scoared: 100,
          goal_conceded: 100,          
          clean_sheets : 100,   
        },
        {
          name: "Goal Machine",
          description: "Awarded to goal machines with 200 or more goals.",
          goal_scoared: 200,
          goal_conceded: 200,          
          clean_sheets : 200, 
        },
        {
          name: "Iron Wall",
          description: "Awarded to players with 50 or more clean sheets.",
          goal_scoared: 300,
          goal_conceded: 300,          
          clean_sheets : 300, 
        },
        {
          name: "Defense Master",
          description: "Awarded to defensive masters with 10 or fewer goals conceded.",
          goal_scoared: 400,
          goal_conceded: 400,          
          clean_sheets : 400, 
        },
      ];
  
      for (const achievement of achievements) {
        await this.prisma.achievement.create({
          data: achievement,
        });
      }
  
     return "Default achievements created successfully.";
    } catch (error) {
      return "Error creating default achievements:";
    }
  }
  async compareAchievements(userStats:any, achievements:any) {
    const earnedAchievements = achievements.filter((achievement) => {
      return (
        (!achievement.goal_conceded || userStats.goal_conceded >= achievement.goal_conceded) &&
        (!achievement.goal_scoared || userStats.goal_scoared >= achievement.goal_scoared) &&
        (!achievement.clean_sheets || userStats.clean_sheets >= achievement.clean_sheets)
      );
    });

    return earnedAchievements;

    
  }
  async getAllAchievements() {
    return this.prisma.achievement.findMany();
  }
}