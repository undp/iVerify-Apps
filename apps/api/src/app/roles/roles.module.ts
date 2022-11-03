import { Module } from '@nestjs/common';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';
import { JWTTokenAuthGuard } from '../guards/JWTToken-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/user.model';
import { Roles } from './roles.model';
import { Locations } from '../locations/models/locations.model';
import { LocationsService } from '../locations/locations.service';

@Module({
    imports: [TypeOrmModule.forFeature([Locations, User, Roles])],
    controllers: [RolesController],
    providers: [RolesService, JWTTokenAuthGuard, RolesGuard, LocationsService],
    exports: [RolesService, JWTTokenAuthGuard],
})
export class RolesModule {}
