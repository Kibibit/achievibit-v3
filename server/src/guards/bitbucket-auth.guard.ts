import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class BitBucketAuthGuard extends AuthGuard('bitbucket') {}
