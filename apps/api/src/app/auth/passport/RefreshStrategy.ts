/* eslint-disable @typescript-eslint/ban-ts-comment */
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Injectable } from '@nestjs/common';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { WpConfigHandler } from '../../handlers/wpConfigHandler.service';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
    Strategy,
    'refreshToken'
) {
    constructor(
        private readonly wpConfigHandler: WpConfigHandler,
        private readonly authService: AuthService
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

    // tslint:disable-next-line:ban-types
    async validate(req: Request, payload: JwtPayload, done: Function) {
        const user = await this.authService.validateUser(payload);
        if (!user) {
            return { status: false, message: 'auth fail' };
        }
        return { status: true, message: user };
    }
}
