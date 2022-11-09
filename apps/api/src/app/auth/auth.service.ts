import * as jwt from 'jsonwebtoken';
import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class AuthService {
    private logger = new Logger(AuthService.name);

    constructor(
        private http: HttpService,
        @Inject(forwardRef(() => UsersService))
        private readonly usersService: UsersService
    ) {}

    async createToken(user) {
        try {
            const userObj = {
                id: user.id,
                email: user.email,
                firstname: user.firstName,
                lastname: user.lastName,
                roles: user.roles,
            };

            const expiresIn = environment.tokenExpTime;

            const accessToken = jwt.sign(userObj, environment.JWTsecret, {
                expiresIn,
            });

            const refreshToken = await this.createRefreshToken(user);

            this.logger.log('return the token', accessToken);

            return await { accessToken, refreshToken };
        } catch (err) {
            this.logger.error(err);
            throw err;
        }
    }

    async createRefreshToken(user) {
        try {
            const expiresIn = environment.refreshExpTime;

            const accessToken = jwt.sign(
                {
                    id: user.id,
                    email: user.email,
                },
                environment.JWTSecretRefreshToken,
                { expiresIn }
            );

            return await accessToken;
        } catch (err) {
            this.logger.error(err);
            throw err;
        }
    }

    createTokenByCode(code: string) {
        const queryParams = {
            grant_type: 'authorization_code',
            code: code,
            client_id: environment.ClientID,
            client_secret: environment.ClientSecret,
            redirect_uri: environment.redirect_uri,
            state: '',
        };
        const url = environment.WordpressUrl + 'oauth/token';
        return this.http
            .post(url, queryParams)
            .pipe(map((response) => response.data));
    }

    getUserByData(token: string) {
        const url = environment.WordpressUrl + 'oauth/me?access_token=' + token;
        return this.http.get(url).pipe(map((response) => response.data));
    }

    async validateUser(payload: JwtPayload): Promise<any> {
        return await this.usersService.findOne(payload.id);
    }

    async validate(email, password): Promise<any> {
        const user = await this.usersService.findByEmail(email);
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
