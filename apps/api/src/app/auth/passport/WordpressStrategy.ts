import { Strategy } from 'passport-wordpress';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { environment } from 'apps/api/src/environments/environment';

@Injectable()
export class WordpressStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super(
      {
        clientID: environment.clientID,
        clientSecret: environment.clientSecret,
        callbackURL: environment.redirectUri,
        authorizationURL: process.env.WP_URL + '/oauth/authorize'
      }
    );
  }

  async validate(accessToken: any, refreshToken: any, profile: any, done: any): Promise<any> {
  }
}