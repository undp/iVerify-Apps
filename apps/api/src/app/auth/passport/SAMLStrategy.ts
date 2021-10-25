import { Strategy } from 'passport-saml';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class SAMLStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super(
      {
        path: '/auth/callback',
        entryPoint: 'https://iverify.org.zm/wp-admin/',
        issuer: 'passport-saml',
        cert: 'fake cert', // cert must be provided
      }
    );
  }

  async validate(profile: any, done: any): Promise<any> {
    console.log('profile in strategy', profile);
    // const user = await this.authService.validateUser(username, password);
    // if (!user) {
    //   throw new UnauthorizedException();
    // }
    // return user;
  }
}