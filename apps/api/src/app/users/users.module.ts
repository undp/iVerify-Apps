import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserSchema } from './user.model';
import { InfoLogger } from '../logger/info-logger.service';
import { RefreshTokenAuthGuard } from '../guards/RefreshToken-auth.guard';
import { JWTTokenAuthGuard } from '../guards/JWTToken-auth.guard';
import { DatabaseService } from '../services/database.service';


@Module({
    imports: [MongooseModule.forFeature([{ name: 'User', schema: UserSchema }])],
    controllers: [UsersController],
    providers: [UsersService, InfoLogger, JWTTokenAuthGuard, RefreshTokenAuthGuard, DatabaseService],
    exports: [ UsersService, InfoLogger, MongooseModule.forFeature([{ name: 'User', schema: UserSchema }])],
})
export class UsersModule { }