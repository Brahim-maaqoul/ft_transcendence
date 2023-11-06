import { IsString, IsInt } from 'class-validator';

export class addMemberDto
{
    @IsInt()
    group: number
    @IsString()
    userId: string
}