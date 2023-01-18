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
    UseGuards,
    ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { isEmpty } from 'radash';
import { DeleteResult, UpdateResult } from 'typeorm';
import { PaginationQueryDto } from '../common/pagination-query.dto';
import { JWTTokenAuthGuard } from '../guards/JWTToken-auth.guard';
import { StatsController } from '../stats/stats-controller';
import { CreateLocationDto } from './dto/createLocation.dto';
import { LocationDto } from './dto/location.dto';
import { LocationClients } from './dto/locations.clients.dto';
import { LocationResources } from './interfaces/location.params';
import { LocationsService } from './locations.service';

@Controller('locations')
@ApiTags('locations')
@ApiBearerAuth()
export class LocationsController {
    private logger = new Logger(StatsController.name);

    constructor(private readonly locationsService: LocationsService) {}

    @Post()
    @UseGuards(JWTTokenAuthGuard)
    async create(@Body() body): Promise<LocationDto> {
        try {
            return await this.locationsService.create(body);
        } catch (e) {
            this.logger.error(e);
            throw e;
        }
    }

    @Put(':id')
    @UseGuards(JWTTokenAuthGuard)
    async update(
        @Body() locationDto: Partial<CreateLocationDto>,
        @Param('id') locationId: string
    ): Promise<UpdateResult> {
        try {
            return await this.locationsService.update(
                locationId,
                locationDto as any
            );
        } catch (e) {
            this.logger.error(e);
            throw e;
        }
    }

    @Get(':id')
    @UseGuards(JWTTokenAuthGuard)
    async findById(@Param('id') locationId: string): Promise<LocationDto> {
        try {
            return (await this.locationsService.findById(
                locationId
            )) as LocationDto;
        } catch (e) {
            this.logger.error(e);
            throw e;
        }
    }

    @Get(':id/resources')
    @UseGuards(JWTTokenAuthGuard)
    async findResourcesByLocationId(
        @Param('id') locationId: string
    ): Promise<Partial<LocationDto>> {
        try {
            const location = await this.locationsService.findById(locationId);

            delete location.params;
            delete location.clients;

            return location;
        } catch (e) {
            this.logger.error(e);
            throw e;
        }
    }

    @Get('/map/:filter')
    async findByFilterMap(@Param('filter') filter: string) {
        try {
            return await this.locationsService.findIdByFilterMap(filter);
        } catch (e) {
            this.logger.error(e);
            throw e;
        }
    }

    @Get()
    @UseGuards(JWTTokenAuthGuard)
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
    @UseGuards(JWTTokenAuthGuard)
    async remove(@Param('id') locationId: string): Promise<DeleteResult> {
        try {
            return await this.locationsService.delete(locationId);
        } catch (err) {
            this.logger.error(err);
            throw err;
        }
    }

    @Post('/:locationId/clients')
    @UseGuards(JWTTokenAuthGuard)
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
    @UseGuards(JWTTokenAuthGuard)
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
