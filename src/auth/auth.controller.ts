import { Request } from 'express';

import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('auth')
@ApiTags('Authentication')
export class AuthController {
  @Get('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiCookieAuth()
  @ApiOperation({
    summary: 'Logout',
    description: [
      'Clears the `kibibit-jwt` cookie. ',
      'This effectively logs out the user. ',
      '**Note that the JWT token is still valid until it expires.**'
    ].join('')
  })
  logout(@Req() req: Request) {
    req.res.clearCookie('kibibit-jwt');
    return { message: 'Logged out' };
  }
}
