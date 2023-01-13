import { MeedanItemStatuses } from '@iverify/meedan-check-client/src';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class StatusProjectMedia {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    dbid: string;
}

export class ItemChangedData {
    @ApiProperty()
    @IsNotEmpty()
    project_media: StatusProjectMedia;
}

export class ItemChangedRequestDto {
    @IsOptional()
    team: any;

    @IsOptional()
    object: any;

    @IsOptional()
    time: any;

    @IsOptional()
    user_id: any;

    @IsOptional()
    settings: any;

    @ApiProperty()
    @IsNotEmpty()
    data: ItemChangedData;

    @ApiProperty()
    @IsNotEmpty()
    @IsEnum(MeedanItemStatuses)
    event: string;
}
