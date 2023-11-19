import { Injectable, HttpException, HttpStatus} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { groupDto } from 'src/chat/dto/group.dto';
import * as bcrypt from 'bcrypt';
import { memberDto } from '../../dto/member.dto';
import { joinRequest } from 'src/chat/dto/joinRequest.dto';

@Injectable()
export class GroupsService {
    constructor(private prisma: PrismaService){}

    async getGroups(user_id: string)
    {
        const groups = await this.prisma.groups.findMany({
            where: {
                    type: "group",
                        OR: [
                        {
                            privacy: 'public',
                        },
                        {
                            privacy: 'protected'
                        },
                        {
                            members: {
                                some: {
                                    user_id: user_id,
                                },
                            },
                        },
                    ]
              },
            orderBy: {
                lastChange: 'desc',
              },
            select:{
                id: true,
                name: true,
                type: true,
                privacy: true,
                picture: true,
                members:
                {
                    where: {
                        user_id: user_id
                    },
                    select:{
                        type: true
                        }
                }
              },
        })
        return groups;
    }
    async createGroup(creator_id: string, group:groupDto)
    {
        let hash:null|string = null;
        if (group.type === "protected")
        {
            const salt = await bcrypt.genSalt();
            hash = await bcrypt.hash(group.password, salt)
        }
        const createdGroup = await this.prisma.groups.create({
            data:
            {
                name: group.groupName,
                type: "group",
                privacy: group.type,
                password: hash,
                members:{
                    create:{
                        user_id: creator_id,
                        type: "creator",
                        banned: false,
                    }
                }
            }
        })
        return createdGroup
    }
    async checkAdmin(user_id: string, group_id : number): Promise<string>
    {
        const member = await this.prisma.members.findFirst({
            where:{
                user_id: user_id,
                group_id: group_id
            }
        })
        if (!member)
            return "notMember";
        return member.type
    }
    async addMember(creator_id: string, add_member:memberDto)
    {
        const admin = await this.checkAdmin(creator_id, add_member.group)
        if (!admin || admin === "member")
            throw new HttpException("you're not an admin!", 401);
        const member = await this.checkAdmin(add_member.userId, add_member.group)
        if (member)
           throw new HttpException("already exist", 200);
        const new_member = await this.prisma.members.create({
            data:{
                user_id: add_member.userId,
                group_id: add_member.group,
                type: "member",
                banned: false,
            }
        })
        return new_member
    }
    async getMembers(group_id: number)
    {
        const members = this.prisma.members.findMany(
        {
            where:{
                group_id: group_id
            }
        })
        return members
    }

    async banUser(member:memberDto)
    {
        const relation = await this.prisma.members.findFirst({
            where:{
                group_id: member.group,
                user_id: member.userId
            },
        })

        return await this.prisma.members.update({
            where:{
                id: relation.id
            },
            data:{
                banned: true
            }
        })
    }

    async joinGroup(user_id: string, joinRequest: joinRequest)
    {
        const group = await this.prisma.groups.findUnique(
            {
                where:{
                    id: joinRequest.group
                }
            }
        )
        if (!group || group.type !== "group")
            throw new HttpException("group doesn't exist", HttpStatus.NOT_FOUND)
        if (group.privacy === "private")
            throw new HttpException("this group is private", HttpStatus.FORBIDDEN)
        if (group.privacy === "protected")
        {
            if (!(await bcrypt.compare(joinRequest.password, group.password)))
            throw new HttpException("wrong password", HttpStatus.FORBIDDEN)
        }
        await this.prisma.members.create({
            data:{
                user_id: user_id,
                group_id: joinRequest.group,
                type: "member",
                banned: false,
            }
        })
        
    }
}
