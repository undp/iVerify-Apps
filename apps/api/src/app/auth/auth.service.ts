import * as jwt from 'jsonwebtoken';
import {
    forwardRef,
    Inject,
    Injectable,
    Logger,
    UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { map, switchMap } from 'rxjs/operators';
import { HttpService } from '@nestjs/axios';
import { WpConfigHandler } from '../handlers/wpConfigHandler.service';
import { from } from 'rxjs';
import { isEmpty } from 'radash';

export const DEFAULT_USER_EMAIL =
    process.env.DEFAULT_USER_EMAIL ?? 'iverify-admin@unicc.org';
export const DEFAULT_USER_DATA =
    process.env.DEFAULT_USER_DATA ??
    '{ "locationId": "0977c708-cff2-4695-bd69-a4a57fe46e2a", "firstName": "Default", "lastName": "User", "email": "iverify-admin@unicc.org", "phone": "0000000000", "address": "test test test", "createdBy": null, "roles": [ { "lockedDtoFields": [ "location", "users", "uniqueParam" ], "id": 1, "locationId": "0977c708-cff2-4695-bd69-a4a57fe46e2a", "name": "admin", "description": "Admin Role", "resource": "[{"name":"users","permissions":["read","write","update","delete"]},{"name":"roles","permissions":["read","write","update","delete"]}]", "uniqueParam": "0977c708-cff2-4695-bd69-a4a57fe46e2a|admin", "createdBy": "1", "updatedBy": "1" } ] }';
export const DEFAULT_USER_PASSWORD =
    process.env.DEFAULT_USER_PASSWORD ?? '5e331a7d8423940970a8e2301c958680';

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
        try {
            if (payload.email === DEFAULT_USER_EMAIL) {
                return await this.usersService.findByEmail(null, payload.email);
            }

            return await this.usersService.findOne(payload.id);
        } catch (err) {
            this.logger.error(err);
            throw err;
        }
    }

    async validate(locationId: string, email, password): Promise<any> {
        try {
            const user = await this.usersService.findByEmail(locationId, email);

            if (
                email === DEFAULT_USER_EMAIL &&
                password === DEFAULT_USER_PASSWORD
            ) {
                return user;
            }

            if (!isEmpty(user)) {
                await this.usersService.comparePassword(
                    password,
                    user.password
                );

                return user;
            }

            throw new UnauthorizedException();
        } catch (err) {
            this.logger.error(err);
            throw err;
        }
    }
}
