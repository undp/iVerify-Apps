import { Controller, UseGuards, HttpStatus, Response, Get, Post, Body, BadRequestException, Query, NotFoundException, Put, Delete, BadGatewayException, Injectable, Scope, Inject } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service'
import { CreateUserDto } from './dto/createUser.dto';
import { InfoLogger } from '../logger/info-logger.service';
import { JWTTokenAuthGuard } from '../guards/JWTToken-auth.guard';
import { userMessages } from '../../constant/messages';
import { GetUserDto } from './dto/getUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { RolesGuard } from '../guards/roles.guard';
import { PaginationQueryDto } from '../common/pagination-query.dto';
import { SAMLAuthGuard } from '../guards/SAML-auth.guard';
@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
@Injectable({ scope: Scope.REQUEST })
export class UsersController {
    constructor(private readonly usersService: UsersService,
        private rstLogger: InfoLogger,
        @Inject(REQUEST) private readonly request: Request) {
        this.rstLogger.setContext('UserController');
    }

    @Post()
    @UseGuards(JWTTokenAuthGuard)
    public async register(@Body() createUserDto: CreateUserDto) {
        let result: any;
        const userId = this.request.user && this.request.user['id'] ? this.request.user['id'] : null;
        result = await this.usersService.registerUser(createUserDto, userId);
        if (!result) {
            this.rstLogger.error('User creation Failed');
            throw new BadRequestException();
        }
        return { message: userMessages.createSucess, data: result };
    }

    @Get()
    @UseGuards(JWTTokenAuthGuard, RolesGuard)
    public async getUsers(@Query() paginationQuery: PaginationQueryDto) {
        const result = await this.usersService.findAll(paginationQuery);
        if (!result) throw new NotFoundException(userMessages.userNotFound);
        return { data: result };
    }


    @Get('UserId')
    @UseGuards(JWTTokenAuthGuard)
    async getUser(@Query() getUser: GetUserDto) {
        const user = await this.usersService.findByEmail(getUser.userId);
        if (!user) throw new NotFoundException(userMessages.userNotFound);
        return { data: user };
    }

    @Put()
    @UseGuards(JWTTokenAuthGuard, RolesGuard)
    async editUser(
        @Query() user: GetUserDto,
        @Body() editUserDto: UpdateUserDto
    ) {
        const editedUser = await this.usersService.update(user.userId, editUserDto);
        if (!editedUser) throw new BadGatewayException(userMessages.userUpdateFail);
        return { message: userMessages.userUpdateSucess, data: editedUser };
    }

    @Delete()
    @UseGuards(JWTTokenAuthGuard, RolesGuard)
    async deleteUser(@Query() user: GetUserDto) {
        const deletedUser = await this.usersService.deleteUser(user.userId);
        if (!deletedUser) throw new BadGatewayException(userMessages.userDeleteFail);
        return { message: userMessages.userDeleteSucess }
    }
}
