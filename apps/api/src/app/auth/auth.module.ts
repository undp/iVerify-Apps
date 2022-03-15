import { forwardRef, Module, HttpModule  } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
// Strategies
import { LocalStrategy } from './passport/LocalStrategy';
import { JwtStrategy } from './passport/JWTStrategy';
import { JwtRefreshStrategy } from './passport/RefreshStrategy'
import { WordpressStrategy } from './passport/WordpressStrategy';
import { RefreshTokenAuthGuard } from '../guards/RefreshToken-auth.guard';
import { WordpressAuthGuard } from '../guards/Wordpress-auth.guard';
import { JWTTokenAuthGuard } from '../guards/JWTToken-auth.guard';
import { UsersService } from '../users/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/user.model';
import { Roles } from '../roles/roles.model';
import { RolesService } from '../roles/roles.service';


@Module({
  imports: [
    TypeOrmModule.forFeature([User, Roles]),
    UsersModule, 
    HttpModule,
    PassportModule.register({defaultStrategy: 'bearer'}),
  ],
  controllers: [AuthController],
  providers: [
    UsersService,
    RolesService,
    RefreshTokenAuthGuard, 
    JWTTokenAuthGuard, 
    AuthService, 
    JwtStrategy, 
    LocalStrategy, 
    JwtRefreshStrategy,
    WordpressAuthGuard,
    WordpressStrategy
  ],
  exports: [
    RefreshTokenAuthGuard, 
    AuthService, 
    JwtStrategy, 
    LocalStrategy, 
    JwtRefreshStrategy,
    WordpressStrategy
  ],
})
export class AuthModule { }