import { Test, TestingModule } from '@nestjs/testing';

import { PullRequestsService } from './pull-requests.service';

describe('PullRequestsService', () => {
  let service: PullRequestsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ PullRequestsService ]
    }).compile();

    service = module.get<PullRequestsService>(PullRequestsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
