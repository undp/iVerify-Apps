import { Controller, UseGuards, Get, Post, Body, BadRequestException, Query, NotFoundException, Put, Delete, BadGatewayException, Injectable, Scope, Inject, Logger } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service'
import { CreateUserDto } from './dto/createUser.dto';
import { JWTTokenAuthGuard } from '../guards/JWTToken-auth.guard';
import { userMessages } from '../../constant/messages';
import { GetUserDto } from './dto/getUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { RolesGuard } from '../guards/roles.guard';
import { PaginationQueryDto } from '../common/pagination-query.dto';
@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
@Injectable()
export class UsersController {

  private logger = new Logger(UsersController.name);

  constructor(
    private readonly usersService: UsersService,
    @Inject(REQUEST) private readonly request: Request
  ) {
  }

  @Post()
  // @UseGuards(JWTTokenAuthGuard)
  public async register(@Body() createUserDto: CreateUserDto) {

    const userId = this.request.user && this.request.user['id'] ? this.request.user['id'] : null;
    const result = await this.usersService.registerUser(createUserDto, userId);
    if (!result) {
      this.logger.error('User creation Failed');
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
    // const userId = this.request.user['id'];
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
