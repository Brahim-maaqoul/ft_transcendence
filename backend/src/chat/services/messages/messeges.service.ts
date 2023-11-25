
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
            }
        })
    }
    async createMessage(sender_id:string, messageDto: messageDto)
    {
        return this.prisma.message.create({
            data:{
                sender_id,
                group_id:messageDto.groupID,
                message_text: messageDto.message,
            }
        })
    }
}