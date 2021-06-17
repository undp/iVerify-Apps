import { Model } from 'mongoose';
import { Injectable, BadRequestException, BadGatewayException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from './dto/createUser.dto';
import { hash, compare } from 'bcryptjs';
import { InfoLogger } from '../logger/info-logger.service';
import { User } from './user.model';
import { PaginationQueryDto } from './dto/paginationQuery.dto';
import { DatabaseService } from '../services/database.service';
import { userMessages } from '../../constant/messages';
import { UpdateUserDto } from './dto/updateUser.dto';

@Injectable()
export class UsersService {

    constructor(
        @InjectModel('User') private readonly userModel: Model<User>,
        private readonly databaseService: DatabaseService,
        private infoLogger: InfoLogger) {
        this.infoLogger.setContext('UserServices');
    }

    public async findAll(paginationQuery: PaginationQueryDto): Promise<User[]> {    
        return await this.databaseService.paginate(this.userModel,paginationQuery, 'roles')
    }

    async findOne(options: object): Promise<User> {
        return await this.databaseService.findOne(this.userModel, options);
    }


    async getUserWithPassword(options: object): Promise<User> {
        return await this.userModel.findOne(options).select('+password').exec();
    }

    async findById(ID: string): Promise<User> {
        return await this.databaseService.findById(this.userModel, ID, 'roles');
    }

    async registerUser(user: CreateUserDto, userId: string) {
        
        user.password = await this.encryptPassword(user.password);
        user['createdBy'] = userId;
        user['roles'] = user.roleId;
        delete user.roleId;
        let userData = await  this.databaseService.create(this.userModel,user);
        if(userData) {
            delete userData.password;
            return userData;
        } else {
            throw new BadGatewayException(userMessages.createFail)
        }
    }
    
    async update(ID: string, newValue: UpdateUserDto, userId: string) {
        const user = await this.databaseService.findById(this.userModel,ID);
        if (!user._id) {
            throw new NotFoundException(userMessages.userNotFound)
        } else {
            newValue['updatedBy'] = userId
            return await this.databaseService.findByIdAndUpdate(this.userModel, ID, newValue);
        }
    }
    
    async deleteUser(ID: string): Promise<any> {
        return await this.databaseService.findByIdAndRemove(this.userModel, ID);
    }

    async encryptPassword(password) {
        return await hash(password, 10);
    }

    async comparePassword(passport, comparePassword) {
        return await compare(passport, comparePassword);
    }
}