import { Controller, Get,Body,Post, Req,Param, Res, UseGuards, Redirect,UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthGoogleGuard } from './Guard/auth-google.guard';
import { PrismaService } from '../prisma/prisma.service';
import {updatedUser} from './dtos/updateUser.dto'

@Controller('v1/api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google')
  @UseGuards(AuthGoogleGuard)
  async googleAuth(@Req() req) {}

  @Get('google/callback')
  @UseGuards(AuthGoogleGuard)
  @Redirect('', 302)
  async googleAuthRedirect(@Req() req, @Res() res) {
    const userId =  req.user.auth_id ;
    let user = await this.authService.findUserById(userId.toString())
    const  redirectUrl =  req.user.firstSignIn ?`http://localhost:3000/${userId}/Edit`: `http://localhost:3000/`;
    const token = this.authService.generateToken({ userId });
    res.cookie('token', token, { httpOnly: true, maxAge: 600000000000 });
    return { url: redirectUrl };
  }

  @Get('42')
  @UseGuards(AuthGuard('42'))
  async IntraAuth(@Req() req) {}

  @Get('42/callback')
  @UseGuards(AuthGuard('42'))
  @Redirect('', 302)
  async IntraAuthRedirect(@Req() req, @Res() res) {
    const userId =  req.user.auth_id ;
    let user = await this.authService.findUserById(userId.toString())
    const  redirectUrl =  req.user.firstSignIn ?`http://localhost:3000/${userId}/Edit`: `http://localhost:3000/`;
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
  async checkAuthentication( @Req() request, @Res() res,@Body() body) {
    try {
      let user = await this.authService.findUserById(request.user.auth_id)
      return res.status(200).json({ isAuthenticated: true , user :user});
    } catch (error) {
      return res.status(200).json({ isAuthenticated: false });
    }
  }

  @Post('UpdateData')
  @UseGuards(AuthGuard('jwt'))
  async UpdateUserData(@Req() request, @Res() res, @Body() updatedUser:updatedUser) {
    try{
      if(await this.authService.isNicknameUnique(updatedUser.nickname))
      {
        await this.authService.updateUser(request.user.auth_id,updatedUser.nickname,updatedUser.displayname,updatedUser.picture,updatedUser.bio,false);
        return res.status(200).json({ message: 'User data updated successfully' });
      }
      else
        return res.status(404).json({ message: 'Nickname is already in use' });
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
  
  @Get('UpdateData')
  @UseGuards(AuthGuard('jwt'))
  async UpdateUserData1(@Req() request, @Res() res, @Body() updatedUser:updatedUser) {
    try{
      if(await this.authService.isNicknameUnique(updatedUser.nickname))
      {
        await this.authService.updateUser(request.user.auth_id,updatedUser.nickname,updatedUser.displayname,updatedUser.picture,updatedUser.bio,false);
        return res.status(200).json({ message: 'User data updated successfully' });
      }
      else
        return res.status(404).json({ message: 'Nickname is already in use' });
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  // @Get('generate-secret')
  // @UseGuards(AuthGuard('jwt'))
  // generateSecret(): { secret: string } {
  //   const secret = this.authService.generateSecret();
  //   return { secret };
  // }

  // @Post('generate-otp')
  // @UseGuards(AuthGuard('jwt'))
  // generateOtp(@Body('secret') secret: string): { otp: string } {
  //   const otp = this.authService.generateOtp(secret);
  //   return { otp };
  // }

  // @Post('verify-otp')
  // @UseGuards(AuthGuard('jwt'))
  // verifyOtp(@Body() data: { secret: string; token: string }): { isValid: boolean } {
  //   const isValid = this.authService.verifyOtp(data.secret, data.token);
  //   return { isValid };
  // }
  // @Get('generate-qrcode/:secret/:label')
  // @UseGuards(AuthGuard('jwt'))
  // async generateQrCode(@Param('secret') secret: string, @Param('label') label: string): Promise<{ qrCode: string }> {
  //   const qrCode = await this.authService.generateQrCode(secret, label);
  //   return { qrCode };
  // }


}
