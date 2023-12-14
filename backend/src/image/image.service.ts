import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { Multer } from 'multer';
@Injectable()
export class ImageService {
  constructor(
    private prisma: PrismaService,
  ) {}
  
  async getImg(id: number)
  {
    return await this.prisma.image.findUnique({
        where:{
            id
        }
    })
  }

  async uploadImg(file: Multer.File)
  {
    const image = await this.prisma.image.create({
        data:{
            data: Buffer.from(file.buffer),
            type: file?.mimetype ? file?.mimetype : "image/*"
        }
    })
    return "http://localhost:8000/v1/api/image/get/" + image.id;
  }
  async uploadFromAuth(file: ArrayBuffer)
  {
    const image = await this.prisma.image.create({
        data:{
            data: Buffer.from(file),
            type: "image/*"
        }
    })
    return "http://localhost:8000/v1/api/image/get/" + image.id;
  }
}