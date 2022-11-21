import { Strategy } from 'passport-wordpress';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class WordpressStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService) {
        super({
            secretOrKeyProvider: async (request, jwtToken, done) => {
                const { id: locationId } = request.location;
                const { JWTsecret, redirect_uri, ClientID, WordpressUrl } =
                    await this.wpConfigHandler.getConfigByLocation(locationId);
                done(
                    null,
                    JWTsecret,
                    redirect_uri,
                    ClientID,
                    `${WordpressUrl}oauth/authorize`
                );
            },
        });
    }
}
