/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
    Body,
    Controller,
    HttpException,
    Logger,
    Post,
    Req,
    UseInterceptors,
    ValidationPipe,
} from '@nestjs/common';

import { StatsService } from './stats.service';
import { ApiBody, ApiProperty, ApiTags } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { StatsFormatService } from './stats-format.service';
import { MeedanItemStatuses } from '@iverify/meedan-check-client/src';
import { ItemChangedRequestDto } from './dto/itemChangedRequest.dto';
import { WebhookAuth } from '../../interceptors/webhook.auth.interceptor';

export class DateBraket {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    readonly startDate: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    readonly endDate: string;
}

export class DayDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    readonly day: string;
}

export class ItemChangedDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    readonly id: string;
}

@ApiTags('stats')
@Controller('stats')
export class StatsController {
    private readonly logger = new Logger(StatsController.name);

    constructor(
        private readonly statsService: StatsService,
        private formatService: StatsFormatService
    ) {}

    @Post('stats-by-range')
    // @UseGuards(JWTTokenAuthGuard)
    async statsByRange(
        @Body(ValidationPipe) body: DateBraket,
        @Req() request: Request
    ) {
        const locationId = request.headers['locationId'];

        const startDate = new Date(body['startDate']);
        const endDate = new Date(body['endDate']);

        return await this.statsService.getByDate(
            locationId,
            startDate,
            endDate
        );
    }

    @Post('item-status-changed')
    @UseInterceptors(WebhookAuth)
    @ApiTags('Item Status Changed')
    @ApiBody({ type: ItemChangedRequestDto })
    async itemResolved(
        @Body(ValidationPipe) body: ItemChangedRequestDto,
        @Req() request: Request
    ) {
        try {
            // @ts-ignore
            const { id: locationId } = request.location;

            this.logger.log(`Item status changed...`);
            const event = body.event;
            const data = body.data;
            const id = data.project_media.dbid;
            this.logger.log(`Event: ${event}; Item id: ${id}`);
            const day = this.formatService.formatDate(new Date());
            if (event !== MeedanItemStatuses.ITEM_CHANGED) {
                this.logger.log(
                    `[${id}] event ${event} is now allowed for this method`
                );
                return;
            }

            return await this.statsService.processItemStatusChanged(
                locationId,
                id,
                day
            );
        } catch (e) {
            this.logger.error(e.message);
            throw new HttpException(e.message, 500);
        }
    }

    @Post('toxicity')
    async addToxicityStats(@Body() body, @Req() request: Request) {
        try {
            const locationId = request.headers['locationId'];

            const toxicCount = body.toxicCount;
            this.logger.log(
                'Received request for adding toxicity stat with count: ${toxicCount}'
            );
            const day = this.formatService.formatDate(new Date());
            return await this.statsService.addToxicityStats(
                locationId,
                toxicCount,
                day
            );
        } catch (e) {
            this.logger.error(e.message);
            throw new HttpException(e.message, 500);
        }
    }
}
