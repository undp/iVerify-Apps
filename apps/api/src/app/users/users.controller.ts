import { Controller, UseGuards, HttpStatus, Response, Get, Post, Body, BadRequestException, Query, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service'
import { CreateUserDto } from './dto/createUser.dto';
import { InfoLogger } from '../logger/info-logger.service';
import { JWTTokenAuthGuard } from '../guards/JWTToken-auth.guard';
import { PaginationQueryDto } from './dto/paginationQuery.dto';
import { userMessages } from '../../constant/messages';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService, private rstLogger: InfoLogger) {
        this.rstLogger.setContext('UserController');
    }

    @Post()
    //@UseGuards(JWTTokenAuthGuard)
    public async register(@Body() createUserDto: CreateUserDto) {
        let result: any;
        result = await this.usersService.registerUser(createUserDto);
        if (!result) {
            this.rstLogger.error('User creation Failed');
            throw new BadRequestException();
        }
        return { message: userMessages.createSucess, data: result };
    }

    @Get()
    @UseGuards(JWTTokenAuthGuard)
    public async getUsers(@Query() paginationQuery: PaginationQueryDto) {
        const result = await this.usersService.findAll(paginationQuery);
        if (!result) throw new NotFoundException(userMessages.userNotFound);
        return { data: result };
    }
}
