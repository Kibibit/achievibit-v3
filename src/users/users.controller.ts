import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';

@Controller('users')
@ApiTags('Users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService
    ) {}

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
