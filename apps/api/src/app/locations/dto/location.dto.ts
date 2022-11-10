import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';
import { LocationsParam } from '../interfaces/location.params';
import { Locations } from '../models/locations.model';

export class LocationDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    id: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    description: string;

    @ApiProperty()
    @IsObject()
    params: Array<LocationsParam>;

    constructor(params?: Partial<LocationDto | Locations>) {
        Object.assign(this, params);
    }
}
