import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('/v1/api/notification')
export class NotificationController{
    constructor(){}

    @Get()
    @UseGuards(AuthGuard('jwt'))
    async getNotification()
    {
    }
}