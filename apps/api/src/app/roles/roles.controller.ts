import { Controller, Post, Body, Get, BadRequestException, NotFoundException, Put, Query, Delete, UseGuards, Injectable, Scope, Inject, BadGatewayException } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { RolesService } from './roles.service'
import { CreateRoleDto } from './dto/createRole.dto';
import { InfoLogger } from '../logger/info-logger.service';
import { RolesGuard } from '../guards/roles.guard';
import { JWTTokenAuthGuard } from '../guards/JWTToken-auth.guard';
import { EditRoleDto } from './dto/editRole.dto';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { GetRoleDto } from './dto/getRole.dto';
import { roleMessages } from '../../constant/messages';
import { PaginationQueryDto } from '../common/pagination-query.dto';

@Controller('roles')
@ApiTags('roles')
@ApiBearerAuth()
@Injectable({ scope: Scope.REQUEST })
export class RolesController {
    constructor(private readonly rolesService: RolesService,
        private infoLogger: InfoLogger,
        @Inject(REQUEST) private readonly request: Request) {
        this.infoLogger.setContext('RolesController');
    }

    @Post()
    @UseGuards(JWTTokenAuthGuard, RolesGuard)
    async create(@Body() createRoleDto: CreateRoleDto) {
        const userId = this.request.user && this.request.user['id'] ? this.request.user['id'] : 1;
        if (userId) {
            const userRoles = await this.rolesService.createRole(createRoleDto, userId);
            if (!userRoles) {
                this.infoLogger.error(roleMessages.roleCreateFail);
                throw new BadRequestException(roleMessages.roleCreateFail);
            }
            return { message: roleMessages.roleCreateSucess, data: userRoles, };
        } else {
            throw new BadRequestException();
        }
    }

    @Get()
    @UseGuards(JWTTokenAuthGuard, RolesGuard)
    async getRoles(@Query() paginationDto: PaginationQueryDto) {
        const roles = await this.rolesService.getRoles(paginationDto);
        return { data: roles };
    }

    @Get('RoleId')
    @UseGuards(JWTTokenAuthGuard, RolesGuard)
    async getRole(@Query() roleId: GetRoleDto) {
        const userRole = await this.rolesService.findByRoleId(roleId.roleId);
        if (!userRole) throw new NotFoundException(roleMessages.roleNotFound);
        return { data: userRole };

    }

    @Put()
    @UseGuards(JWTTokenAuthGuard, RolesGuard)
    async editRole(
        @Query() roleId: GetRoleDto,
        @Body() editRoleDto: EditRoleDto
    ) {
        const userId = this.request.user['id'];
        if (userId) {
            const editedRole = await this.rolesService.updateRole(roleId.roleId, editRoleDto, userId);
            if (!editedRole) throw new BadGatewayException(roleMessages.roleUpdateFail);
            return { message: roleMessages.roleUpdateSuccess, data: editedRole }
        } else {
            throw new BadRequestException();
        }
    }


    @Delete()
    @UseGuards(JWTTokenAuthGuard, RolesGuard)
    async deleteRole(@Query() roleId: GetRoleDto) {
        const deletedRole = await this.rolesService.deleteRole(roleId.roleId);
        if (!deletedRole) throw new BadGatewayException(roleMessages.roleDeleteFail);
        return { message: roleMessages.roleDeleteSucess };
    }
}
