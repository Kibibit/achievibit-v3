import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GitHubAuthGuard } from './github-auth.guard';
import { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { IUser } from '@kb-models';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
@ApiTags('GitHub Authentication')
export class AuthController {
    constructor(
        private readonly jwtAuthService: AuthService
    ) {}

    @Get('github')
	@ApiOperation({
		summary: 'Initiate Github OAuth flow',
		description: 'Redirects to Github OAuth flow for authentication'
	})
	@UseGuards(GitHubAuthGuard)
	async githubAuth() {
		// With `@UseGuards(GithubOauthGuard)` we are using an AuthGuard that @nestjs/passport
		// automatically provisioned for us when we extended the passport-github strategy.
		// The Guard initiates the passport-github flow.
	}

	@Get('github/callback')
	@ApiOperation({
		summary: 'Github OAuth callback',
		description: 'Github OAuth callback URL. This is the URL that Github will redirect to after authentication'
	})
	@UseGuards(GitHubAuthGuard)
	async githubAuthCallback(
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response
    ) {
        console.log(req.user);
		const user = req.user as IUser;

		const { accessToken } = await this.jwtAuthService.githubLogin(user);
		res.cookie('jwt', accessToken);
		return { access_token: accessToken };
	}

    @Get('me')
    @UseGuards(JwtAuthGuard)
	@ApiBearerAuth()
    @ApiOperation({
		summary: 'Get current user',
		description: 'Returns the current user. Requires a valid JWT token'
	})
    async me(@Req() req: Request) {
        return req.user;
    }
}
