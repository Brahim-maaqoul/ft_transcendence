import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class FriendService {
    constructor(private prisma: PrismaService){}
    async getFriendshiptype(user1Id: string, user2Id: string): Promise<string> {
        if(user1Id === user2Id)
            return "empty";
            const block = await this.prisma.blockedUser.findFirst({
              where: {
                OR: [
                  {
                    blocker_id: user1Id,
                    blocked_id: user2Id,
                  },
                  {
                    blocker_id: user2Id,
                    blocked_id: user1Id,
                  },
                ],
              },
            });

          if (block)
          {
            if (block.blocker_id == user1Id)
              return "blocking";
            else
              return "blocked"
          }
          const existingFriendship = await this.prisma.friends.findFirst({
            where: {
              OR: [
                {
                  user1_id: user1Id,
                  user2_id: user2Id,
                },
                {
                  user1_id: user2Id,
                  user2_id: user1Id,
                },
              ],
            },
          });
        if (!existingFriendship)
          return ("not friend")
        if (existingFriendship.status == "accepted")
          return "friend"
        if (existingFriendship.user1_id == user1Id)
          return "pending"
        return "waiting"
    
    }

    async addFriend(user1Id: string, user2Id: string): Promise<string> {
        try {
          console.log("here");
          if(user1Id === user2Id)
            throw new Error('An error  from id user');
          const existingFriendship = await this.prisma.friends.findFirst({
            where: {
              OR: [
                {
                  user1_id: user1Id,
                  user2_id: user2Id,
                },
                {
                  user1_id: user2Id,
                  user2_id: user1Id,
                },
              ],
            },
          });

          if (existingFriendship) {
            return 'Friendship already exists.';
          }
          await this.prisma.friends.create({
            data: {
              user1_id: user1Id,
              user2_id: user2Id,
              status: 'pending', // Set an initial status if needed
            },
          });
    
          return 'Friendship request sent successfully.';
        } catch (error) {
          return 'An error occurred while adding a friend.';
        }
      }
      async getFriends(userId: string) {
        try {
          const Friends = await this.prisma.friends.findMany({
            where: {
              OR: [
                { user1_id: userId, 
                  status: 'accepted' 
                },
                { 
                  user2_id: userId,
                  status: 'accepted' 
                },
              ],
            },
          });
      
          const friendIds = Friends.map((friendship) =>
            friendship.user1_id === userId ? friendship.user2_id : friendship.user1_id
          );
      
          const friendDetails = await this.prisma.users.findMany({
            where: {
              auth_id: {
                in: friendIds,
              },
            },
          });
      
          return friendDetails;
        } catch (error) {
          console.error("Error in getFriends:", error);
          throw new Error('An error occurred while fetching friends.');
        }
      }

      async acceptFriend(user1Id: string, user2Id: string): Promise<string> {
        try {

          const friendship = await this.prisma.friends.findFirst({
            where: {
                  user1_id: user2Id,
                  user2_id: user1Id,
                  status: 'pending', 
            }
          });
    
          if (!friendship) {
            return 'Friendship request not found or already accepted.';
          }
          await this.prisma.friends.update({
            where: {
              friendship_id: friendship.friendship_id,
            },
            data: {
              status: 'accepted',
            },
          });
    
          return 'Friendship request accepted successfully.';
        } catch (error) {
          return 'An error occurred while accepting the friend request.';
        }
      }

      async deleteFriend(user1Id: string, user2Id: string): Promise<string> {
        try {
          const existingFriendship = await this.prisma.friends.findFirst({
            where: {
              OR: [
                {
                  user1_id: user1Id,
                  user2_id: user2Id,
                },
                {
                  user1_id: user2Id,
                  user2_id: user1Id,
                },
              ],
            },
          });

          if (!existingFriendship) {
            return 'Friendship request not found';
          }
          
          const friendship = await this.prisma.friends.delete({
            where: {
              friendship_id: existingFriendship.friendship_id
            }
          });
          return 'Friendship deleted successfully';
        } catch (error) {
          return 'An error occurred while accepting the friend request.';
        }
      }

}