import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class TokenGenerationDto {
    @ApiProperty()
    @IsEmail()
    readonly email: string;
}
