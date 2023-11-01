import { Controller,Get,Req,Body,Res ,Post,UseGuards,Delete} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FriendService } from '../services/friend.service';

@Controller('/v1/api/friends')
export class FriendController {
    constructor(private  FriendService:FriendService) {}

    @Get('/FriendStats')
    @UseGuards(AuthGuard('jwt'))
    async getFriendStats(@Res() res, @Req() req) {
        try {
        const friendType = await this.FriendService.getFriendshiptype(req.user.auth_id, req.query['id']);
        return res.status(200).json({type: friendType})
        }
        catch {
        return res.status(500).json({ message: 'An error occurred while fetching the user state.' });
        }
    }
    @Post('/addFriend')
    @UseGuards(AuthGuard('jwt'))
    async addFriend(@Body() friendData, @Res() res, @Req() request) {
        try {
            const  user1Id = request.user.auth_id
            const {auth} = friendData;
            console.log("user")
            console.log(user1Id, auth)
            const result = await this.FriendService.addFriend(user1Id, auth);
            return res.status(200).json({ message: result });
        } catch (error) {
            return  res.status(500).json({ message: 'An error occurred while adding a friend.' });
        }
    
    }

    @Post('/accepteFriend')
    @UseGuards(AuthGuard('jwt'))
    async AccepteFriend(@Body() friendData, @Res() res,@Req() request) {
      try {
        const  user1Id = request.user.auth_id
        const {auth } = friendData;
        
        const result = await this.FriendService.acceptFriend(user1Id, auth);
  
        if (result === 'Friendship request accepted successfully.') {
          return res.status(200).json({ message: result });
        } else {
          return res.status(400).json({ message: result });
        }
      } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
      }
    }

    @Delete('/unFriend')
    @UseGuards(AuthGuard('jwt'))
    async unFriend(@Body() friendData, @Res() res,@Req() request) {
      try {
        const  user1Id = request.user.auth_id
        const {auth } = friendData;
        
        const result = await this.FriendService.deleteFriend(user1Id, auth);
  
        if (result === 'Friendship deleted successfully') {
          return res.status(200).json({ message: result });
        } else {
          return res.status(401).json({ message: result });
        }
      } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
      }
    }



    @Get('/Friend')
    @UseGuards(AuthGuard('jwt'))
    async getFriends(@Body() Body, @Res() res,@Req() request) {
        try {
        const  userId = request.user.auth_id
        const friends = await this.FriendService.getFriends(userId);
        return res.status(200).json(friends);
        } catch (error) {
        return  res.status(500).json({ message: 'An error occurred while fetching friends.' });
        }
    }


}