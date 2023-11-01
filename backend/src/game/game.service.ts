import { Injectable,NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
@Injectable()
export class GameService {
  constructor(private prisma: PrismaService) {}
  
  
}