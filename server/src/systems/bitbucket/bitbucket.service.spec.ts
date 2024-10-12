import { Test, TestingModule } from '@nestjs/testing';

import { BitbucketService } from './bitbucket.service';

describe('BitbucketService', () => {
  let service: BitbucketService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ BitbucketService ]
    }).compile();

    service = module.get<BitbucketService>(BitbucketService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
