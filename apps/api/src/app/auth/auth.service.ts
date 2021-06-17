import * as jwt from 'jsonwebtoken';
import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { InfoLogger } from '../logger/info-logger.service';
import { environment } from '../../environments/environment'



@Injectable()
export class AuthService {
    constructor(private readonly usersService: UsersService,private infoLogger: InfoLogger) {
        this.infoLogger.setContext('AuthServices');
    }

    async createToken(user) {
        const userObj = {
            id: user.id,
            email: user.email,
            firstname: user.firstName,
            lastname: user.lastName,
            roleId: user.roleId
        };
        const expiresIn = environment.tokenExpTime;
        const accessToken = jwt.sign(userObj, environment.JWTsecret, { expiresIn });
        const refreshToken = await this.createRefreshToken(user);
        this.infoLogger.log('return the token', accessToken);
        return await { accessToken, refreshToken };

    }

    async createRefreshToken(user) {

        const expiresIn = environment.refreshExpTime;
        const accessToken = jwt.sign({
            id: user.id,
            email: user.email
        }, environment.JWTSecretRefreshToken, { expiresIn });
        return await accessToken;

    }

    async validateUser(payload: JwtPayload): Promise<any> {
        return await this.usersService.findById(payload.id);
    }

    async validate(email, password): Promise<any> {
        const user = await this.usersService.getUserWithPassword({ email: email });
        if (user) {
            return await this.usersService.comparePassword(password, user.password);
        } else {
            return null;
        }
    }
}