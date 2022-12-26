import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Stats } from '../models/stats.model';

export class StatsDto {
    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    id: number;

    @ApiProperty()
    @IsNotEmpty()
    @IsDate()
    day: Date;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    category: string;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    count: number;

    constructor(param?: Partial<StatsDto | Stats>) {
        Object.assign(this, param);
    }
}
