import { Module } from '@nestjs/common';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';
import { InfoLogger } from '../logger/info-logger.service';
import { JWTTokenAuthGuard } from '../guards/JWTToken-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/user.model';
import { Roles } from './roles.model';

@Module({
  imports: [TypeOrmModule.forFeature([User, Roles])],
  controllers: [RolesController],
  providers: [RolesService, InfoLogger, JWTTokenAuthGuard,RolesGuard],
  exports: [RolesService, JWTTokenAuthGuard, InfoLogger],
})
export class RolesModule { }
