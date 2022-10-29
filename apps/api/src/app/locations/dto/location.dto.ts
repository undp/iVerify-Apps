import { IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';

export class LocationDto {
    @IsNotEmpty()
    @IsString()
    description: string;

    @IsOptional()
    @IsObject()
    params: Record<string, unknown>;

    constructor(params?: Partial<LocationDto>) {
        Object.assign(this, params);
    }
}
