import { IsNumber, IsString } from "class-validator";

export class changePrivacyDto
{
    @IsNumber()
    group_id: number
    @IsString()
    password: string
}