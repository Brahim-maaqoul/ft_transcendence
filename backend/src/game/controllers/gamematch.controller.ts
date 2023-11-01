import { Controller, Get, Post, Res, Req } from '@nestjs/common';

@Controller('/GameQueue')
export class GameMatchController {
    constructor(){}

    @Get()
    async createGame(@Res() res, @Req() request)
    {
        
    }
}