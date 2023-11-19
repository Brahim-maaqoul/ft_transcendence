import { IsString } from 'class-validator';

export class groupDto
{
    @IsString()
    groupName: string
    @IsString()
    type: 'public' | 'protected' | 'private'

    password?: string
}