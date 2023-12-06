import {
  Controller,
  Get,
  Req,
  Body,
  Res,
  Post,
  UseGuards,
  Param,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../../auth/auth.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Multer } from 'multer';

@Controller('/v1/api/user')
export class UserController {
  constructor(
    private UserService: UserService,
    public authService: AuthService,
  ) {}

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

  @Get('/userByName')
  async getUsersByName(@Res() res, @Req() req) {
    const users = await this.UserService.getUsersbyName(req.query['name']);
    return res.status(200).json(users);
  }

  @Get('/rank')
  @UseGuards(AuthGuard('jwt'))
  async Rank(@Res() res) {
    const users = await this.UserService.getUsersByRank();
    return res.status(200).json(users);
  }

  @Get('/myRank')
  @UseGuards(AuthGuard('jwt'))
  async MyRank(@Res() res, @Req() req) {
    const users = await this.UserService.getUsersByRank();
    const index = users.findIndex((user) => {
      return user.user.auth_id === req.user.auth_id;
    });
    return res.status(200).json({ rank: index });
  }

  @Post('/enableTfa')
  @UseGuards(AuthGuard('jwt'))
  async enableTfa(@Res() res, @Req() request) {
    const isEnabled = await this.UserService.enableTFA(request.user.nickname);
    return res.status(200).json(isEnabled);
  }
  @Post('/disableTfa')
  @UseGuards(AuthGuard('jwt'))
  async disableTfa(@Res() res, @Req() request) {
    const isEnabled = await this.UserService.disableTFA(request.user.nickname);
    return res.status(200).json(isEnabled);
  }
  @Get('/tfaStatus')
  @UseGuards(AuthGuard('jwt'))
  async tfaStatus(@Res() res, @Req() request) {
    const isEnabled = await this.UserService.tfaStatus(request.user.nickname);
    return res.status(200).json(isEnabled);
  }
  @Post('/verifyTfa')
  async verifyTfa(@Res() res, @Req() request) {
    const isVerified = await this.UserService.verifyTfa(
      request.body.UserInfo.nickname,
      request.body.code,
    );
    if (!isVerified) {
      return res.json({ isVerified: isVerified });
    }
    const userId = request.body.UserInfo.auth_id;
    const token = this.authService.generateToken({ userId });
    res.cookie('token', token, { httpOnly: true, maxAge: 600000000000 });
    return res.json({ isVerified: isVerified });
  }
  @Get('/getUserInfo')
  async getUserInfo(@Res() res, @Req() request) {
    const nickname = request.query.nickname;
    const userInfo = await this.UserService.getUserInfo(nickname);
    return res.status(200).json({ userInfo: userInfo });
  }

  @Post('/uploadPicture')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('file'))
  async uploadProfilePicture(
    @UploadedFile() file: Multer.File,
    @Res() res,
    @Req() req,
  ) {
    try {
      await this.UserService.uploadProfilePicture(req.user.nickname, file);
    } catch (error) {}
  }
}
