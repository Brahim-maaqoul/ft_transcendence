import { IsNumber, IsString } from "class-validator";

export class changePrivacyDto
{
    @IsNumber()
    group_id: number
    @IsString()
    name: string
    @IsString()
    password: string
    @IsString()
    type: string
    @IsString()
    picture: string
}