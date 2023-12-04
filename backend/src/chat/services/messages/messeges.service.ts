
import { Injectable } from '@nestjs/common';
import { messageDto } from 'src/chat/dto/message.dto';
import { PrismaService } from 'src/prisma/prisma.service';


@Injectable()
export class MessagesService {
    constructor(private prisma: PrismaService){}
    async getMessages (group_id: number, auth_id: string) {
        return await this.prisma.message.findMany({
            where:{
                group_id: group_id,
                NOT:{
                    sender:
                    {
                        auth_id: auth_id
                    }
                }
            },
            orderBy: {
                lastmodif: 'desc',
            }
        })
    }
    async createMessage(sender_id:string, messageDto: messageDto)
    {
        const message = await this.prisma.message.create({
            data:{
                message_text: messageDto.message,
                group_id:messageDto.groupId,
                sender_id,
            }
        })
        await this.prisma.groups.update({
            where:{
                id: messageDto.groupId
            },
            data:{
                lastChange: new Date()
            }
        })
    }
}