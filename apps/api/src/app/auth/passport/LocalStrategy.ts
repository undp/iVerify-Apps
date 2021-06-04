import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { PassportStrategy } from '@nestjs/passport';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../../users/user.model';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly authService: AuthService,
        @InjectModel('User') private readonly userModel: Model<User>) {
        super({
            usernameField: 'email',
            passwordField: 'password',
        });
    }

    async validate(username: string, password: string) {
        const user = await this.authService.validate(username, password);
        if (!user) {
          throw new BadRequestException('Invalid UserName/Password');
        }
        return user;
      }
}