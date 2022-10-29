import { AuthGuard } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RefreshTokenAuthGuard extends AuthGuard('refreshToken') {}
