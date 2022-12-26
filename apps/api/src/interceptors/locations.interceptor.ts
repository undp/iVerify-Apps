import {
    CallHandler,
    ExecutionContext,
    Inject,
    Injectable,
    Logger,
} from '@nestjs/common';
import { LocationsService } from '../app/locations/locations.service';

@Injectable()
export class LocationsInteceptor {
    private logger = new Logger(LocationsInteceptor.name);

    constructor(
        @Inject(LocationsService)
        private locationsService: LocationsService
    ) {}

    async intercept(
        context: ExecutionContext,
        next: CallHandler
    ): Promise<any> {
        try {
            const request = context.switchToHttp().getRequest();

            if (request.headers) {
                const location = request?.headers['location'];

                if (location) {
                    const result = await this.locationsService.findById(
                        location
                    );
                    request.location = { ...result };
                }
            }

            return next.handle();
        } catch (err) {
            this.logger.error(err);
            throw err;
        }
    }
}
