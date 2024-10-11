import { Request, Response } from 'express';

import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { ReqUser } from '@kb-decorators';
import { User } from '@kb-models';

import { GitLabAuthGuard } from '../../guards/gitlab-auth.guard';
import { JwtService } from '../jwt/jwt.service';

@Controller('api/auth/gitlab')
@ApiTags('Authentication')
export class GitlabController {
  constructor(
    private readonly jwtService: JwtService
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Initiate GitLab OAuth flow',
    description: 'Redirects to GitLab OAuth flow for authentication',
    externalDocs: {
      description: 'GitLab OAuth',
      url: 'https://docs.gitlab.com/ee/api/oauth2.html'
    }
  })
  @UseGuards(GitLabAuthGuard)
  async gitlabAuth() {
    // console.log('gitlabAuth');
    // With `@UseGuards(GitLabOauthGuard)` we are using an AuthGuard that @nestjs/passport
    // automatically provisioned for us when we extended the passport-gitlab strategy.
    // The Guard initiates the passport-github flow.
  }

  @Get('callback')
  @ApiOperation({
    summary: 'GitLab OAuth callback',
    description: 'GitLab OAuth callback URL. This is the URL that GitLab will redirect to after authentication'
  })
  @UseGuards(GitLabAuthGuard)
  async gitlabAuthCallback(
      @ReqUser() user: User,
      @Req() req: Request,
      @Res({ passthrough: true }) res: Response
  ) {
    const { accessToken } = await this.jwtService.generateAccessToken(user);

    res.cookie('kibibit-jwt', accessToken, {
      httpOnly: true,
      secure: true, // Cookie only sent over HTTPS
      sameSite: 'none', // Cookie sent on cross-site requests
      maxAge: 3600000 // Cookie expiration time
    });

    // if client is NOT a browser, return the token
    if (!req.headers.referer) {
      return { access_token: accessToken };
    }

    return res.redirect('/');
  }
}
