import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiCreatedResponse, ApiExcludeEndpoint, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { configService } from '@kb-config';
import { ApiOkResponsePaginated, DisableInProduction } from '@kb-decorators';
import { CreateUser, PageOptionsModel, User } from '@kb-models';

import { UsersService } from './users.service';
import { ILike } from 'typeorm';

@Controller('api/users')
@ApiTags('Users')
export class UsersController {
  constructor(
        private readonly usersService: UsersService
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Create user',
    description: 'Creates a new user'
  })
  @ApiCreatedResponse({
    description: 'User created',
    type: User
  })
  @ApiExcludeEndpoint(configService.isDevelopmentMode)
  @DisableInProduction()
  async createUserDev(@Body() body: CreateUser) {
    return await this.usersService.create(body as User);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all users',
    description: 'Returns a paginated list of all users'
  })
  @ApiOkResponsePaginated(User)
  async getUsers(
    @Query() pageOptions: PageOptionsModel
  ) {
    return await this.usersService.findAll(pageOptions, {
      username: ILike(`%${ pageOptions.query }%`)
    });
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get user by ID',
    description: 'Returns a user by ID'
  })
  @ApiOkResponse({
    description: 'User',
    type: User
  })
  async getUser(
      @Param('id') id: string
  ) {
    return await this.usersService.findOne(id);
  }
}
