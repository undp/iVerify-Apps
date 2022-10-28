import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Roles } from "../roles/roles.model";
import { User } from "../users/user.model";
import { LocationsController } from "./locations.controller";
import { LocationsService } from "./locations.service";
import { Locations } from "./models/locations.model";


@Module({
    imports:[TypeOrmModule.forFeature([Locations, User, Roles])],
    controllers:[LocationsController],
    providers:[LocationsService],
    exports:[LocationsService]
})
export class LocationsModule{}