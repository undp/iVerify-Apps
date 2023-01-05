/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { PassportStrategy } from '@nestjs/passport';
import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly authService: AuthService // @InjectModel('User') private readonly userModel: Model<User>
    ) {
        super({
            usernameField: 'email',
            passwordField: 'password',
        });
    }

    async validate(request: Request, username: string, password: string) {
        // @ts-ignore
        const { id: locationId } = request.location;

        const user = await this.authService.validate(
            locationId,
            username,
            password
        );
        if (!user) {
            throw new BadRequestException('Invalid UserName/Password');
        }
        return user;
    }
}
