import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class TokenGenerationDto {
    @ApiProperty()
    @IsEmail()
    readonly email: string;
}