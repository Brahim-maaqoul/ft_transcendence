import { Controller,Get,Req,Body,Res ,Post,UseGuards,Param} from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthGuard } from '@nestjs/passport';
import {UserService} from '../services/user.service'
@Controller('/v1/api/user')
export class UserController {
    constructor(private UserService :UserService) {}
    @Get('/Stats')
    @UseGuards(AuthGuard('jwt'))
    async getStats(@Res() res, @Req() request) {
        try {
          const userState = await this.UserService.getUserStats(request.query['nickname']);
            if (!userState) {
                return res.status(400).json({ message: 'User not found.' });
            }
            return res.status(200).json(userState);
        } catch (error) {
            return res.status(500).json({ message: 'An error occurred while fetching the user state.' });
        }
    }
  
    @Get('/profile')
    async getProfile(@Res() res,@Req() req)
    {
      try{
        const user = await this.UserService.getUserbyNickname(req.query['nickname'])
        if (!user) {
          return res.status(400).json({ message: 'User not found.' });
        }
        return res.status(200).json(user);
      }
      catch (error)
      {
        return res.status(500).json({ message: 'An error occurred while fetching the user state.' });
      }
    }

    @Post('/blockUser')
    @UseGuards(AuthGuard('jwt'))
    async blockUser(@Body() blockUserData, @Res() res,@Req() request) {
        try {
          const blockedUserId = request.user.auth_id
          const { blockerUserId } = blockUserData;
            const result = await this.UserService.blockUser(blockedUserId, blockerUserId);
            return res.status(200).json({ message: result });
        } catch (error) {
            return res.status(500).json({ message: 'An error occurred while blockUser the user.' });
        }
    }


    @Post('/deblocked')
    @UseGuards(AuthGuard('jwt'))
    async deblocked(@Body() deblockedData, @Res() res,@Req() request) {
        try {
          const blockedUserId = request.user.auth_id
          const { blockerUserId } = deblockedData;
          const result = await this.UserService.deblockUser(blockedUserId, blockerUserId);
          return res.status(200).json({ message: result });
        } catch (error) {
            return res.status(500).json({ message: 'An error occurred while deblocking the user.' });
        }
      }



  
    @Get("/Achievement")
    @UseGuards(AuthGuard('jwt'))
    async Achievement(@Body() Body, @Res() res,@Req() request)
    {
      const  userId = request.user.auth_id
      const userStats = await this.UserService.getUserStats(userId);
      const achievements = await this.UserService.getAllAchievements();
      const earnedAchievements = this.UserService.compareAchievements(userStats, achievements);
      return earnedAchievements;
    }

    
    @Get("/recentGames")
    RecentGames()
    {

    }

    @Get("/globalRank")
    GlobalRank()
    {

    }
    @Get("/rank")
    Rank()
    {
        
    }

    @Post("/stateMe")
    StateMe(){

    }

}
