import { Test, TestingModule } from '@nestjs/testing';

import { BitbucketController } from './bitbucket.controller';

describe('BitbucketController', () => {
  let controller: BitbucketController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ BitbucketController ]
    }).compile();

    controller = module.get<BitbucketController>(BitbucketController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
