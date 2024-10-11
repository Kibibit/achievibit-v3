import { Request, Response } from 'express';

import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { ReqUser } from '@kb-decorators';
import { User } from '@kb-models';

import { BitBucketAuthGuard } from '../../guards/bitbucket-auth.guard';
import { JwtService } from '../jwt/jwt.service';

@Controller('api/auth/bitbucket')
@ApiTags('Authentication')
export class BitbucketController {
  constructor(
    private readonly jwtService: JwtService
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Initiate BitBucket OAuth flow',
    description: 'Redirects to BitBucket OAuth flow for authentication',
    externalDocs: {
      description: 'BitBucket OAuth',
      url: 'https://developer.atlassian.com/cloud/bitbucket/oauth-2/'
    }
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
