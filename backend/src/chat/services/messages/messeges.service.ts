
import { Injectable, Inject } from '@nestjs/common';
import { messageDto } from 'src/chat/dto/message.dto';
import { PrismaService } from 'src/prisma/prisma.service';


@Injectable()
export class MessagesService {
    constructor(private prisma: PrismaService){}
    async getMessages (group_id: number) {
        return await this.prisma.message.findMany({
            where:{
                group_id: group_id
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
                group_id:messageDto.groupID,
                sender_id,
            }
        })
        await this.prisma.groups.update({
            where:{
                id: messageDto.groupID
            },
            data:{
                lastChange: new Date()
            }
        })
    }
}