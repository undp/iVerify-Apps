import {
    BadGatewayException,
    forwardRef,
    Inject,
    Injectable,
    Logger,
    NotFoundException,
} from '@nestjs/common';
import { CreateRoleDto } from './dto/createRole.dto';
import { EditRoleDto } from './dto/editRole.dto';
import { Roles } from './roles.model';
import { roleMessages } from '../../constant/messages';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { PaginationQueryDto } from '../common/pagination-query.dto';
import { isEmpty } from 'radash';
import { LocationsService } from '../locations/locations.service';

import * as pMap from 'p-map';
import { Locations } from '../locations/models/locations.model';
import { RolesDto } from './dto/role.dto';

@Injectable()
export class RolesService {
    private logger = new Logger(RolesService.name);

    constructor(
        @InjectRepository(Roles)
        private readonly rolesRepository: Repository<Roles>,

        @Inject(forwardRef(() => LocationsService))
        private locationsService: LocationsService
    ) {}

    async createRole(
        createRoleDto: CreateRoleDto,
        userId: number
    ): Promise<RolesDto> {
        try {
            createRoleDto.resource = JSON.stringify(createRoleDto.resource);
            createRoleDto['createdBy'] = userId;
            createRoleDto['updatedBy'] = userId;

            const role = await this.rolesRepository.create(createRoleDto);

            const persistedRole = await this.rolesRepository.save(role);

            return persistedRole.toDto();
        } catch (err) {
            this.logger.error(err);
            throw err;
        }
    }

    async getRoles(
        locationId: string,
        paginationDto: PaginationQueryDto
    ): Promise<RolesDto[]> {
        try {
            const { limit, offset } = paginationDto;

            const criteria = {
                take: limit,
                skip: offset,
                where: {
                    locationId,
                },
            };

            const result = await this.rolesRepository.find(criteria);

            return result.map((role: Roles) => role.toDto());
        } catch (err) {
            this.logger.error(err);
            throw err;
        }
    }

    async findOne(name: string, locationId: string): Promise<RolesDto> {
        try {
            const role: Roles = await this.rolesRepository.findOne({
                where: { name, locationId },
            });

            if (!isEmpty(role)) {
                throw new NotFoundException(`Role with name ${name} not found`);
            }

            return role.toDto();
        } catch (err) {
            this.logger.error(err);
            throw err;
        }
    }

    async findByRoleId(id: string, locationId: string): Promise<RolesDto> {
        try {
            const role: Roles = await this.rolesRepository.findOne({
                where: {
                    id: Number(id),
                    locationId,
                },
            });

            if (isEmpty(role)) {
                throw new NotFoundException(`Role with id ${id} not found`);
            }

            return role.toDto();
        } catch (err) {
            this.logger.error(err);
            throw err;
        }
    }

    async updateRole(
        id: string,
        newValue: EditRoleDto,
        userId: number
    ): Promise<RolesDto> {
        try {
            newValue['updatedBy'] = userId;

            newValue.resource = newValue.resource
                ? JSON.stringify(newValue.resource)
                : null;

            if (!newValue.resource) {
                delete newValue.resource;
            }

            const role: Roles = await this.rolesRepository.preload({
                id: +id,
                ...newValue,
            });

            if (isEmpty(role)) {
                throw new NotFoundException(roleMessages.roleNotFound);
            }

            const result = await this.rolesRepository.save(role);

            return result.toDto();
        } catch (err) {
            this.logger.error(err);
            throw err;
        }
    }

    async deleteRole(id: string): Promise<DeleteResult> {
        try {
            return await this.rolesRepository.delete(id);
        } catch (err) {
            this.logger.error(err);
            throw err;
        }
    }

    async createDefaultAdminRole(): Promise<any> {
        try {
            const locations = await this.locationsService.findAll({
                limit: Infinity,
                offset: 0,
            });

            const result = await pMap(
                locations,
                async ({ id }: Locations) => {
                    let scopedResult: any;

                    try {
                        const getRoleData: Roles =
                            await this.rolesRepository.findOne({
                                where: {
                                    name: 'admin',
                                    locationId: id,
                                },
                            });

                        if (getRoleData) {
                            scopedResult = {
                                message: 'admin role already present',
                                roleData: getRoleData,
                            };
                        } else {
                            const resourceObj = [
                                {
                                    name: 'users',
                                    permissions: [
                                        'read',
                                        'write',
                                        'update',
                                        'delete',
                                    ],
                                },
                                {
                                    name: 'roles',
                                    permissions: [
                                        'read',
                                        'write',
                                        'update',
                                        'delete',
                                    ],
                                },
                            ];

                            const createRoleDto: CreateRoleDto = {
                                name: 'admin',
                                description: 'Admin Role',
                                resource: JSON.stringify(resourceObj),
                                locationId: id,
                            };

                            createRoleDto['createdBy'] = 1;
                            createRoleDto['updatedBy'] = 1;

                            const role =
                                this.rolesRepository.create(createRoleDto);

                            const adminRole = await this.rolesRepository.save(
                                role
                            );

                            if (adminRole) {
                                scopedResult = {
                                    message: roleMessages.roleCreateSucess,
                                    roleData: adminRole,
                                };
                            } else {
                                scopedResult = {
                                    message: roleMessages.roleCreateFail,
                                    roleData: adminRole,
                                };
                            }
                        }

                        return scopedResult;
                    } catch (e) {
                        throw new BadGatewayException(
                            roleMessages.roleCreateFail
                        );
                    }
                },
                {
                    concurrency: 2,
                    stopOnError: false,
                }
            );

            return result;
        } catch (err) {
            this.logger.error(err);
            throw err;
        }
    }
}
