import { Injectable,NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}
  
  async getFriendsRome(userId: string)  :Promise<any> {
    const user = await this.prisma.users.findUnique({
      where: { auth_id: userId },
    });

    if (!user) {
      throw new NotFoundException( 'User not found');
    }
    const friendRome = await this.prisma.group.findMany({
      where: {
        type: "userfromuser",
        members: { 
          some: {
            userId: userId,
          },
        },
      },
      select: {
        id: true,
        name: true,
        picture:true,
      },
    });
    return friendRome;
  }
  async getGroup(userId: string): Promise<any> {
  const user = await this.prisma.users.findUnique({
    where: { auth_id: userId },
  });

  if (!user) {
    throw new NotFoundException('User not found');
  }

  const groups = await this.prisma.group.findMany({
    where: {
      type: "group",
      OR: [
        {
          Privacy: 'public',
        },
        {
          Privacy: 'protected',
        },
        {
          AND: [
            {
              Privacy: 'private',
            },
            {
              members: {
                some: {
                  userId: userId,
                },
              },
            },
          ],
        },
      ],
    },
    select: {
      id: true,
      name: true,
      picture: true,
      timestamp:true,
      Privacy:true,
      messages: {
        select: {
          timestamp: true
        },
        orderBy: {
          timestamp: 'desc'
        },
        take: 1
      }
    },
  });

  // Now, groups will contain an array of groups with the last message date.
  return groups;
}
  async createFriendsRome(userId1: string, userId2: string): Promise<any> {
    const user1 = await this.prisma.users.findUnique({
      where: { auth_id: userId1 },
    });

    const user2 = await this.prisma.users.findUnique({
      where: { auth_id: userId2 },
    });

    if (!user1 || !user2) {
      throw new NotFoundException('One or both users not found');
    }

    const BlockList = await this.prisma.blockedUser.findFirst({
      where: {
        OR: [
          {
            blocked_id: userId1,
            blocker_id: userId2,
          },
          {
            blocked_id: userId2,
            blocker_id: userId1,
          },
        ],
      },
    });

    if (BlockList) {
      throw new NotFoundException('One of the users has blocked the other');
    }
    const existingFriendsRome = await this.prisma.group.findFirst({
      where: {
        type: 'userfromuser',
        AND: [
          {
            members: {
              some: {
                userId: userId1,
              },
            },
          },
          {
            members: {
              some: {
                userId: userId2,
              },
            },
          },
        ],
      },
      select: {
        id: true,
        name: true,
        picture:true
      },
    });

    if (existingFriendsRome) {
      return existingFriendsRome; 
    }

    const friendsRome = await this.prisma.group.create({
      data: {
        name: user2.displayname,
        type: 'userfromuser',
        Privacy:'private',
        picture: user2.picture,
        members: {
          create: [
            { userId: userId1, isAdmin: true },
            { userId: userId2, isAdmin: true },
          ],
        },
      },
    });

    return friendsRome;
  }

  async createGroups(userId1: string, groupName: string, password: string,type:string) :Promise<any>{
   
    let hashedPassword: string | null = null;
    if (type === 'protected' ) {
      hashedPassword = await bcrypt.hash(password, 10);
    }
    const newGroup = await this.prisma.group.create({
      data: {
        name: groupName, 
        type: 'group', 
        password: hashedPassword,
        Privacy : type,
        members: {
          create: [
            {
              userId: userId1,
              isAdmin: true, 
            },
          ],
        },
      },
    });
    return newGroup;
  }
  async addFriendToGroup(userId1: string, userId2: string, groupId: number): Promise<void> {
    const isAdminUser1 = await this.prisma.member.findFirst({
      where: {
        userId: userId1,
        groupId: groupId,
        isAdmin: true,
      },
    });

    console.log("isAdminUser1",isAdminUser1)
    if (!isAdminUser1) {
      throw new NotFoundException('User1 is not an admin of the group');
    }
    const user2 = await this.prisma.users.findUnique({
      where: { auth_id: userId2 },
    });

    if (!user2) {
      throw new NotFoundException('User2 not found');
    }

    const isUser2Member = await this.prisma.member.findFirst({
      where: {
        userId: userId2,
        groupId: groupId,
      },
    });

    if (isUser2Member) {
      throw new NotFoundException('User2 is already a member of the group');
    }


    await this.prisma.member.create({
      data: {
        userId: userId2,
        groupId: groupId,
        isAdmin: false,
      },
    });
  }
  async banUserToGroup(userId1: string, userId2: string, groupId: number): Promise<void> {
    const isAdminUser1 = await this.prisma.member.findFirst({
      where: {
        userId: userId1,
        groupId: groupId,
        isAdmin: true,
      },
    });

    if (!isAdminUser1) {
      throw new NotFoundException('User1 is not an admin of the group');
    }

    const isMemberUser2 = await this.prisma.member.findFirst({
      where: {
        userId: userId2,
        groupId: groupId,
      },
    });

    if (!isMemberUser2) {
      throw new NotFoundException('User2 is not a member of the group');
    }
    await this.prisma.member.delete({
      where: { id: isMemberUser2.id },
    });
  }
  async makeUserOwner(userId1: string, userId2: string, groupId: number): Promise<void> {
    const isAdminUser1 = await this.prisma.member.findFirst({
      where: {
        userId: userId1,
        groupId: groupId,
        isAdmin: true,
      },
    });

    if (!isAdminUser1) {
      throw new NotFoundException('User1 is not an admin of the group');
    }
    const isMemberUser2 = await this.prisma.member.findFirst({
      where: {
        userId: userId2,
        groupId: groupId,
      },
    });

    if (!isMemberUser2) {
      throw new NotFoundException('User2 is not a member of the group');
    }
    await this.prisma.member.updateMany({
      where: {
        userId: userId2,
        groupId: groupId,
      },
      data: {
        isAdmin: true,
      },
    });
  }
  async getMemberGroup(groupId: number,userId:string): Promise<any> {
    const isMemberUser = await this.prisma.member.findFirst({
      where: {
        userId: userId,
        groupId: groupId,
      },
    });

    if (!isMemberUser) {
      throw new NotFoundException('User2 is not a member of the group');
    }
    const members = await this.prisma.member.findMany({
      where: {
        groupId,
      },
      select: {
        user: {
          select: {
            auth_id: true,
            displayname: true, 
            nickname: true,    
            picture: true, 
          },
        },
      },
    });

    if (!members) {
      throw new NotFoundException('No members found for the specified group');
    }
    return members;
  }


  async removeRome(userId: string, groupId: number): Promise<any> {
    const isAdminUser = await this.prisma.member.findFirst({
      where: {
        userId: userId,
        groupId: groupId,
        isAdmin: true,
      },
    });

    if (!isAdminUser) {
      throw new NotFoundException('User is not an admin of the FriendsRome group');
    }
    const removedfrommessage =  await this.prisma.message.deleteMany({
      where: {
        groupId: groupId,
      },
    });
  
    const removedfromember =  await this.prisma.member.deleteMany({
      where: {
        groupId: groupId,
      },
    });
    console.log("removedfrommessage",removedfrommessage)
    if (!removedfrommessage ||  !removedfromember ) {
      throw new NotFoundException('removed from member feild');
    }
    const removedfromGroup = await this.prisma.group.delete({
      where: { id: groupId },
    });
    return removedfromGroup;
  }



  async createMessage(senderId: string, groupId: number, messageText: string) {
    return this.prisma.message.create({
      data: {
        senderId,
        groupId,
        messageText,
      },
    });
  }
  
 async getAllMessagesByGroup(groupIds: string, userId: string) {
  const groupId = parseInt(groupIds, 10);
  
  if (groupIds.trim() !== groupId.toString()) {
    throw new NotFoundException('Failed to get Messages');
  }

  // Check if the group exists
  const group = await this.prisma.group.findUnique({
    where: {
      id: groupId,
    },
  });

  if (!group) {
    throw new NotFoundException('Group not found');
  }

  // If the group's Privacy is 'public' or the user is a member, fetch messages
  if (group.Privacy === 'public' || group.type ==='userfromuser'  || (group.Privacy === 'private' || group.Privacy === 'protected')) {
    const isMember = await this.prisma.member.findFirst({
      where: {
        groupId,
        userId,
      },
    });

    if (group.Privacy === 'public' || isMember) {
      const messages = await this.prisma.message.findMany({
        where: {
          groupId,
        },
        orderBy: {
          timestamp: 'asc',
        },
      });

      return messages;
    }
  }

  throw new NotFoundException('User is not a member of the group');
}
 async jounGroup(userId:string ,groupId:number ,password:string,type:string)
  {
    const user = await this.prisma.users.findUnique({
      where: { auth_id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }
    const group = await this.prisma.group.findFirst({
      where: {
        id: groupId,
      },
    });

    if (!group) {
      throw new NotFoundException('Group not found');
    }

    if (group.type === 'userfromuser') {
      throw new NotFoundException('Group not found');
    }

    if (group.Privacy === 'protected') {
      if (!password) {
        throw new NotFoundException('Password is required');
      }

      const isPasswordValid = await bcrypt.compare(password, group.password);
      console.log("isPasswordValid",isPasswordValid)

      if (!isPasswordValid) {
        throw new NotFoundException('Invalid password');
      }
    }

    const isMember = await this.prisma.member.findFirst({
      where: {
        groupId: group.id,
        userId: userId,
      },
    });

    if (isMember) {
      throw new NotFoundException('User is already a member of the group');
    }

    await this.prisma.member.create({
      data: {
        groupId: group.id,
        userId: userId,
        isAdmin: false,
      },
    });

    return group;

  }
  async checkMember(userId:string ,groupId:number)
  {
    const user = await this.prisma.users.findUnique({
      where: { auth_id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }
    const group = await this.prisma.group.findFirst({
      where: {
        id: groupId,
      },
    });

    if (!group) {
      throw new NotFoundException('Group not found');
    }

    if (group.type === 'userfromuser') {
      throw new NotFoundException('Group not found');
    }

    const isMember = await this.prisma.member.findFirst({
      where: {
        groupId: group.id,
        userId: userId,
      },
    });


    return isMember;
  }
}