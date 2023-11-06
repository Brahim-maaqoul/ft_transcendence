import { Controller, Get, Res, Req, UseGuards, Post, Body, ValidationPipe } from '@nestjs/common';
import { GroupsService } from 'src/chat/services/groups/groups.service';
import { AuthGuard } from '@nestjs/passport';
import { groupDto } from 'src/chat/dto/group.dto';
import { addMemberDto } from 'src/chat/dto/member.dto';

@Controller('/v1/api/groups')
export class GroupsController {
    constructor(private  GroupsService:GroupsService){}

    @Get('/getGroups')
    @UseGuards(AuthGuard('jwt'))
    async getGroups(@Res() res, @Req() req)
    {
        const groups = await this.GroupsService.getGroups(req.user.auth_id);
        return res.status(200).json(groups);          
    }

    @Post('/creatGroup')
    @UseGuards(AuthGuard('jwt'))
    async createGroup(@Res() res, @Req() req, @Body(new ValidationPipe()) group:groupDto)
    {
        this.GroupsService.createGroup(req.user.auth_id, group);
        return res.status(201);
    }
    @Post('/addMember')
    @UseGuards(AuthGuard('jwt'))
    async addMember(@Res() res, @Req() req, @Body(new ValidationPipe()) add_member:addMemberDto)
    {
        this.GroupsService.addMember(req.user.auth_id, add_member)
        return res.status(201);
    }
    @Post('/memberType')
    @UseGuards(AuthGuard('jwt'))
    async changeMemberType(){

    }
    
}