
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import * as otplib from 'otplib'
import * as qrcode from 'qrcode';


@Injectable()
export class AuthService {
    constructor(private readonly configService: ConfigService,private readonly  prisma: PrismaService) {}

    private get secretKey(): string {
      return this.configService.get<string>('JWT_SECRET_KEY');
    }

  generateToken(payload: any): string {
    return jwt.sign(payload, this.secretKey);
  }

  verifyToken(token: string): any {
    try {
      return jwt.verify(token, this.secretKey);
    } catch (error) {
      return null;
    }
  }

  async isNicknameUnique(nickname: string): Promise<boolean> {
    try {
      const user = await this.prisma.users.findUnique({
        where: {
          nickname,
        },
      });
      return !user;
    } catch (error) {
      throw new Error('An error occurred while checking nickname uniqueness.');
    }
  }

  async createRandomName()
  {
    const name = (Math.random() + 1).toString(36).substring(7);
    if (this.isNicknameUnique(name))
        return this.createRandomName();
    return name

  }

  async createUser(auth_id: string,
    email: string,
    displayname: string,
    picture: string,
    emailVerified?: boolean) {
    const nickname = await this.createRandomName();

    return this.prisma.users.create({
        data: {
        auth_id,
        email,
        nickname,
        displayname,
        picture,
        emailVerified,
        stats: {
          create: {
              wins: 0,
              losses: 0,
              goal_conceded: 0,
              goal_scoared: 0,
              clean_sheets: 0
          }
        }
        }
    });
  }

  async findUserById(auth_id: string) {
    const user = await this.prisma.users.findUnique({ where: { auth_id } });
    if (!user) {
      return null;
    }
    return user;
  }

  async updateUser(auth_id : string ,nickname: string, displayname: string, picture: string, bio: string,firstSignIn:boolean) {
    const updatedUser = await this.prisma.users.update({
      where: { auth_id },
      data: { nickname, displayname, picture,bio ,firstSignIn},
    });
    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${auth_id} not found`);
    }
    return updatedUser;
  }
  // generateSecret(): string {
  //   return otplib.authenticator.generateSecret();
  // }

  // generateOtp(secret: string): string {
  //   return otplib.authenticator.generate(secret);
  // }

  // verifyOtp(secret: string, token: string): boolean {
  //   return otplib.authenticator.verify({ token, secret });
  // }
  // async generateQrCode(secret: string, label: string): Promise<string> {
  //   const otpauthURL = otplib.authenticator.keyuri('user', label, secret);
  //   const qrCode = await qrcode.toDataURL(otpauthURL);

  //   return qrCode;
  // }

}