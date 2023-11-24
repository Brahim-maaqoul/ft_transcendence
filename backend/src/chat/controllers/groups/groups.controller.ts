import { Controller, Get, Res, Req, UseGuards, Post, Body, ValidationPipe, ParseIntPipe, Delete, Query } from '@nestjs/common';
import { GroupsService } from 'src/chat/services/groups/groups.service';
import { AuthGuard } from '@nestjs/passport';
import { groupDto } from 'src/chat/dto/group.dto';
import { memberDto } from 'src/chat/dto/member.dto';
import { joinRequest } from 'src/chat/dto/joinRequest.dto';
import { muteDto } from 'src/chat/dto/mute.dto';
import { changePrivacyDto } from 'src/chat/dto/changePrivacy.dto';

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
        const groups = this.GroupsService.createGroup(req.user.auth_id, group);
        console.log("here")
        return res.status(200).json(groups);    
    }
    @Post('/addMember')
    @UseGuards(AuthGuard('jwt'))
    async addMember(@Res() res, @Req() req, @Body(new ValidationPipe()) member:memberDto)
    {
        this.GroupsService.addMember(req.user.auth_id, member)
        return res.status(201);
    }

    @Post('/changeRole')
    @UseGuards(AuthGuard('jwt'))
    async changeRole(@Res() res, @Req() req, @Body(new ValidationPipe()) member:memberDto)
    {
        this.GroupsService.changeRole(req.user.auth_id, member)
        return res.status(201);
    }

    @Get('/memberType')
    @UseGuards(AuthGuard('jwt'))
    async getMemberType(@Res() res, @Req() req, @Query('groupId', ParseIntPipe) groupId: number)
    {
        const type = await this.GroupsService.checkAdmin(req.user.auth_id, groupId)
        return res.status(200).json({type: type});
    }

    @Get('/getMembers')
    @UseGuards(AuthGuard('jwt'))
    async getMembers(@Res() res, @Req() req, @Query('groupId', ParseIntPipe) groupId: number)
    {
        const members = await this.GroupsService.getMembers(groupId)
        return res.status(200).json(members);
    }
    
    @Delete('/deleteUser')
    @UseGuards(AuthGuard('jwt'))
    async deleteUser(@Res() res, @Req() req, @Body(new ValidationPipe()) member:memberDto)
    {
        const checkAdmin = await this.GroupsService.checkAdmin(req.user.auth_id, member.group);
        const checkMember = await this.GroupsService.checkAdmin(member.userId, member.group);
        if (checkMember === "notMember")
            return res.status(401, "not a member")
        if (checkMember === "creator")
            return res.status(401, "can't ban this user")
            if (checkAdmin === "member" || checkAdmin === "notMember" || checkAdmin === "banned")
            return res.status(401, "you,re not an admin")
        await this.GroupsService.banUser(member)
        return res.status(204, "user deleted");
    }

    @Post('/banUser')
    @UseGuards(AuthGuard('jwt'))
    async banUser(@Res() res, @Req() req, @Body(new ValidationPipe()) member:memberDto)
    {
        const checkAdmin = await this.GroupsService.checkAdmin(req.user.auth_id, member.group);
        const checkMember = await this.GroupsService.checkAdmin(member.userId, member.group);
        if (checkMember === "notMember")
            return res.status(401, "not a member")
        if (checkMember === "creator")
            return res.status(401, "can't ban this user")
        if (checkAdmin === "member" || checkAdmin === "notMember" || checkAdmin === "banned")
            return res.status(401, "you,re not an admin")
        await this.GroupsService.banUser(member)
        return res.status(201, "user banned");
    }
    @Post('/unBanUser')
    @UseGuards(AuthGuard('jwt'))
    async unBanUser(@Res() res, @Req() req, @Body(new ValidationPipe()) member:memberDto)
    {
        const checkAdmin = await this.GroupsService.checkAdmin(req.user.auth_id, member.group);
        const checkMember = await this.GroupsService.checkAdmin(member.userId, member.group);
        if (checkMember === "notMember")
            return res.status(401, "not a member")
        if (checkMember === "creator")
            return res.status(401, "can't ban this user")
            if (checkAdmin === "member" || checkAdmin === "notMember" || checkAdmin === "banned")
            return res.status(401, "you,re not an admin")
        await this.GroupsService.deleteUser(member)
        return res.status(201, "user unbanned");
    }


    @Post('/mute')
    @UseGuards(AuthGuard('jwt'))
    async mute(@Res() res, @Req() req, @Body(new ValidationPipe()) member:muteDto)
    {
        const checkAdmin = await this.GroupsService.checkAdmin(req.user.auth_id, member.group);
        const checkMember = await this.GroupsService.checkAdmin(member.userId, member.group);
        if (checkMember === "notMember")
            return res.status(401, "not a member")
        if (checkMember === "creator")
            return res.status(401, "can't ban this user")
            if (checkAdmin === "member" || checkAdmin === "notMember" || checkAdmin === "banned")
            return res.status(401, "you,re not an admin")
        await this.GroupsService.mute(member)
        return res.status(201, "user unbanned");
    }

    @Post('/unmute')
    @UseGuards(AuthGuard('jwt'))
    async unmute(@Res() res, @Req() req, @Body(new ValidationPipe()) member:memberDto)
    {
        const checkAdmin = await this.GroupsService.checkAdmin(req.user.auth_id, member.group);
        const checkMember = await this.GroupsService.checkAdmin(member.userId, member.group);
        if (checkMember === "notMember")
            return res.status(401, "not a member")
        if (checkMember === "creator")
            return res.status(401, "can't ban this user")
            if (checkAdmin === "member" || checkAdmin === "notMember" || checkAdmin === "banned")
            return res.status(401, "you,re not an admin")
        await this.GroupsService.unmute(member)
        return res.status(201, "user unbanned");
    }
    
    @Post('/joinGroup')
    @UseGuards(AuthGuard('jwt'))
    async joinGroup(@Res() res, @Req() req,@Body(new ValidationPipe()) joinRequest:joinRequest)
    {
        const checkAdmin = await this.GroupsService.checkAdmin(req.user.auth_id, joinRequest.group);
        if (checkAdmin === "banned")
            return res.status(401, "you're banned from this group");
        if (checkAdmin !== "notMember")
            return res.status(401, "you're already a member");
        await this.GroupsService.joinGroup(req.user.auth_id, joinRequest)
        return res.status(201);
    }


    @Delete('/delete')
    @UseGuards(AuthGuard('jwt'))
    async deleteGroup(@Res() res, @Req() req,@Body('groupID', ParseIntPipe) group_id:number)
    {
        const checkAdmin = await this.GroupsService.checkAdmin(req.user.auth_id, group_id);
        if (checkAdmin !== "creator")
            return res.status(401, "you're not the creator");
        await this.GroupsService.deleteGroup(group_id);
        return res.status(204);
    }
    @Delete('/quit')
    @UseGuards(AuthGuard('jwt'))
    async quitGroup(@Res() res, @Req() req,@Body('groupID', ParseIntPipe) group_id:number)
    {
        const checkAdmin = await this.GroupsService.checkAdmin(req.user.auth_id, group_id);
        if (checkAdmin === "creator")
            return res.status(401, "you're the creator");
        await this.GroupsService.quitGroup(req.user.auth_id, group_id);
        return res.status(204);
    }
    @Get('/getMembership')
    @UseGuards(AuthGuard('jwt'))
    async getMembership(@Res() res, @Req() req,@Body('groupID', ParseIntPipe) group_id:number)
    {
        const member = this.GroupsService.getMembership(req.user.auth_id, group_id)
        return res.status(200).json(member)
    }
    @Post("/changePrivacy")
    @UseGuards(AuthGuard('jwt'))
    async  changePrivacy(@Res() res, @Req() req, @Body(new ValidationPipe()) group:changePrivacyDto)
    {
        const checkAdmin = await this.GroupsService.checkAdmin(req.user.auth_id, group.group_id);
        if (checkAdmin === "creator")
            return res.status(401, "you're the creator");
        await this.GroupsService.changePrivacy(group)
        return res.status(201);
    }
}