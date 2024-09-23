import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('users')
@ApiTags('Users')
export class UsersController {
    @Get()
    @ApiOperation({
        summary: 'Get all users',
        description: 'Returns a paginated list of all users'
    })
    getUsers(): string {
        return 'This action returns all users';
    }

    @Get(':id')
    @ApiOperation({
        summary: 'Get user by ID',
        description: 'Returns a user by ID'
    })
    getUser(): string {
        return 'This action returns a user';
    }
}
