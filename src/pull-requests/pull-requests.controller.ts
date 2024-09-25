import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@Controller('prs')
@ApiTags('Pull Requests')
export class PullRequestsController {}
