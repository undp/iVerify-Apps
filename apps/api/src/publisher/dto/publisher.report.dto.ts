import { ApiProperty } from '@nestjs/swagger';

export class PublishReportDto {
    @ApiProperty()
    event: string;

    @ApiProperty()
    data: {
        project_media: {
            dbid: number | string;
        };
    };
}
