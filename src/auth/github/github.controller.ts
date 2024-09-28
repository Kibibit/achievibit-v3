import { Request, Response } from 'express';

import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

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
      @Req() req: Request,
      @Res({ passthrough: true }) res: Response
  ) {
    const user = req.user as User;

    const { accessToken } = await this.jwtService.generateAccessToken(user);

    res.cookie('kibibit-jwt', accessToken);
    return { access_token: accessToken };
  }
}
