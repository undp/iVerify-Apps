import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { environment } from '../../environments/environment'
// Strategies
import { LocalStrategy } from './passport/LocalStrategy';
import { JwtStrategy } from './passport/JWTStrategy';
import { JwtRefreshStrategy } from './passport/RefreshStrategy'
import { RefreshTokenAuthGuard } from '../guards/RefreshToken-auth.guard';
import { JWTTokenAuthGuard } from '../guards/JWTToken-auth.guard';


@Module({
  imports: [UsersModule],
  controllers: [AuthController],
  providers: [RefreshTokenAuthGuard, JWTTokenAuthGuard, AuthService, JwtStrategy, LocalStrategy, JwtRefreshStrategy],
  exports: [RefreshTokenAuthGuard, AuthService, JwtStrategy, LocalStrategy, JwtRefreshStrategy],
})
export class AuthModule { }