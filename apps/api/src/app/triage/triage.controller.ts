import { Body, Controller, HttpException, Logger, Post } from '@nestjs/common';
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
    async submitStory(@Body() body) {
        const { url, content, secret } = body;
        if (secret !== '1v3r1fy')
            return new HttpException('Not authorized.', 403);
        try {
            return await this.triageSerive.createItemFromWp(url, content);
        } catch (e) {
            this.logger.error(e);
            return new HttpException(e.message, 500);
        }
    }
}
