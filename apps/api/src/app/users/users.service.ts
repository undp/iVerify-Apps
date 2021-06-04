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

@Injectable()
export class UsersService {

    constructor(
        @InjectModel('User') private readonly userModel: Model<User>,
        private readonly databaseService: DatabaseService,
        private infoLogger: InfoLogger) {
        this.infoLogger.setContext('UserServices');
    }

    public async findAll(paginationQuery: PaginationQueryDto,): Promise<User[]> {    
        return await this.databaseService.paginate(this.userModel,paginationQuery)
    }

    async findOne(options: object): Promise<User> {
        return await this.databaseService.findOne(this.userModel, options);
    }


    async getUserWithPassword(options: object): Promise<User> {
        return await this.userModel.findOne(options).select('+password').exec();
    }

    async findById(ID: number): Promise<User> {
        return await this.databaseService.findOne(this.userModel, {_id: ID});
    }

    async registerUser(user: CreateUserDto) {
        
        user.password = await this.encryptPassword(user.password);
        let userData = await  this.databaseService.create(this.userModel,user);
        if(userData) {
            delete userData.password;
            return userData;
        } else {
            throw new BadGatewayException(userMessages.createFail)
        }
    }
    
    async update(ID: number, newValue: User): Promise<User> {
        const user = await this.userModel.findById(ID).exec();
        if (!user._id) {
            throw new NotFoundException(userMessages.userNotFound)
        } else {
            return await this.userModel.findByIdAndUpdate(ID, newValue).exec();
        }
    }
    
    async deleteUser(ID: number): Promise<any> {
        return await this.databaseService.findByIdAndRemove(this.userModel, ID);
    }

    async encryptPassword(password) {
        return await hash(password, 10);
    }

    async comparePassword(passport, comparePassword) {
        return await compare(passport, comparePassword);
    }
}