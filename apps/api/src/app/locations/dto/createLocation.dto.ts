import { ApiProperty } from '@nestjs/swagger';
import {
    IsArray,
    IsNotEmpty,
    IsObject,
    IsOptional,
    IsString,
} from 'class-validator';
import { LocationsParam } from '../interfaces/location.params';

export class CreateLocationDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    description: string;

    @ApiProperty()
    @IsOptional()
    @IsArray()
    params: Array<LocationsParam>;

    constructor(params?: Partial<CreateLocationDto>) {
        Object.apply(this, params);
    }
}
