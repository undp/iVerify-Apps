import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class GetRoleDto {

    @ApiProperty()
    @IsNotEmpty()
    readonly roleId: string;
}