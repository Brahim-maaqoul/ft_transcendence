import {
  Controller,
  Get,
  Body,
  Post,
  Req,
  Param,
  Res,
  UseGuards,
  Redirect,
  UnauthorizedException,
  UseFilters,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthGoogleGuard } from './Guard/auth-google.guard';
import { PrismaService } from '../prisma/prisma.service';
import { updatedUser } from './dtos/updateUser.dto';
import { ConfigService } from '@nestjs/config';

@Controller('v1/api/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Get('google')
  @UseGuards(AuthGoogleGuard)
  async googleAuth() {}

  @Get('google/callback')
  @UseGuards(AuthGoogleGuard)
  async googleAuthRedirect(@Req() req, @Res() res) {
    const userId = req.user.auth_id;
    const user = await this.authService.findUserById(userId.toString());
    if (user.isTfaEnabled) {
      this.authService.sendEmail(
        user.email,
        this.authService.generateTotpCode(user.tfaSecret),
      );
      return res.redirect(
        `${this.configService.get('FRONT_PORT')}tfa?&nickname=${
          req.user.nickname
        }`,
      );
    }
    const token = this.authService.generateToken({ userId });
    res.cookie('token', token, { httpOnly: true, maxAge: 600000000000 });
    return res.redirect(
      req.user.firstSignIn
        ? `${this.configService.get('FRONT_PORT')}Edit`
        : this.configService.get('FRONT_PORT'),
    );
  }

  @Get('42')
  @UseGuards(AuthGuard('42'))
  async IntraAuth() {}

  @Get('42/callback')
  @UseGuards(AuthGuard('42'))
  async IntraAuthRedirect(@Req() req, @Res() res) {
    const userId = req.user.auth_id;
    const user = await this.authService.findUserById(userId.toString());
    if (user.isTfaEnabled) {
      this.authService.sendEmail(
        user.email,
        this.authService.generateTotpCode(user.tfaSecret),
      );
      return res.redirect(
        `${this.configService.get('FRONT_PORT')}tfa?&nickname=${
          req.user.nickname
        }`,
      );
    }
    const token = this.authService.generateToken({ userId });
    res.cookie('token', token, { httpOnly: true, maxAge: 600000000000 });
    return res.redirect(
      req.user.firstSignIn
        ? `${this.configService.get('FRONT_PORT')}Edit`
        : this.configService.get('FRONT_PORT'),
    );
  }

  @Post('sendEmail')
  async sendEmail(@Req() req) {
    const { email, tfaSecret } = req.body.UserInfo;
    this.authService.sendEmail(
      email,
      this.authService.generateTotpCode(tfaSecret),
    );
  }

  @Get('logout')
  logout(@Req() req, @Res() res) {
    res.clearCookie('token');
    return res.redirect(this.configService.get('FRONT_PORT'));
  }

  @Get('checkAuth')
  @UseGuards(AuthGuard('jwt'))
  async checkAuthentication(@Req() request, @Res() res, @Body() body) {
    try {
      const user = await this.authService.findUserById(request.user.auth_id);
      if (!user) res.status(200).json({ isAuthenticated: false });
      return res
        .status(200)
        .json({
          isAuthenticated: true,
          user: user,
          token: request.cookies.token,
        });
    } catch {
      return res.status(200).json({ isAuthenticated: false });
    }
  }

  @Post('UpdateData')
  @UseGuards(AuthGuard('jwt'))
  async UpdateUserData(
    @Req() request,
    @Res() res,
    @Body() updatedUser: updatedUser,
  ) {
    try {
      const user = await this.authService.isNicknameUnique(
        updatedUser.nickname,
      );
      if (!user || user.auth_id === request.user.auth_id) {
        const user = await this.authService.updateUser(
          request.user.auth_id,
          updatedUser.nickname,
          updatedUser.displayname,
          updatedUser.picture,
          false,
        );
        return res.status(201).json(user);
      } else
        return res.status(404).json({ message: 'Nickname is already in use' });
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
}
