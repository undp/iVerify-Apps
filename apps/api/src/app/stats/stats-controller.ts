import { Body, Controller, Get, Post } from '@nestjs/common';

import { Message } from '@iverify/api-interfaces';
import { StatsService } from './stats.service';
import { ApiProperty, ApiTags } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';



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

export class TagsPayload {

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly startDate: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly endDate: string;

  @ApiProperty()
  @IsNotEmpty()
  readonly tags: string[];
}

@ApiTags('stats')
@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  
  @Post('created-vs-published')
  async createdVsPublished(@Body() body: DateBraket) {
    const startDate = new Date(body['startDate']);
    const endDate = new Date(body['endDate']) 
    return await this.statsService.getCreatedVsPublished(startDate, endDate);
  }

  @Post('tickets-by-channel')
  async getTicketsByChannel(@Body() body: DateBraket) {
    const startDate = new Date(body['startDate']);
    const endDate = new Date(body['endDate']) 
    return await this.statsService.getTicketsByChannel(startDate, endDate);
  }

  @Post('tickets-by-agent')
  async getTicketsByAgent(@Body() body: DateBraket) {
    const startDate = new Date(body['startDate']);
    const endDate = new Date(body['endDate']) 
    return await this.statsService.getTicketsByAgent(startDate, endDate);
  }

  @Post('tickets-by-source')
  async getTicketsBySource(@Body() body: DateBraket) {
    const startDate = new Date(body['startDate']);
    const endDate = new Date(body['endDate']) 
    return await this.statsService.getTicketsBySource(startDate, endDate);
  }

  @Post('tickets-by-status')
  async getTicketsByStatus(@Body() body: DateBraket) {
    const startDate = new Date(body['startDate']);
    const endDate = new Date(body['endDate']) 
    return await this.statsService.getTicketsByStatus(startDate, endDate);
  }

  @Post('tickets-by-tags')
  async getTicketsByTags(@Body() body: TagsPayload) {
    const startDate = new Date(body['startDate']);
    const endDate = new Date(body['endDate']);
    const tags = body.tags;
    return await this.statsService.getTicketsByTags(startDate, endDate, tags);
  }

  @Post('tickets-by-type')
  async getTicketsByType(@Body() body: DateBraket) {
    const startDate = new Date(body['startDate']);
    const endDate = new Date(body['endDate']) 
    return await this.statsService.getTicketsByType(startDate, endDate);
  }
}
