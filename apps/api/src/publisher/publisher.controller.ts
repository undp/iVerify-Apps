import { MeedanItemStatuses } from '@iverify/meedan-check-client/src';
import {
    Body,
    Controller,
    HttpException,
    Logger,
    Post,
    UseInterceptors,
    ValidationPipe,
} from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { catchError, tap } from 'rxjs';
import { WebhookAuth } from '../interceptors/webhook.auth.interceptor';
import { PublishReportDto } from './dto/publisher.report.dto';
import { PublisherService } from './publisher.service';

@Controller()
export class PublisherController {
    private readonly logger = new Logger(PublisherController.name);

    constructor(private publisherService: PublisherService) {}

    @Post('publish-webhook')
    @UseInterceptors(WebhookAuth)
    @ApiTags('Publish Report')
    @ApiBody({ type: PublishReportDto })
    async punlishReportWebhook(@Body(ValidationPipe) body: PublishReportDto) {
        try {
            const event = body.event;
            this.logger.log(`Received event: ${event}`);
            const data = body.data;

            const id = data.project_media.dbid;
            this.logger.log(`project media id: ${id}`);

            if (event === MeedanItemStatuses.PUBLISH_REPORT) {
                return this.publisherService.publishReportById(`${id}`).pipe(
                    tap(() => this.logger.log('Report published.')),
                    catchError((err) => {
                        this.logger.error(err);
                        throw new HttpException(err.message, 500);
                    })
                );
            }
            return null;
        } catch (e) {
            return new HttpException(e.message, 500);
        }
    }

    @Post('publish-test-endpoint')
    async punlishTestEndpoint(@Body() body) {
        try {
            const id = body.id;
            this.logger.log(`project media id: ${id}`);
            return this.publisherService.publishReportById(id).pipe(
                tap(() => this.logger.log('Report published.')),
                catchError((err) => {
                    this.logger.error(err);
                    throw new HttpException(err.message, 500);
                })
            );
        } catch (e) {
            return new HttpException(e.message, 500);
        }
    }
}
