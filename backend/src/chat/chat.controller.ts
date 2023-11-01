import { Controller,Get,Req,Body,Res ,Post,UseGuards,Param} from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { ChatService } from './chat.service';
import { AuthGuard } from '@nestjs/passport';


@Controller('v1/api/Chat')
export class ChatController {
    constructor(private ChatService :ChatService) {}
    @Get('/FriendsRome')
    @UseGuards(AuthGuard('jwt'))
    async getFriendsRome(@Body() Body, @Res() res,@Req() request) {
        try {
        const  userId = request.user.auth_id
        const friendRome = await this.ChatService.getFriendsRome(userId);
        return res.status(200).json(friendRome);
        } catch (error) {
        console.log(error)
        return  res.status(500).json({ message: 'An error occurred while fetching friends rome.' });
        }
    }
    @Get('/Groups')
    @UseGuards(AuthGuard('jwt'))
    async getGroup(@Body() Body, @Res() res,@Req() request) {
        try {
        const  userId = request.user.auth_id
        const groupRome = await this.ChatService.getGroup(userId);
        return res.status(200).json(groupRome);
        } catch (error) {
        return  res.status(500).json({ message: 'An error occurred while fetching group rome.' });
        }
    }
    @Post('/createGroups')
    @UseGuards(AuthGuard('jwt'))
    async createGroups(@Body() Body, @Res() res,@Req() request) {
        try {
        const  userId = request.user.auth_id
        const  {groupName,password,type} = Body
        await this.ChatService.createGroups(userId,groupName,password,type);
        return res.status(200).json({ message: 'Group created successfully' });
        } catch (error) {
        return res.status(500).json({ message: 'Failed to create the group' });
        }
    }
    @Post('/createFriendsRome')
    @UseGuards(AuthGuard('jwt'))
    async createFriendsRome(@Body() Body, @Res() res,@Req() request) {
        try {
        const  userId = request.user.auth_id
        const  {userId2} = Body
        await this.ChatService.createFriendsRome(userId,userId2);
        return res.status(200).json({ message: 'FriendsRome created successfully'});
        } catch (error) {
        return res.status(500).json({ message: 'Failed to create the FriendsRome'});
        }
    }
    @Post('/addFriendToGroup')
    @UseGuards(AuthGuard('jwt'))
    async addFriendToGroup(@Body() Body, @Res() res,@Req() request) {
        try {
        const  userId = request.user.auth_id
        const  {userId2,groupId} = Body
        await this.ChatService.addFriendToGroup(userId,userId2,groupId);
        return res.status(200).json({ message: 'Friend added to the group successfully' });
        } catch (error) {
        return res.status(500).json({ message: 'Failed to add friend to the group' });
        }
    }
    @Post('/banUserToGroup')
    @UseGuards(AuthGuard('jwt'))
    async banUserToGroup(@Body() Body, @Res() res,@Req() request) {
        try {
        const  userId = request.user.auth_id
        const {userId2,groupId} = Body
        await this.ChatService.banUserToGroup(userId,userId2,groupId);
        return res.status(200).json({ message: 'remove from group successfully' });
        } catch (error) {
        return res.status(500).json({ message: 'Failed remove from group' });
        }
    }
    @Post('/makeUserOwner')
    @UseGuards(AuthGuard('jwt'))
    async makeUserOwner(@Body() Body, @Res() res,@Req() request) {
        try {
        const  userId = request.user.auth_id
        const  {userId2,groupId} = Body
        await this.ChatService.makeUserOwner(userId,userId2,groupId);
        return res.status(200).json({ message: 'User made an owner of the group successfully' });
        } catch (error) {
            return res.status(500).json({ message: 'Failed to make the user an owner of the group' });
        }
    }
    @Post('/getMemberGroup')
    @UseGuards(AuthGuard('jwt'))
    async getMemberGroup(@Body() Body, @Res() res,@Req() request) {
        try {
        const  userId = request.user.auth_id
        const  {groupId} = Body
        const members = await this.ChatService.getMemberGroup(groupId,userId);
        return res.status(200).json({ message: 'User made an owner of the group successfully' ,members:members});
        } catch (error) {
            return res.status(500).json({ message: 'Failed to make the user an owner of the group' });
        }
    }
    @Post('/removeRome')
    @UseGuards(AuthGuard('jwt'))
    async removeRome(@Body() Body, @Res() res,@Req() request) {
        try {
        const  userId = request.user.auth_id
        const  {groupId} = Body
        await this.ChatService.removeRome(userId,groupId);
        return res.status(200).json({ message: 'remove Rome successfully' });
        } catch (error) {
            return res.status(500).json({ message: 'Failed remove Rome' });
        }
    }
    @Post('/getAllMessage')
    @UseGuards(AuthGuard('jwt'))
    async getAllMessage(@Body() Body, @Res() res,@Req() request) {
        try {
        const  userId = request.user.auth_id
        const  {groupId} = Body
        const allMessage = await this.ChatService.getAllMessagesByGroup(groupId,userId);
        return res.status(200).json({ message: 'successfully',allMessage:allMessage });
        } catch (error) {
            return res.status(500).json({ message: 'Failed to get Messages' });
        }
    }

}
