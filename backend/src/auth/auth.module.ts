import { Module } from '@nestjs/common';
import { GoogleStrategy } from './strategy/google.strategy';
import { IntraStrategy } from './strategy/42.strategy';
import { AuthController } from './auth.controller';
import { ConfigModule } from '@nestjs/config';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET_KEY'),
        signOptions: { expiresIn: '10h' },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    GoogleStrategy,
    IntraStrategy,
    AuthService,
    PrismaService,
    JwtStrategy,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
