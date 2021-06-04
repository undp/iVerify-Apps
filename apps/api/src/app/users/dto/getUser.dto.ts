import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class GetUserDto {

    @ApiProperty()
    @IsNotEmpty()
    readonly userId: string;
}