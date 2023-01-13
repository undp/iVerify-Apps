import {
    CallHandler,
    ExecutionContext,
    Inject,
    Injectable,
    Logger,
    NestMiddleware,
} from '@nestjs/common';
import { LocationsService } from '../app/locations/locations.service';
import { isEmpty } from 'radash';
import { LocationClients } from '../app/locations/dto/locations.clients.dto';
import { Locations } from '../app/locations/models/locations.model';

@Injectable()
export class WebhookAuth {
    private logger = new Logger(WebhookAuth.name);

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
            const response = context.switchToHttp().getResponse();

            this.logger.log(
                `receiving request ${request.method} params ${JSON.stringify(
                    request
                )}`
            );

            if (request.headers) {
                const locationId = request?.headers['location'];
                const clientId = request?.headers['clientid'];
                const key = request?.headers['key'];

                if (!clientId) {
                    response.status = 400;
                    return response.send('Client ID is required');
                }

                if (!key) {
                    response.status = 400;
                    return response.send('The client key is required');
                }

                if (!locationId) {
                    response.status = 400;
                    return response.send('Location ID is required');
                }

                const location: Locations =
                    await this.locationsService.findById(locationId);

                if (isEmpty(location)) {
                    response.status = 403;
                    return response.send('Invalid location');
                }

                const client = location.clients.find(
                    (client: LocationClients) => client.id === clientId
                );

                if (isEmpty(client)) {
                    response.status = 403;
                    return response.send('Invalid clientId');
                }

                if (client.key !== key) {
                    response.status = 403;
                    return response.send('Invalid credentials');
                }

                return next.handle();
            }
        } catch (err) {
            this.logger.error(err);
            throw err;
        }
    }
}
