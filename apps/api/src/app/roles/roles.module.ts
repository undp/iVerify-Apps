import { Module } from '@nestjs/common';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';
import { InfoLogger } from '../logger/info-logger.service';
import { JWTTokenAuthGuard } from '../guards/JWTToken-auth.guard';
import { DatabaseService } from '../services/database.service';
import { Roles, RolesSchema } from './roles.model';
import { RolesGuard } from '../guards/roles.guard';
import { User, UserSchema } from '../users/user.model';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Roles', schema: RolesSchema }]), MongooseModule.forFeature([{ name: 'User', schema: UserSchema }])],
  controllers: [RolesController],
  providers: [RolesService, InfoLogger, JWTTokenAuthGuard,RolesGuard, DatabaseService],
  exports: [RolesService, JWTTokenAuthGuard, InfoLogger],
})
export class RolesModule { }
