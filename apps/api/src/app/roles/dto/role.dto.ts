import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Roles } from '../roles.model';

export class RolesDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    id: number;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    locationId: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    description: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    resource: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    createdBy: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    updatedBy: string;

    constructor(param?: Partial<RolesDto | Roles>) {
        Object.assign(this, param);
    }
}
