import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException, UseFilters } from '@nestjs/common';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

import { WpConfigHandler } from '../../handlers/wpConfigHandler.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly authService: AuthService,
        private readonly wpConfigHandler: WpConfigHandler
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKeyProvider: async (request, jwtToken, done) => {
                const { id: locationId } = request.location;
                const { JWTsecret } =
                    await this.wpConfigHandler.getConfigByLocation(locationId);
                done(null, JWTsecret);
            },
        });
    }

    async validate(payload: JwtPayload) {
        const user = await this.authService.validateUser(payload);
        if (!user) {
            throw new UnauthorizedException();
        }
        return user;
    }
}
