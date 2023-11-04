import { Controller, Get, Res, Req } from '@nestjs/common';
import { GroupsService } from 'src/chat/services/groups/groups.service';

@Controller('/v1/api/groups')
export class GroupsController {
    constructor(private  GroupsService:GroupsService){}

    @Get() 
    async getGroups(@Res() res, @Req() req)
    {
        const groups = await this.GroupsService.getGroups(req.query['id']);
        return res.status(200).json({type: groups})          
    }
}