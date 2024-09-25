import { Request, Response } from 'express';

import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

import { User } from '@kb-models';

import { BitBucketAuthGuard } from '../../guards/bitbucket-auth.guard';
import { JwtService } from '../jwt/jwt.service';

@Controller('auth/bitbucket')
export class BitbucketController {
  constructor(
    private readonly jwtService: JwtService
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Initiate GitLab OAuth flow',
    description: 'Redirects to GitLab OAuth flow for authentication'
  })
  @UseGuards(BitBucketAuthGuard)
  async bitbucketAuth() {
    // console.log('gitlabAuth');
    // With `@UseGuards(GitLabOauthGuard)` we are using an AuthGuard that @nestjs/passport
    // automatically provisioned for us when we extended the passport-gitlab strategy.
    // The Guard initiates the passport-github flow.
  }

  @Get('callback')
  @ApiOperation({
    summary: 'BitBucket OAuth callback',
    description: 'BitBucket OAuth callback URL. This is the URL that BitBucket will redirect to after authentication'
  })
  @UseGuards(BitBucketAuthGuard)
  async bitbucketAuthCallback(
      @Req() req: Request,
      @Res({ passthrough: true }) res: Response
  ) {
    const user = req.user as User;

    const { accessToken } = await this.jwtService.generateAccessToken(user);

    res.cookie('jwt', accessToken);
    return { access_token: accessToken };
  }
}
