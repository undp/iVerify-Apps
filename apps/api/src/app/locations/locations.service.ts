import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindManyOptions, Repository, UpdateResult } from "typeorm";
import { CreateLocationDto } from "./dto/createLocation.dto";
import { LocationDto } from "./dto/location.dto";
import { Locations } from "./models/locations.model";


@Injectable()
export class LocationsService {

    private logger = new Logger(LocationsService.name);

    constructor(
        @InjectRepository(Locations)
        private locationsRepository: Repository<Locations>
    ) { }


    public async create(locationParam: CreateLocationDto): Promise<Locations> {
        try {

            const location = await this.locationsRepository.create(new Locations(locationParam));

            return this.locationsRepository.save(location);
        } catch (err) {
            this.logger.error(err);
            throw err;
        }
    }

    public async update(locationId: string, locationParam: Partial<CreateLocationDto>): Promise<UpdateResult> {

        return this.locationsRepository.update(locationId, { ...locationParam });
    }

    public async find(criteria: FindManyOptions<Locations>): Promise<Array<Locations>> {
        return this.locationsRepository.find(criteria);
    }

    public async findAll(page = 0, limit = 15): Promise<Array<LocationDto>> {

        const criteria = {
            take: page,
            skp: page * limit,
        }

        const queryResult = await this.find(criteria);

        return queryResult.map((location: Locations) => new LocationDto({ ...location }));
    }

    public async delete(locationId: string): Promise<void> {

        await this.locationsRepository.update(locationId, { deleted: true });
        // remove users, stats, roles
    }

}