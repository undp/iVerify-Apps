import * as jwt from 'jsonwebtoken';
import { forwardRef, Inject, Injectable, HttpService } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { InfoLogger } from '../logger/info-logger.service';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';

@Injectable()
export class AuthService {
    constructor(
        private http: HttpService,
        @Inject(forwardRef(() => UsersService))
        private readonly usersService: UsersService,
        private infoLogger: InfoLogger
        ) {
        this.infoLogger.setContext('AuthServices');
    }

    async createToken(user) {
        const userObj = {
            id: user.id,
            email: user.email,
            firstname: user.firstName,
            lastname: user.lastName,
            roles: user.roles
        };
        const expiresIn = environment.tokenExpTime;
        const accessToken = jwt.sign(userObj, environment.jWTsecret, { expiresIn });
        const refreshToken = await this.createRefreshToken(user);
        this.infoLogger.log('return the token', accessToken);
        return await { accessToken, refreshToken };
    }

    async createRefreshToken(user) {

        const expiresIn = environment.refreshExpTime;
        const accessToken = jwt.sign({
            id: user.id,
            email: user.email
        }, environment.jWTSecretRefreshToken, { expiresIn });
        return await accessToken;

    }

    createTokenByCode(code: string) {
        const queryParams = {
            grant_type: "authorization_code",
            code: code,
            client_id: environment.clientID,
            client_secret: environment.clientSecret,
            redirect_uri: environment.redirectUri,
            state:""
        }
        const url = environment.wpUrl + '/oauth/token';
        return this.http.post(url, queryParams).pipe(map(response => response.data));    
    }

    getUserByData(token: string) {
        const url = environment.wpUrl + '/oauth/me?access_token=' + token;
        return this.http.get(url).pipe(map(response => response.data));
    }

    async validateUser(payload: JwtPayload): Promise<any> {
        return await this.usersService.findOne(payload.id);
    }

    async validate(email, password): Promise<any> {
        const user = await this.usersService.findByEmail(email);
        if (user) {
            return await this.usersService.comparePassword(password, user.password);
        } else {
            return null;
        }
    }
}