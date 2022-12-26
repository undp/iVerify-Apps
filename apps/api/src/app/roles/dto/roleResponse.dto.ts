import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { RolesDto } from './role.dto';

export class RolesResponseDto {
    @ApiProperty()
    @IsOptional()
    @IsString()
    message?: string;

    @ApiProperty()
    @IsOptional()
    @IsNotEmpty()
    data?: Array<RolesDto> | RolesDto;
}
