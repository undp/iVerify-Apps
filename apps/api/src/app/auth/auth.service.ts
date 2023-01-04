import * as jwt from 'jsonwebtoken';
import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { map, switchMap } from 'rxjs/operators';
import { HttpService } from '@nestjs/axios';
import { WpConfigHandler } from '../handlers/wpConfigHandler.service';
import { from } from 'rxjs';

@Injectable()
export class AuthService {
    private logger = new Logger(AuthService.name);

    constructor(
        private http: HttpService,

        @Inject(forwardRef(() => UsersService))
        private readonly usersService: UsersService,

        private readonly wpConfigHandler: WpConfigHandler
    ) {}

    async createToken(locationId: string, user) {
        try {
            const userObj = {
                id: user.id,
                email: user.email,
                firstname: user.firstName,
                lastname: user.lastName,
                roles: user.roles,
            };

            const { tokenExpTime, JWTsecret } =
                await this.wpConfigHandler.getConfigByLocation(locationId);

            const expiresIn = tokenExpTime;

            const accessToken = jwt.sign(userObj, JWTsecret, {
                expiresIn,
            });

            const refreshToken = await this.createRefreshToken(
                locationId,
                user
            );

            this.logger.log('return the token', accessToken);

            return await { accessToken, refreshToken };
        } catch (err) {
            this.logger.error(err);
            throw err;
        }
    }

    async createRefreshToken(locationId: string, user) {
        try {
            const { refreshExpTime, JWTSecretRefreshToken } =
                await this.wpConfigHandler.getConfigByLocation(locationId);

            const expiresIn = refreshExpTime;

            const accessToken = jwt.sign(
                {
                    id: user.id,
                    email: user.email,
                },
                JWTSecretRefreshToken,
                { expiresIn }
            );

            return await accessToken;
        } catch (err) {
            this.logger.error(err);
            throw err;
        }
    }

    createTokenByCode(locationId: string, code: string) {
        return from(this.wpConfigHandler.getConfigByLocation(locationId)).pipe(
            switchMap((environment) => {
                const url = environment.WordpressUrl + 'oauth/token';

                const queryParams = {
                    grant_type: 'authorization_code',
                    code: code,
                    client_id: environment.ClientID,
                    client_secret: environment.ClientSecret,
                    redirect_uri: environment.redirect_uri,
                    state: '',
                };

                return this.http
                    .post(url, queryParams)
                    .pipe(map((response) => response.data));
            })
        );
    }

    getUserByData(locationId: string, token: string) {
        return from(this.wpConfigHandler.getConfigByLocation(locationId)).pipe(
            switchMap((environment) => {
                const url =
                    environment.WordpressUrl + 'oauth/me?access_token=' + token;
                return this.http
                    .get(url)
                    .pipe(map((response) => response.data));
            })
        );
    }

    async validateUser(payload: JwtPayload): Promise<any> {
        return await this.usersService.findOne(payload.id);
    }

    async validate(locationId: string, email, password): Promise<any> {
        const user = await this.usersService.findByEmail(locationId, email);
        if (user) {
            return await this.usersService.comparePassword(
                password,
                user.password
            );
        } else {
            return null;
        }
    }
}
