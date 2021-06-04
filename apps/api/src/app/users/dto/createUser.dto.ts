import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';


export class CreateUserDto {

    @ApiProperty()
    @IsNotEmpty()
    readonly firstName: string;

    @ApiProperty()
    @IsString()
    readonly lastName: string;

    @ApiProperty()
    @IsOptional()
    @ApiPropertyOptional()
    readonly phone: number;

    @ApiProperty()
    @IsString()
    @ApiPropertyOptional()
    readonly address: string;

    @ApiProperty()
    @IsEmail()
    readonly email: string;

    @ApiProperty()
    @IsNotEmpty()
    password: string;
}