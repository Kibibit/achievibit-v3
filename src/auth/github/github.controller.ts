import { Request, Response } from 'express';

import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { configService } from '@kb-config';
import { ReqUser } from '@kb-decorators';
import { User } from '@kb-models';

import { GitHubAuthGuard } from '../../guards/github-auth.guard';
import { JwtService } from '../jwt/jwt.service';

@Controller('api/auth/github')
@ApiTags('Authentication')
export class GithubController {
  constructor(
    private readonly jwtService: JwtService
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Initiate Github OAuth flow',
    description: 'Redirects to Github OAuth flow for authentication',
    externalDocs: {
      description: 'Github OAuth',
      url: 'https://developer.github.com/apps/building-oauth-apps/authorizing-oauth-apps/'
    }
  })
  @UseGuards(GitHubAuthGuard)
  async githubAuth() {
    // With `@UseGuards(GithubOauthGuard)` we are using an AuthGuard that @nestjs/passport
    // automatically provisioned for us when we extended the passport-github strategy.
    // The Guard initiates the passport-github flow.
  }

  @Get('callback')
  @ApiOperation({
    summary: 'Github OAuth callback',
    description: 'Github OAuth callback URL. This is the URL that Github will redirect to after authentication'
  })
  @UseGuards(GitHubAuthGuard)
  async githubAuthCallback(
      @ReqUser() user: User,
      @Req() req: Request,
      @Res({ passthrough: true }) res: Response
  ) {
    const { accessToken } = await this.jwtService.generateAccessToken(user);

    res.cookie('kibibit-jwt', accessToken, {
      httpOnly: true,
      secure: configService.isProductionMode,
      sameSite: 'strict'
    });

    // if client is NOT a browser, return the token
    if (!req.headers.referer) {
      return { access_token: accessToken };
    }

    return res.redirect('/');
  }
}
