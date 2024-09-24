import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { User } from '@kb-models';

import { UsersService } from './users.service';

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
  async createUser(@Body() body: Partial<User>) {
    return await this.usersService.create(body as User);
  }

    @Get()
    @ApiOperation({
      summary: 'Get all users',
      description: 'Returns a paginated list of all users'
    })
    async getUsers() {
      return await this.usersService.findAll();
    }

    @Get(':id')
    @ApiOperation({
      summary: 'Get user by ID',
      description: 'Returns a user by ID'
    })
    async getUser(
        @Param('id') id: string
    ) {
      return await this.usersService.findOne(id);
    }
}
