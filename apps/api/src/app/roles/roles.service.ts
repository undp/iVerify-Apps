import { Injectable, NotFoundException, ConflictException } from "@nestjs/common";
import { CreateRoleDto } from "./dto/createRole.dto";
import { InfoLogger } from "../logger/info-logger.service";
import { EditRoleDto } from './dto/editRole.dto';
import { DatabaseService } from '../services/database.service';
import { Roles } from './roles.model';
import { roleMessages } from '../../constant/messages';
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { PaginationQueryDto } from "../users/dto/paginationQuery.dto";


@Injectable()
export class RolesService {
  constructor(
    @InjectModel('Roles') private readonly roleModel: Model<Roles>,
    private infoLogger: InfoLogger,
    private readonly databaseService: DatabaseService,
  ) {
    this.infoLogger.setContext("RolesServices");
  }

  async createRole(createRoleDto: CreateRoleDto, userId: number): Promise<Roles> {
    const userRole = await this.databaseService.findOne(this.roleModel, { name: createRoleDto.name });
    if (userRole) {
      throw new ConflictException(roleMessages.duplicateRole);
    } else {
      createRoleDto.resource = JSON.stringify(createRoleDto.resource);
      createRoleDto['createdBy'] = userId;
      createRoleDto['updatedBy'] = userId;
      return await this.databaseService.create(this.roleModel, createRoleDto);
    }
  }

  async getRoles(paginationDto: PaginationQueryDto) {
    return await this.databaseService.paginate(this.roleModel,paginationDto)
  }

  async findOne(options: object): Promise<Roles> {
    return await this.databaseService.findOne(this.roleModel, options);
  }

  async findByRoleId(ID: string): Promise<Roles> {
    return await this.databaseService.findById(this.roleModel, ID);
  }

  async updateRole(ID: string, newValue: EditRoleDto, userId: number): Promise<Roles> {
    const role = await this.databaseService.findById(this.roleModel, ID);
    if (!role) {
      throw new NotFoundException(roleMessages.roleNotFound);
    } else {
      newValue['updatedBy'] = userId;
      newValue.resource = newValue.resource ? JSON.stringify(newValue.resource) : role.resource;
      return await this.databaseService.findByIdAndUpdate(this.roleModel, ID, newValue);
    }
  }

  async deleteRole(ID: string): Promise<any> {
    return await this.databaseService.findByIdAndRemove(this.roleModel, ID);
  }
}
