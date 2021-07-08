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

export class ItemChangedDto {

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly id: string;
}

@ApiTags('stats')
@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Post('item-status-changed')
  async itemResolved(@Body() body: ItemChangedDto) {
    const id = body.id;
    const startDate = new Date();
    const endDate = new Date();
    return await this.statsService.processItemStatusChanged(id, startDate, endDate);
  }
  
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
  async getTicketsByTags(@Body() body: DateBraket) {
    const startDate = new Date(body['startDate']);
    const endDate = new Date(body['endDate']);
    return await this.statsService.getTicketsByTags(startDate, endDate);
  }

  @Post('tickets-by-type')
  async getTicketsByType(@Body() body: DateBraket) {
    const startDate = new Date(body['startDate']);
    const endDate = new Date(body['endDate']) 
    return await this.statsService.getTicketsByType(startDate, endDate);
  }
}
