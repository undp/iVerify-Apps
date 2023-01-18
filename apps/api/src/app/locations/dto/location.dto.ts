import { ApiProperty } from '@nestjs/swagger';
import {
    IsArray,
    IsNotEmpty,
    IsObject,
    IsOptional,
    IsString,
} from 'class-validator';

import {
    LocationResources,
    LocationsParam,
} from '../interfaces/location.params';
import { Locations } from '../models/locations.model';
import { LocationClients } from './locations.clients.dto';

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
    @IsOptional()
    @IsArray()
    params: Array<LocationsParam>;

    @ApiProperty()
    @IsOptional()
    @IsArray()
    resources: Array<LocationResources>;

    @ApiProperty()
    @IsArray()
    clients?: Array<LocationClients>;

    @ApiProperty()
    @IsOptional()
    filterMap: string;

    constructor(params?: Partial<LocationDto | Locations>) {
        Object.assign(this, params);
    }
}
