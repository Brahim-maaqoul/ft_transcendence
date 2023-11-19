import { Controller, Get, Res, Req, UseGuards, Post, Body, ValidationPipe, ParseIntPipe, Delete } from '@nestjs/common';
import { GroupsService } from 'src/chat/services/groups/groups.service';
import { AuthGuard } from '@nestjs/passport';
import { groupDto } from 'src/chat/dto/group.dto';
import { memberDto } from 'src/chat/dto/member.dto';
import { joinRequest } from 'src/chat/dto/joinRequest.dto';

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

    @Post('/createGroup')
    @UseGuards(AuthGuard('jwt'))
    async createGroup(@Res() res, @Req() req, @Body(new ValidationPipe()) group:groupDto)
    {
        this.GroupsService.createGroup(req.user.auth_id, group);
        return res.status(201);
    }
    @Post('/addMember')
    @UseGuards(AuthGuard('jwt'))
    async addMember(@Res() res, @Req() req, @Body(new ValidationPipe()) member:memberDto)
    {
        this.GroupsService.addMember(req.user.auth_id, member)
        return res.status(201);
    }
    @Get('/memberType')
    @UseGuards(AuthGuard('jwt'))
    async getMemberType(@Res() res, @Req() req)
    {
        const type = await this.GroupsService.checkAdmin(req.user.auth_id, req.query['groupId'])
        return res.status(200).json({type: type});
    }

    @Get('/getMembers')
    @UseGuards(AuthGuard('jwt'))
    async getMembers(@Res() res, @Req() req)
    {
        const members = await this.GroupsService.getMembers(req.query['groupId'])
        return res.status(200).json(members);
    }
    
    @Post('/banUser')
    @UseGuards(AuthGuard('jwt'))
    async banUser(@Res() res, @Req() req, @Body(new ValidationPipe()) member:memberDto)
    {
        const checkAdmin = await this.GroupsService.checkAdmin(req.user.auth_id, member.group);
        const checkMember = await this.GroupsService.checkAdmin(member.userId, member.group);
        if (checkMember === "notMember")
            return res.status(405, "not a member")
        if (checkMember === "creator")
            return res.status(405, "can't ban this user")
        if (checkAdmin === "member" || checkAdmin === "notMember")
            return res.status(405, "you,re not an admin")
        await this.GroupsService.banUser(member)
        return res.status(201, "user banned");
    }

    @Post('/joinGroup')
    @UseGuards(AuthGuard('jwt'))
    async joinGroup(@Res() res, @Req() req,@Body(new ValidationPipe()) joinRequest:joinRequest)
    {
        const checkAdmin = await this.GroupsService.checkAdmin(req.user.auth_id, joinRequest.group);
        if (checkAdmin !== "notMember")
            return res.status(405, "you're already a member");
        await this.GroupsService.joinGroup(req.user.auth_id, joinRequest)
        return res.status(201);
    }
}