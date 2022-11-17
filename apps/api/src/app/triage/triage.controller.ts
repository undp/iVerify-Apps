/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
    Body,
    Controller,
    HttpException,
    Logger,
    Post,
    Req,
} from '@nestjs/common';
import { ApiBody, ApiProperty, ApiTags } from '@nestjs/swagger';
import { TriageService } from './triage.service';

class SubmitStoryDto {
    @ApiProperty()
    url: string;

    @ApiProperty()
    content: string;

    @ApiProperty()
    secret: string;
}

@ApiTags('triage')
@Controller('triage')
export class TriageController {
    private logger = new Logger(TriageController.name);

    constructor(private readonly triageSerive: TriageService) {}

    @Post('submit-story')
    @ApiBody({ type: SubmitStoryDto })
    async submitStory(@Body() body, @Req() request: Request) {
        const { url, content, secret } = body;
        // @ts-ignore
        const { id: locationId } = request.location;

        if (secret !== '1v3r1fy')
            return new HttpException('Not authorized.', 403);
        try {
            return await this.triageSerive.createItemFromWp(
                locationId,
                url,
                content
            );
        } catch (e) {
            this.logger.error(e);
            return new HttpException(e.message, 500);
        }
    }
}
