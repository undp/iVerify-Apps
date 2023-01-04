import {
    Controller,
    Post,
    Body,
    Get,
    BadRequestException,
    NotFoundException,
    Put,
    Query,
    Delete,
    UseGuards,
    Injectable,
    Inject,
    BadGatewayException,
    Logger,
    Req,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiExcludeEndpoint } from '@nestjs/swagger';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/createRole.dto';
import { RolesGuard } from '../guards/roles.guard';
import { JWTTokenAuthGuard } from '../guards/JWTToken-auth.guard';
import { EditRoleDto } from './dto/editRole.dto';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { GetRoleDto } from './dto/getRole.dto';
import { roleMessages } from '../../constant/messages';
import { PaginationQueryDto } from '../common/pagination-query.dto';
import { RolesResponseDto } from './dto/roleResponse.dto';
import { isEmpty } from 'radash';

@Controller('roles')
@ApiTags('roles')
@ApiBearerAuth()
@Injectable()
export class RolesController {
    private logger = new Logger(RolesController.name);

    constructor(
        private readonly rolesService: RolesService,
        @Inject(REQUEST) private readonly request: Request
    ) {}

    @Post()
    @UseGuards(JWTTokenAuthGuard, RolesGuard)
    async create(
        @Body() createRoleDto: CreateRoleDto
    ): Promise<RolesResponseDto> {
        const userId =
            this.request.user && this.request.user['id']
                ? this.request.user['id']
                : 1;
        if (userId) {
            const userRoles = await this.rolesService.createRole(
                createRoleDto,
                userId
            );
            if (!userRoles) {
                this.logger.error(roleMessages.roleCreateFail);
                throw new BadRequestException(roleMessages.roleCreateFail);
            }
            return { message: roleMessages.roleCreateSucess, data: userRoles };
        } else {
            throw new BadRequestException();
        }
    }

    @Get()
    @UseGuards(JWTTokenAuthGuard, RolesGuard)
    async getRoles(
        @Query() paginationDto: PaginationQueryDto,
        @Req() request: Request
    ): Promise<RolesResponseDto> {
        const locationId = request.headers['locationId'] as string;

        const roles = await this.rolesService.getRoles(
            locationId,
            paginationDto
        );
        return { data: roles };
    }

    @Get('RoleId')
    @UseGuards(JWTTokenAuthGuard, RolesGuard)
    async getRole(
        @Query() roleId: GetRoleDto,
        @Req() request: Request
    ): Promise<RolesResponseDto> {
        const locationId = request.headers['locationId'] as string;

        const userRole = await this.rolesService.findByRoleId(
            locationId,
            roleId.roleId
        );

        if (isEmpty(userRole)) {
            throw new NotFoundException(roleMessages.roleNotFound);
        }
        return { data: userRole };
    }

    @Put()
    @UseGuards(JWTTokenAuthGuard, RolesGuard)
    async editRole(
        @Query() roleId: GetRoleDto,
        @Body() editRoleDto: EditRoleDto
    ): Promise<RolesResponseDto> {
        const userId = this.request.user['id'];
        if (userId) {
            const editedRole = await this.rolesService.updateRole(
                roleId.roleId,
                editRoleDto,
                userId
            );

            if (isEmpty(editedRole)) {
                throw new BadGatewayException(roleMessages.roleUpdateFail);
            }

            return {
                message: roleMessages.roleUpdateSuccess,
                data: editedRole,
            };
        } else {
            throw new BadRequestException();
        }
    }

    @Delete()
    @UseGuards(JWTTokenAuthGuard, RolesGuard)
    async deleteRole(@Query() roleId: GetRoleDto): Promise<RolesResponseDto> {
        const deletedRole = await this.rolesService.deleteRole(roleId.roleId);

        if (!deletedRole) {
            throw new BadGatewayException(roleMessages.roleDeleteFail);
        }

        return { message: roleMessages.roleDeleteSucess };
    }

    @Post('createDefaultRole')
    @ApiExcludeEndpoint()
    async createDefaultRole(): Promise<RolesResponseDto> {
        const adminRole = await this.rolesService.createDefaultAdminRole();

        if (isEmpty(adminRole)) {
            this.logger.error(roleMessages.roleCreateFail);
            throw new BadRequestException(roleMessages.roleCreateFail);
        }

        return { message: adminRole.message, data: adminRole.roleData };
    }
}
