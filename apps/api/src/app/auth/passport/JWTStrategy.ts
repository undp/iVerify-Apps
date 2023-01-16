import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
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
                const locationId = request?.headers['location'];

                const config = await this.wpConfigHandler.getConfigByLocation(
                    locationId
                );

                const JWTsecret = config.JWTsecret ?? process.env.JWT_SECRET;

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
