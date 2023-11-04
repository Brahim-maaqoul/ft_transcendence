import { Injectable, HttpException, HttpStatus} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { group } from 'console';

@Injectable()
export class GroupsService {
    constructor(private prisma: PrismaService){}

    async getGroups(user_id: string)
    {
        const groups = this.prisma.groups.findMany()
        {

        }
                
        console.log(groups);
    }
}
