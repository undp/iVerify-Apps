import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';


export class CreateUserDto {

    @ApiProperty()
    @IsNotEmpty()
    readonly firstName: string;

    @ApiProperty()
    readonly lastName: string;

    @ApiProperty()
    @IsNotEmpty()
    readonly phone: number;

    @ApiProperty()
    @IsNotEmpty()
    readonly address: string;

    @ApiProperty()
    @IsEmail()
    readonly email: string;

    @ApiProperty()
    @IsNotEmpty()
    password: string;
}