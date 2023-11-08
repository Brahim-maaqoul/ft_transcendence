import {
  Controller,
  Get,
  Body,
  Post,
  Req,
  Res,
  UseGuards,
  Redirect,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthGoogleGuard } from './Guard/auth-google.guard';
import { updatedUser } from './dtos/updateUser.dto';

@Controller('v1/api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google')
  @UseGuards(AuthGoogleGuard)
  async googleAuth() {}

  @Get('google/callback')
  @UseGuards(AuthGoogleGuard)
  @Redirect('', 302)
  async googleAuthRedirect(@Req() req, @Res() res) {
    const userId = req.user.auth_id;
    const user = await this.authService.findUserById(userId.toString());
    const redirectUrl = req.user.firstSignIn
      ? `http://localhost:3000/${userId}/Edit`
      : user.isTfaEnabled
      ? `http://localhost:3000/tfa`
      : `http://localhost:3000/`;
    const token = this.authService.generateToken({ userId });
    res.cookie('token', token, { httpOnly: true, maxAge: 600000000000 });
    return { url: redirectUrl };
  }

  @Get('42')
  @UseGuards(AuthGuard('42'))
  async IntraAuth() {}

  @Get('42/callback')
  @UseGuards(AuthGuard('42'))
  @Redirect('', 302)
  async IntraAuthRedirect(@Req() req, @Res() res) {
    const userId = req.user.auth_id;
    const user = await this.authService.findUserById(userId.toString());
    const redirectUrl = req.user.firstSignIn
      ? `http://localhost:3000/${userId}/Edit`
      : user.isTfaEnabled
      ? `http://localhost:3000/tfa`
      : `http://localhost:3000/`;
    const token = this.authService.generateToken({ userId });
    res.cookie('token', token, { httpOnly: true, maxAge: 600000000000 });
    return { url: redirectUrl };
  }

  @Get('logout')
  logout(@Req() req, @Res() res) {
    res.clearCookie('token');
    return res.redirect('http://localhost:3000');
  }

  @Post('checkauth')
  @UseGuards(AuthGuard('jwt'))
  async checkAuthentication(@Req() request, @Res() res) {
    try {
      const user = await this.authService.findUserById(request.user.auth_id);
      return res.json({ isAuthenticated: true, user: user });
    } catch (error) {
      return res.json({ isAuthenticated: false });
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
      if (await this.authService.isNicknameUnique(updatedUser.nickname)) {
        await this.authService.updateUser(
          request.user.auth_id,
          updatedUser.nickname,
          updatedUser.displayname,
          updatedUser.picture,
          updatedUser.bio,
          false,
        );
        return res
          .status(200)
          .json({ message: 'User data updated successfully' });
      } else
        return res.status(404).json({ message: 'Nickname is already in use' });
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
}
