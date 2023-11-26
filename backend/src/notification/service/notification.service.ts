import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';


@Injectable()
export class NotificationService{
    constructor(private prisma: PrismaService){}
    getNotifications(auth_id: string)
    {
        // const notifications = this.prisma.notification.findMany({
        //     where: {
        //         receiver_id: auth_id
        //     },
        //     orderBy:{
        //         last_change: 'desc'
        //     }
        // })
    }
}