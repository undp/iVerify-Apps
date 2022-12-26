import { MeedanItemStatuses } from '@iverify/meedan-check-client/src';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

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
    @ApiProperty()
    @IsNotEmpty()
    data: ItemChangedData;

    @ApiProperty()
    @IsNotEmpty()
    @IsEnum(MeedanItemStatuses)
    event: string;
}
