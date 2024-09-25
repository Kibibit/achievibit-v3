import { Test, TestingModule } from '@nestjs/testing';
import { PullRequestsController } from './pull-requests.controller';

describe('PullRequestsController', () => {
  let controller: PullRequestsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PullRequestsController],
    }).compile();

    controller = module.get<PullRequestsController>(PullRequestsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
