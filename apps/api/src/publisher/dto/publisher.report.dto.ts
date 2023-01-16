import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class PublishReportDto {
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
    @IsString()
    event: string;

    @ApiProperty()
    @IsNotEmpty()
    data: {
        project_media: {
            dbid: number | string;
        };
    };
}
