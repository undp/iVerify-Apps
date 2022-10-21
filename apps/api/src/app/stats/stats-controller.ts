import { Body, Controller, HttpException, Logger, Post, UseGuards } from '@nestjs/common';

import { StatsService } from './stats.service';
import { ApiProperty, ApiTags } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { StatsFormatService } from './stats-format.service';
import { JWTTokenAuthGuard } from '../guards/JWTToken-auth.guard';
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
  private readonly logger = new Logger('StatsController');

  constructor(private readonly statsService: StatsService, private formatService: StatsFormatService) { }

  @Post('stats-by-range')
  // @UseGuards(JWTTokenAuthGuard)
  async statsByRange(@Body() body: DateBraket) {
    const startDate = new Date(body['startDate']);
    const endDate = new Date(body['endDate'])
    return await this.statsService.getByDate(startDate, endDate);
  }

  @Post('item-status-changed')
  async itemResolved(@Body() body) {
    try {
      this.logger.log(`Item status changed...`);
      const event = body.event;
      const data = body.data;
      const id = data.project_media.dbid;
      this.logger.log(`Event: ${event}; Item id: ${id}`);
      // const day = this.formatService.formatDate(new Date());
      const day = this.formatService.formatDate(new Date('2022-10-15'));
      if (event !== 'update_annotation_verification_status') {
        this.logger.log(`[${id}] event ${event} is now allowed for this method`);
        return;
      };

      return await this.statsService.processItemStatusChanged(id, day);
    } catch (e) {
      this.logger.error(e.message)
      throw new HttpException(e.message, 500);
    }
  }

  @Post('toxicity')
  async addToxicityStats(@Body() body) {
    try {
      const toxicCount = body.toxicCount;
      this.logger.log(`Received request for adding toxicity stat with count: ${toxicCount}`);
      const day = this.formatService.formatDate(new Date());
      return await this.statsService.addToxicityStats(toxicCount, day);
    } catch (e) {
      this.logger.error(e.message)
      throw new HttpException(e.message, 500);
    }
  }


}
