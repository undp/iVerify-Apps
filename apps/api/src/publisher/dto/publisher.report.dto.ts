import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class PublishReportDto {
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
