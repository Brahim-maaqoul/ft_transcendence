import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";

import { Server } from "socket.io";
import { Socket } from "socket.io";
import { GroupsService } from "../services/groups/groups.service";

@WebSocketGateway({
    namespace: 'chat',
    cors:{
        credentials: true,
        origin: '*',
    },
})
export class chatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
    IdToSocket : Record<string, Socket>;
    constructor(private GroupsService: GroupsService){
        this.IdToSocket = {}
    }
    @WebSocketServer() server:Server
    async afterInit(server: any) {
        console.log("chat socket created!!")
    }
    async handleConnection(client: any, ...args: any[]) {

    }
    async handleDisconnect(client: any) {
    }

    @SubscribeMessage("getId")
    async handelGetId(client: Socket, payload: {auth_id: string})
    {
        if (!payload.auth_id)
            return ;
        console.log("auth", payload.auth_id, client.id)
        this.IdToSocket[payload.auth_id] = client;
    }
    @SubscribeMessage('sendMessage')
    async handleSendMessage(client: Socket, payload: {group_id: string})
    {
        console.log("reload")
        const members = await this.GroupsService.getMembers(Number(payload.group_id))
        members.map((member) => {
            if (this.IdToSocket[member.user_id])
            {
                console.log("reload", member.user_id)
                this.IdToSocket[member.user_id].emit("reload")
            }
        })
    }

}