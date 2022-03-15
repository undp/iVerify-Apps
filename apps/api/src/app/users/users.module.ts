import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './user.model';
import { InfoLogger } from '../logger/info-logger.service';
import { RefreshTokenAuthGuard } from '../guards/RefreshToken-auth.guard';
import { JWTTokenAuthGuard } from '../guards/JWTToken-auth.guard';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Roles } from '../roles/roles.model';


@Module({
    imports: [TypeOrmModule.forFeature([User, Roles])],
    controllers: [UsersController],
    providers: [UsersService, InfoLogger, JWTTokenAuthGuard, RefreshTokenAuthGuard],
    exports: [ UsersService, InfoLogger],
})
export class UsersModule { }