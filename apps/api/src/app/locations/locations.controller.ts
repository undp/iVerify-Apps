import {
    Body,
    Controller,
    Delete,
    Get,
    Logger,
    Param,
    Post,
    Put,
    Query,
    ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { DeleteResult, UpdateResult } from 'typeorm';
import { PaginationQueryDto } from '../common/pagination-query.dto';
import { StatsController } from '../stats/stats-controller';
import { CreateLocationDto } from './dto/createLocation.dto';
import { LocationDto } from './dto/location.dto';
import { LocationClients } from './dto/locations.clients.dto';
import { LocationsService } from './locations.service';

@Controller('locations')
@ApiTags('locations')
@ApiBearerAuth()
export class LocationsController {
    private logger = new Logger(StatsController.name);

    constructor(private readonly locationsService: LocationsService) {}

    @Post()
    async create(
        @Body(ValidationPipe) locationDto: CreateLocationDto
    ): Promise<LocationDto> {
        try {
            return await this.locationsService.create(locationDto);
        } catch (e) {
            this.logger.error(e);
            throw e;
        }
    }

    @Put(':id')
    async update(
        @Body() locationDto: Partial<CreateLocationDto>,
        @Param('id') locationId: string
    ): Promise<UpdateResult> {
        try {
            return await this.locationsService.update(locationId, locationDto);
        } catch (e) {
            this.logger.error(e);
            throw e;
        }
    }

    @Get(':id')
    async findById(@Param('id') locationId: string): Promise<LocationDto> {
        try {
            return await this.locationsService.findById(locationId);
        } catch (e) {
            this.logger.error(e);
            throw e;
        }
    }

    @Get()
    async findAll(@Query() query): Promise<Array<LocationDto>> {
        const paginationQueryDto: PaginationQueryDto = {
            limit: Number(query.limit || 10),
            offset: Number(query.offset || 0),
        };

        try {
            const result = await this.locationsService.findAll(
                paginationQueryDto
            );
            return result;
        } catch (e) {
            this.logger.error(e);
            throw e;
        }
    }

    @Delete(':id')
    async remove(@Param('id') locationId: string): Promise<DeleteResult> {
        try {
            return await this.locationsService.delete(locationId);
        } catch (err) {
            this.logger.error(err);
            throw err;
        }
    }

    @Post('/:locationId/clients')
    async addClient(
        @Param('locationId') locationId: string,
        @Body(ValidationPipe) locationclient: LocationClients
    ): Promise<LocationClients> {
        try {
            return await this.locationsService.addClient(
                locationId,
                locationclient
            );
        } catch (e) {
            this.logger.error(e);
            throw e;
        }
    }

    @Post('/:locationId/clients/:clientId')
    async removeClient(
        @Param('locationId') locationId: string,
        @Param('clientId') clientId: string
    ): Promise<any> {
        try {
            return await this.locationsService.deleteClient(
                locationId,
                clientId
            );
        } catch (err) {
            this.logger.error(err);
            throw err;
        }
    }
}
