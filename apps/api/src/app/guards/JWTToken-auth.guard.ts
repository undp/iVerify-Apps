import { AuthGuard } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class JWTTokenAuthGuard extends AuthGuard('jwt') { }