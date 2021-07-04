import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/createUser.dto';
import { hash, compare } from 'bcryptjs';
import { InfoLogger } from '../logger/info-logger.service';
import { User } from './user.model';
import { UpdateUserDto } from './dto/updateUser.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Roles } from '../roles/roles.model';
import { PaginationQueryDto } from '../common/pagination-query.dto';

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Roles)
        private readonly rolesRepository: Repository<Roles>,
        private infoLogger: InfoLogger) {
        this.infoLogger.setContext('UserServices');
    }

    public async findAll(paginationQuery: PaginationQueryDto): Promise<User[]> {    
        const { limit, offset } = paginationQuery;
        return await this.userRepository.find({
            relations: ['roles'],
            skip: offset,
            take: limit
        });
    }

    async findOne(id: string): Promise<User> {
        const user: User = await this.userRepository.findOne(id, {relations: ['roles']});
        if(!user) throw new NotFoundException(`User with id ${id} not found`);
        return user;        
    }

    async findByEmail(email: string): Promise<User> {
        const user: User = await this.userRepository.findOne({email}, {relations: ['roles']});
        if(!user) throw new NotFoundException(`User with email ${email} not found`);
        return user;        
    }

    async registerUser(userDto: CreateUserDto, userId: string) {        
        userDto.password = await this.encryptPassword(userDto.password);
        userDto['createdBy'] = userId;
        const roles: Roles[] = await Promise.all(
            userDto.roles.map(role => this.preloadRoleByName(role))
        ) 

        const user = await  this.userRepository.create({...userDto, roles});
        return this.userRepository.save(user);
    }
    
    async update(id: string, updateDto: UpdateUserDto) {
        if(updateDto['password']) updateDto.password = await this.encryptPassword(updateDto.password);
        const roles: Roles[] = updateDto['roles'] ?
        await Promise.all(
            updateDto.roles.map(role => this.preloadRoleByName(role))
        ) :
        [];

        const user = await this.userRepository.preload({
            id: +id,
            ...updateDto,
            roles
        });
        if(!user) throw new NotFoundException(`User with id ${id} not found`);
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

    private async preloadRoleByName(name: string){
        const existingRole: Roles = await this.rolesRepository.findOne({name});
        if(existingRole) return existingRole;
        return this.rolesRepository.create({name})
    }
}