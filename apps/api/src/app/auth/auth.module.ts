import { forwardRef, Module } from '@nestjs/common';
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
import { SAMLStrategy } from './passport/SAMLStrategy';
import { RefreshTokenAuthGuard } from '../guards/RefreshToken-auth.guard';
import { JWTTokenAuthGuard } from '../guards/JWTToken-auth.guard';
import { UsersService } from '../users/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/user.model';
import { Roles } from '../roles/roles.model';


@Module({
  imports: [
    TypeOrmModule.forFeature([User, Roles]),
    UsersModule, 
    PassportModule.register({defaultStrategy: 'bearer'}),
  ],
  controllers: [AuthController],
  providers: [
    UsersService,
    RefreshTokenAuthGuard, 
    JWTTokenAuthGuard, 
    AuthService, 
    JwtStrategy, 
    LocalStrategy, 
    JwtRefreshStrategy,
    SAMLStrategy
  ],
  exports: [
    RefreshTokenAuthGuard, 
    AuthService, 
    JwtStrategy, 
    LocalStrategy, 
    JwtRefreshStrategy,
    SAMLStrategy
  ],
})
export class AuthModule { }