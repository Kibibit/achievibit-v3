import { instanceToPlain } from 'class-transformer';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { UserSettings } from 'src/models/user-settings.entity';
import { Octokit } from '@octokit/core';

import { Body, Controller, Delete, Get, NotImplementedException, Param, Patch, Post, Query, Req, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiCookieAuth, ApiOkResponse, ApiOperation, ApiQuery, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';

import { ReqUser } from '@kb-decorators';
import { EventsService } from '@kb-events';
import { JwtAuthGuard, JwtAuthOptionalGuard } from '@kb-guards';
import { SystemEnum, User } from '@kb-models';
import { RepositoriesService } from '@kb-repositories';
import { ShieldsService } from '@kb-shields';
import { UsersService } from '@kb-users';

import { SessionUserService } from './session-user.service';

@Controller('api/me')
@ApiTags('Session User')
export class SessionUserController {
  constructor(
    private readonly sessionUserService: SessionUserService,
    private readonly shieldsService: ShieldsService,
    private readonly usersService: UsersService,
    private readonly repositoriesService: RepositoriesService,
    private readonly eventsService: EventsService
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
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
    example: {
      message: 'Unauthorized',
      statusCode: StatusCodes.UNAUTHORIZED
    }
  })
  getSessionUser(@Req() req: Request) {
    return instanceToPlain(new User(req.user), { groups: [ 'self' ] });
  }

  // @Get('shield')
  // @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth()
  // @ApiCookieAuth()
  // @ApiOperation({
  //   summary: 'Get shield',
  //   description: 'Returns the shield for the current user. Requires a valid JWT token'
  // })
  // @ApiOkResponse({
  //   description: 'Current user shield',
  //   type: 'string'
  // })
  // // @Header('Content-Type', 'image/svg+xml')
  // getSessionUserShield(@Req() req: Request) {
  //   return this.shieldsService.generate(
  //     'achievements',
  //     (req.user as User).username
  //   );
  // }

  @Get('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiCookieAuth()
  @ApiOperation({
    summary: 'Logout',
    description: 'Clears the JWT cookie, and invalidates the JWT token'
  })
  @ApiUnauthorizedResponse({
    description: 'If the user is not authenticated, it cannot log out.'
  })
  @ApiOkResponse({
    description: 'The user has been logged out successfully.'
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
  async getSessionUserAvailableRepositories(
    @Param('system') system: SystemEnum,
    @ReqUser() user: User
  ) {
    const dbUser = await this.usersService.findOne(user.username);
    if (system === SystemEnum.GITLAB) {
      return await this.sessionUserService.getGitlabReposAccessibleByUser(dbUser);
    }

    if (system === SystemEnum.BITBUCKET) {
      return await this.sessionUserService.getBitbucketReposAccessibleByUser(dbUser);
    }

    return await this.sessionUserService.getAppInstalledByUserRepos(dbUser);
  }

  @Get('installations')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiCookieAuth()
  @ApiOperation({
    summary: 'Get current user installations',
    description: 'Will return the currently installed GitHub Apps'
  })
  async getSessionUserInstallations(@ReqUser() user: User) {
    const githubIntegration = user
      .integrations
      .find((integration) => integration.system === SystemEnum.GITHUB);

    const octokit = new Octokit({
      auth: githubIntegration.accessToken
    });

    const { data: installations } = await octokit.request('GET /app/installations');

    return installations;
  }

  @Post('install/:system/:repoFullName')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiCookieAuth()
  @ApiOperation({
    summary: 'Install webhook on repo',
    description: 'Will install a webhook on the given repository'
  })
  async installWebhookOnRepo(
    @Param('system') system: SystemEnum,
    @Param('repoFullName') repoFullName: string,
    @ReqUser() user: User
  ) {
    return await this.sessionUserService.installWebhookOnRepo(user, repoFullName, system);
  }

  @Delete('install/:system/:repoFullName')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiCookieAuth()
  @ApiOperation({
    summary: 'Uninstall webhook on repo',
    description: 'Will uninstall a webhook on the given repository'
  })
  async uninstallWebhookOnRepo(
    @Param('system') system: SystemEnum,
    @Param('repoFullName') repoFullName: string,
    @ReqUser() user: User
  ) {
    return await this.sessionUserService.uninstallWebhookOnRepo(user, repoFullName, system);
  }

  @Get('github/post-install')
  @UseGuards(JwtAuthOptionalGuard)
  @ApiBearerAuth()
  @ApiCookieAuth()
  @ApiOperation({
    summary: 'Post install',
    description: 'Will post install the GitHub App'
  })
  async postInstallGithubApp(
    @Query('installation_id') installationId: number,
    @Query('setup_action') setupAction: string,
    @ReqUser() user: User,
    @Res() res: Response
  ) {
    // await this.sessionUserService.installWebhookOnRepo(
    //   user,
    //   'asd',
    //   SystemEnum.GITHUB,
    //   installationId
    // );

    setTimeout(() => {
      this.eventsService.sendAchievementToUser('thatkookooguy', {
        name: 'Big Achievement Hunter',
        description: 'You have added a repository',
        id: 'big-achievement-hunter',
        avatar: 'https://github.com/k1b1b0t.png'
      });
    }, 5000);

    res.redirect('/profile/integrations');
  }
}
