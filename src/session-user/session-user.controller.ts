import { instanceToPlain } from 'class-transformer';
import { Request } from 'express';
import { UserSettings } from 'src/models/user-settings.entity';

import { Body, Controller, Get, NotImplementedException, Patch, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '@kb-guards';
import { User } from '@kb-models';

@Controller('me')
@ApiTags('Session User')
export class SessionUserController {
  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get current user',
    description: 'Returns the current user. Requires a valid JWT token'
  })
  @ApiOkResponse({
    description: 'Current user',
    type: User
  })
  getSessionUser(@Req() req: Request) {
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

  @Get('settings')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get current user settings',
    description: 'Returns the current user settings. Requires a valid JWT token'
  })
  @ApiOkResponse({
    description: 'Current user settings',
    type: UserSettings
  })
  getSessionUserSettings(@Req() req: Request) {
    throw new NotImplementedException();
  }

  @Patch('settings')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update current user settings',
    description: 'Updates the current user settings. Requires a valid JWT token'
  })
  @ApiOkResponse({
    description: 'Updated user settings',
    type: UserSettings
  })
  updateSessionUserSettings(@Body() body: UserSettings) {
    throw new NotImplementedException();
  }

  @Get('integrations')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get current user integrations',
    description: 'Will return the currently integrated cloud git systems'
  })
  getSessionUserIntegrations(@Req() req: Request) {
    throw new NotImplementedException();
  }

  @Get('integrations/:system')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get current user integration',
    description: 'Will return the currently integrated cloud git system with related repositories'
  })
  getSessionUserIntegration(@Req() req: Request) {
    throw new NotImplementedException();
  }

  @Get('integrations/:system/available')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get available repositories',
    description: 'Will return the available repositories for the given cloud git system'
  })
  getSessionUserAvailableRepositories(@Req() req: Request) {
    throw new NotImplementedException();
  }
}
