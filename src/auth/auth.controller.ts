import { instanceToPlain } from 'class-transformer';
import { Request } from 'express';

import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { User } from '@kb-models';

import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('auth')
@ApiTags('Authentication')
export class AuthController {
  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get current user',
    description: 'Returns the current user. Requires a valid JWT token'
  })
  me(@Req() req: Request) {
    return instanceToPlain(new User(req.user), { groups: [ 'self' ] });
  }

  @Get('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Logout',
    description: 'Clears the JWT cookie, and invalidates the JWT token'
  })
  logout(@Req() req: Request) {
    req.res.clearCookie('kibibit-jwt');
    return { message: 'Logged out' };
  }
}
