import {
  Controller,
  Get,
  Req,
  Res,
  Post,
  UseGuards,
  Body,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from '../../services/user.service';
import { getOtpAuthUrl, getqrcode } from 'src/2fa/2fa';

@Controller('/v1/api/user')
export class UserController {
  constructor(private UserService: UserService) {}
  @Get('/Stats')
  @UseGuards(AuthGuard('jwt'))
  async getStats(@Res() res, @Req() request) {
    try {
      const userState = await this.UserService.getUserStats(
        request.query['nickname'],
      );
      if (!userState) {
        return res.status(400).json({ message: 'User not found.' });
      }
      return res.status(200).json(userState);
    } catch (error) {
      return res
        .status(500)
        .json({ message: 'An error occurred while fetching the user state.' });
    }
  }

  @Post('/enableTfa')
  @UseGuards(AuthGuard('jwt'))
  async enableTfa(@Res() res, @Req() request) {
    const isEnabled = await this.UserService.enableTFA(request.user.nickname);
    if (!isEnabled) {
      return res.status(400).json({ message: 'Failed to Enable 2FA!' });
    }
    return res.status(200).json(isEnabled);
  }

  @Post('/disableTfa')
  @UseGuards(AuthGuard('jwt'))
  async disableTfa(@Res() res, @Req() request) {
    const isEnabled = await this.UserService.disableTFA(request.user.nickname);
    if (isEnabled) {
      return res.status(400).json({ message: 'Failed to Disable 2FA!' });
    }
    return res.status(200).json(isEnabled);
  }

  @Get('/tfaStatus')
  @UseGuards(AuthGuard('jwt'))
  async tfaStatus(@Res() res, @Req() request) {
    const isEnabled = await this.UserService.tfaStatus(request.user.nickname);
    return res.status(200).json(isEnabled);
  }

  @Get('/getqrcode')
  @UseGuards(AuthGuard('jwt'))
  async getqrcode(@Res() res, @Req() request) {
    const url = getOtpAuthUrl(request.user.tfaSecret, request.user.nickname);
    const qrcode = await getqrcode(request.user.tfaSecret, url);
    return res.status(200).json(qrcode);
  }

  @Get('/profile')
  async getProfile(@Res() res, @Req() req) {
    try {
      const user = await this.UserService.getUserbyNickname(
        req.query['nickname'],
      );
      if (!user) {
        return res.status(400).json({ message: 'User not found.' });
      }
      return res.status(200).json(user);
    } catch (error) {
      return res
        .status(500)
        .json({ message: 'An error occurred while fetching the user state.' });
    }
  }

  @Get('/Achievement')
  @UseGuards(AuthGuard('jwt'))
  async Achievement(@Body() Body, @Res() res, @Req() request) {
    const userId = request.user.auth_id;
    const userStats = await this.UserService.getUserStats(userId);
    const achievements = await this.UserService.getAllAchievements();
    const earnedAchievements = this.UserService.compareAchievements(
      userStats,
      achievements,
    );
    return earnedAchievements;
  }

  @Get('/recentGames')
  RecentGames() {}

  @Get('/globalRank')
  GlobalRank() {}
  @Get('/rank')
  Rank() {}

  @Post('/stateMe')
  StateMe() {}
}
