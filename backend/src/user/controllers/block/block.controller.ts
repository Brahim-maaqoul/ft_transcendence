import { Controller, Get, Post, UseGuards, Res, Req, Body} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { BlockService } from '../../services/block.service';

@Controller()
export class BlockController {
    constructor(private  BlockService:BlockService) {}
    @Post('/blockUser')
    @UseGuards(AuthGuard('jwt'))
    async blockUser(@Body() blockUserData, @Res() res,@Req() request) {
        try {
          const blockedUserId = request.user.auth_id
          const { blockerUserId } = blockUserData;
            const result = await this.BlockService.blockUser(blockedUserId, blockerUserId);
            return res.status(200).json({ message: result });
        } catch (error) {
            return res.status(500).json({ message: 'An error occurred while blockUser the user.' });
        }
    }


    @Post('/deblocked')
    @UseGuards(AuthGuard('jwt'))
    async deblocked(@Body() deblockedData, @Res() res,@Req() request) {
        const blockedUserId = request.user.auth_id
        const { blockerUserId } = deblockedData;
        const result = await this.BlockService.deblockUser(blockedUserId, blockerUserId);
        return res.status(200).json({ message: result });
        
      }
}