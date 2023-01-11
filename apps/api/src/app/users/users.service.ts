import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/createUser.dto';
import { hash, compare } from 'bcryptjs';
import { User } from './user.model';
import { UpdateUserDto } from './dto/updateUser.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Roles } from '../roles/roles.model';
import { PaginationQueryDto } from '../common/pagination-query.dto';
import * as pMap from 'p-map';
import { isEmpty } from 'radash';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Roles)
        private readonly rolesRepository: Repository<Roles>
    ) {}

    public async findAll(paginationQuery: PaginationQueryDto): Promise<User[]> {
        const { limit, offset } = paginationQuery;
        return await this.userRepository.find({
            relations: ['roles'],
            skip: offset,
            take: limit,
        });
    }

    async findOne(id: string): Promise<User> {
        const user: User = await this.userRepository.findOne({
            where: {
                id: Number(id),
            },
            relations: ['roles'],
        });

        if (!user) {
            throw new NotFoundException(`User with id ${id} not found`);
        }
        return user;
    }

    async findByEmail(locationId: string, email: string): Promise<User> {
        if (email === process.env.DEFAULT_USER_EMAIL) {
            const defaultUserData = JSON.parse(
                process.env.DEFAULT_USER_DATA ?? ''
            );

            return defaultUserData as unknown as User;
        }

        const user: User = await this.userRepository.findOne({
            where: {
                email,
                locationId,
            },
            relations: ['roles'],
        });

        if (!user) {
            throw new NotFoundException(`User with email ${email} not found`);
        }

        return user;
    }

    async findOrRegister(
        userDto: CreateUserDto,
        userId: string
    ): Promise<User> {
        const email = userDto.email;
        const user: User = await this.userRepository.findOne({
            where: {
                email,
                locationId: userDto.locationId,
            },
            relations: ['roles'],
        });

        if (!user) {
            return await this.registerUser(userDto, userId);
        }
        return user;
    }

    async registerUser(userDto: CreateUserDto, userId: string) {
        userDto.password = await this.encryptPassword(userDto.password);
        userDto['createdBy'] = userId;

        const roles: Roles[] = await pMap(
            userDto.roles,
            async (role) => {
                return this.preloadRoleByName(userDto.locationId, role.name);
            },
            {
                concurrency: 4,
            }
        );

        const user = await this.userRepository.create({ ...userDto, roles });
        return this.userRepository.save(user);
    }

    async update(id: string, updateDto: UpdateUserDto) {
        if (updateDto['password'])
            updateDto.password = await this.encryptPassword(updateDto.password);
        let roles: Roles[];

        if (!isEmpty(updateDto.roles)) {
            roles = await pMap(
                updateDto.roles,
                async (role) => {
                    return this.preloadRoleByName(
                        updateDto.locationId,
                        role.name
                    );
                },
                {
                    concurrency: 4,
                }
            );
        } else {
            roles = [];
        }

        const user = await this.userRepository.preload({
            id: +id,
            ...updateDto,
            roles,
        });
        if (!user) throw new NotFoundException(`User with id ${id} not found`);
        return this.userRepository.save(user);
    }

    async deleteUser(id: string): Promise<any> {
        const user = await this.findOne(id);
        return this.userRepository.remove(user);
    }

    async encryptPassword(password) {
        return await hash(password, 10);
    }

    async comparePassword(passport, comparePassword) {
        return await compare(passport, comparePassword);
    }

    private async preloadRoleByName(locationId: string, name: string) {
        const existingRole: Roles = await this.rolesRepository.findOne({
            where: {
                name: name,
                locationId,
            },
        });

        if (existingRole) {
            return existingRole;
        }

        return this.rolesRepository.create({ name, locationId });
    }
}
