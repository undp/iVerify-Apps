import { Controller, Logger } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { StatsController } from '../stats/stats-controller';

@Controller('locations')
@ApiTags('locations')
@ApiBearerAuth()
export class LocationsController {
    private logger = new Logger(StatsController.name);

    // constructor(
    //     private
    // ) {

    // }
}
