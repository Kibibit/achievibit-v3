import { instanceToPlain } from 'class-transformer';
import { Request, Response } from 'express';
import { UserSettings } from 'src/models/user-settings.entity';

import { Body, Controller, Get, Header, NotImplementedException, Param, Patch, Req, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiCookieAuth, ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';

import { ReqUser } from '@kb-decorators';
import { JwtAuthGuard } from '@kb-guards';
import { SystemEnum, User } from '@kb-models';
import { ShieldsService } from '@kb-shields';
import { UsersService } from '@kb-users';

import { SessionUserService } from './session-user.service';

@Controller('api/me')
@ApiTags('Session User')
export class SessionUserController {
  constructor(
    private readonly sessionUserService: SessionUserService,
    private readonly shieldsService: ShieldsService,
    private readonly usersService: UsersService
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiCookieAuth()
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

  @Get('shield')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiCookieAuth()
  @ApiOperation({
    summary: 'Get shield',
    description: 'Returns the shield for the current user. Requires a valid JWT token'
  })
  @ApiOkResponse({
    description: 'Current user shield',
    type: 'string'
  })
  @Header('Content-Type', 'image/svg+xml')
  getSessionUserShield(@Req() req: Request) {
    return this.shieldsService.generate(
      'achievements',
      (req.user as User).username
    );
  }

  @Get('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiCookieAuth()
  @ApiOperation({
    summary: 'Logout',
    description: 'Clears the JWT cookie, and invalidates the JWT token'
  })
  logout(
    @Req() req: Request,
    @Res() res: Response
  ) {
    res.clearCookie('kibibit-jwt');

    // redirect to home
    res.redirect('/');
    // return { message: 'Logged out' };
  }

  @Get('settings')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiCookieAuth()
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
  @ApiCookieAuth()
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
  @ApiCookieAuth()
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
  @ApiCookieAuth()
  @ApiOperation({
    summary: 'Get current user integration',
    description: 'Will return the currently integrated cloud git system with related repositories'
  })
  @ApiQuery({
    name: 'system',
    enum: SystemEnum,
    description: 'The cloud git system to get the available repositories for'
  })
  getSessionUserIntegration(
    @Param('system') system: SystemEnum
  ) {
    console.log('system', system);
    throw new NotImplementedException();
  }

  @Get('integrations/all/available')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiCookieAuth()
  @ApiOperation({
    summary: 'Get available repositories',
    description: 'Will return the available repositories for all cloud git systems'
  })
  async getSessionUserAllAvailableRepositories(@ReqUser() user: User) {
    const dbUser = await this.usersService.findOne(user.username);

    return await this.sessionUserService.getAllReposAccessibleByUser(dbUser);
  }

  @Get('integrations/:system/available')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiCookieAuth()
  @ApiOperation({
    summary: 'Get available repositories',
    description: 'Will return the available repositories for the given cloud git system'
  })
  // @ApiQuery({
  //   name: 'system',
  //   enum: SystemEnum,
  //   description: 'The cloud git system to get the available repositories for'
  // })
  async getSessionUserAvailableRepositories(
    @Param('system') system: SystemEnum,
    @ReqUser() user: User
  ) {
    console.log('system', system);
    const dbUser = await this.usersService.findOne(user.username);
    if (system === SystemEnum.GITLAB) {
      return await this.sessionUserService.getGitlabReposAccessibleByUser(dbUser);
    }

    if (system === SystemEnum.BITBUCKET) {
      return await this.sessionUserService.getBitbucketReposAccessibleByUser(dbUser);
    }

    return await this.sessionUserService.getGithubReposAccessibleByUser(dbUser);
  }
}
