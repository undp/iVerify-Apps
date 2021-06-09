import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { jwtConstants } from '../constants';
import { Injectable, UnauthorizedException, UseFilters } from '@nestjs/common';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { environment } from '../../../environments/environment'



@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly authService: AuthService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: environment.JWTsecret,
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