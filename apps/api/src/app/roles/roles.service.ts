import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateRoleDto } from "./dto/createRole.dto";
import { InfoLogger } from "../logger/info-logger.service";
import { EditRoleDto } from './dto/editRole.dto';
import { Roles } from './roles.model';
import { roleMessages } from '../../constant/messages';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { PaginationQueryDto } from "../common/pagination-query.dto";


@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Roles)
    private readonly rolesRepository: Repository<Roles>,
    private infoLogger: InfoLogger,
  ) {
    this.infoLogger.setContext("RolesServices");
  }

  async createRole(createRoleDto: CreateRoleDto, userId: number): Promise<Roles> {
    createRoleDto.resource = JSON.stringify(createRoleDto.resource);
    createRoleDto['createdBy'] = 1;
    createRoleDto['updatedBy'] = 1;
    const role = await this.rolesRepository.create(createRoleDto);
    return this.rolesRepository.save(role);
  }

  async getRoles(paginationDto: PaginationQueryDto) {
    const { limit, offset } = paginationDto;
    return await this.rolesRepository.find({
        skip: offset,
        take: limit
    });
  }

  async findOne(name: string): Promise<Roles> {
    const role: Roles = await this.rolesRepository.findOne({name});
    if(!role) throw new NotFoundException(`Role with name ${name} not found`);
    return role;
  }

  async findByRoleId(id: string): Promise<Roles> {
    const role: Roles = await this.rolesRepository.findOne(id);
    if(!role) throw new NotFoundException(`Role with id ${id} not found`);
    return role;
  }

  async updateRole(id: string, newValue: EditRoleDto, userId: number): Promise<Roles> {
    newValue['updatedBy'] = userId;
    newValue.resource = newValue.resource ? JSON.stringify(newValue.resource) : null;
    if(!newValue.resource) delete newValue.resource;
    const role: Roles = await this.rolesRepository.preload({
      id: +id,
      ...newValue
    })
    if (!role) throw new NotFoundException(roleMessages.roleNotFound);
    return this.rolesRepository.save(role);    
  }

  async deleteRole(id: string): Promise<any> {
    const role: Roles = await this.findByRoleId(id);
    return this.rolesRepository.save(role);
  }
}
