import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
    DeleteResult,
    FindManyOptions,
    Repository,
    UpdateResult,
} from 'typeorm';
import { PaginationQueryDto } from '../common/pagination-query.dto';
import { CreateLocationDto } from './dto/createLocation.dto';
import { LocationDto } from './dto/location.dto';
import { Locations } from './models/locations.model';

@Injectable()
export class LocationsService {
    private logger = new Logger(LocationsService.name);

    constructor(
        @InjectRepository(Locations)
        private locationsRepository: Repository<Locations>
    ) {}

    public async create(
        locationParam: CreateLocationDto
    ): Promise<LocationDto> {
        try {
            const location = await this.locationsRepository.create(
                new Locations(locationParam)
            );

            const result = await this.locationsRepository.save(location);

            return result.toDto();
        } catch (err) {
            this.logger.error(err);
            throw err;
        }
    }

    public async update(
        locationId: string,
        locationParam: Partial<LocationDto>
    ): Promise<UpdateResult> {
        try {
            const result = await this.locationsRepository.update(locationId, {
                ...locationParam,
            });

            return result;
        } catch (e) {
            this.logger.error(e);
            throw e;
        }
    }

    public async find(
        criteria: FindManyOptions<Locations>
    ): Promise<Array<LocationDto>> {
        try {
            const locations = await this.locationsRepository.find(criteria);

            return locations.map((location) => location.toDto());
        } catch (e) {
            this.logger.error(e);
            throw e;
        }
    }

    public async findAll(
        paginationDto: PaginationQueryDto
    ): Promise<Array<LocationDto>> {
        const { limit, offset } = paginationDto;
        try {
            const criteria = {
                take: limit,
                skp: offset,
            };

            const queryResult = await this.find(criteria);

            return queryResult;
        } catch (e) {
            this.logger.error(e);
            throw e;
        }
    }

    public async delete(locationId: string): Promise<DeleteResult> {
        return this.locationsRepository.update(locationId, { deleted: true });
        // remove users, stats, roles
    }
}
