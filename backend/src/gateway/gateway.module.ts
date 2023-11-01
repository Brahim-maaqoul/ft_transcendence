import {Module} from "@nestjs/common"
import { Gateway  } from "./gateway"
import { ChatService } from 'src/chat/chat.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
    providers:[Gateway,ChatService,PrismaService]
})
export class GatewayModule{}