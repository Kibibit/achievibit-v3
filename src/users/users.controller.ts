import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiExcludeEndpoint, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { CreateUser, PageModel, PageOptionsModel, User } from '@kb-models';

import { UsersService } from './users.service';
import { configService } from '@kb-config';

@Controller('users')
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
  @ApiOkResponse({
    description: 'User created',
    type: User
  })
  @ApiExcludeEndpoint(configService.isDevelopmentMode)
  async createUserDev(@Body() body: CreateUser) {
    return await this.usersService.create(body as User);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all users',
    description: 'Returns a paginated list of all users'
  })
  @ApiOkResponse({
    description: 'List of users',
    type: PageModel<User>,
    isArray: true
  })
  async getUsers(
    @Query() pageOptions: PageOptionsModel,
  ) {
    return await this.usersService.findAll(pageOptions);
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
