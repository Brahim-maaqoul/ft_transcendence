import { Body, Controller, Get, Post, Req, Res, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { DuoService } from 'src/chat/services/chats/chats.service';
import { group } from 'console';

@Controller('/duo')
export class DuoController {
    constructor(private  DuoService:DuoService){}

    @Post('/create')
    @UseGuards(AuthGuard('jwt'))
    async createDuo(@Res() res, @Req() req, @Body('user_id') user_id:string)
    {
        const group = await this.DuoService.createDuo(req.user.auth, user_id)
        return res.redirect(302, 'http://localhost:3000/chat/' + group.id);
    }

    @Get('/get')
    @UseGuards(AuthGuard('jwt'))
    async getDuos(@Res() res, @Req() req)
    {
        const duos = this.DuoService.getDuos(req.user.auth_id)
        return res.status(200).json(duos);
    }
}