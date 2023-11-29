import { Controller, Get, Post, Res, Req, Request } from '@nestjs/common';

@Controller('/GameQueue')
export class GameMatchController {
    constructor(){}

    @Get()
    async createGame(@Res() res, @Req() Request) {
		;
    }
}