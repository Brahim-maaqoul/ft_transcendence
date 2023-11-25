import { IsInt, IsSemVer, IsString } from "class-validator";

export class messageDto{
    @IsInt()
    groupID:number
    @IsString()
    message:string

}